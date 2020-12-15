import { AuthRepository } from '../repositories';
import { Helpers, Services } from 'nk-node-library';
import { Services as JsServices, Utils } from 'nk-js-library';
import { PubSubMessageTypes } from '../helpers/pubsub.helper';

function confirmationTokenCollection() {
    return JsServices.MemoryDatabaseService.getDatabase('Auth').getCollection('ConfirmationToken');
}

class AuthService extends Services.BaseService {

    private static instance: AuthService;

    public static getInstance(): AuthService {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }

        return AuthService.instance;
    }

    private constructor() {
        super(new AuthRepository());
    }

    createJwt = (request: Helpers.Request, auth: Helpers.JWT.Auth, buildRefresh: boolean) => {

        const accessToken = Helpers.JWT.encodeToken(
            auth,
            Helpers.JWT.SECRET_TYPE.access,
            Helpers.JWT.TIME.s30
        );

        if (buildRefresh) {
            const refreshToken = Helpers.JWT.encodeToken(
                auth,
                Helpers.JWT.SECRET_TYPE.refresh,
                Helpers.JWT.TIME.d30
            );

            return { accessToken, refreshToken }
        }

        return { accessToken }
    }

    signUp = async (request: Helpers.Request, user) => {
        console.log(user)

        let {
            email,
            password,
            firstName,
            lastName,
            displayPicture,
            registrationType
        } = user

        console.log('querying for users on :', email);

        const users = await this.repository.getUsersByEmail(email);

        console.log('users', users);

        if (users.resultSize !== 0) {
            if (users.resultSize === 1) {
                return await this.signInRaw(request, users.result[0], password, true);
            }
            throw this.buildError(403, "A User has already registered with the email address.");
        }

        password = Helpers.Encryption.encryptPassword(password)

        let entity: any = {
            email,
            password,
            account: {
                type: registrationType
            }
        }

        if (registrationType === 'google') {
            entity.account.confirmedAt = new Date();
        }

        entity = await this.create(request, entity)

        const isConfirmed = entity.account.confirmedAt !== undefined;

        if (!entity)
            throw this.buildError(400);

        console.log(entity);

        const auth: Helpers.JWT.Auth = {
            id: entity._id,
            email,
            expiryTime: 0,
            isConfirmed
        };

        const { accessToken, refreshToken } = this.createJwt(request, auth, true);


        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.AUTH.USER_SIGNED_UP,
            data: {
                accessToken,
                refreshToken,
                userId: entity._id,
                email,
                firstName,
                lastName,
                displayPicture,
                ip: request.getIP()
            }
        });

        return { accessToken, refreshToken, isConfirmed, userId: entity._id }
    }

    signIn = async (request: Helpers.Request, user) => {

        let {
            email,
            password
        } = user

        const users = await this.repository.getUsersByEmail(email);

        if (users.resultSize === 0) {
            throw this.buildError(404, "A User with this email is not available.")
        }

        if (users.resultSize !== 1) {
            throw this.buildError(500, "Duplicate email error.")
        }

        const entity = users.result[0]

        return await this.signInRaw(request, entity, password);
    }

    signInRaw = async (request: Helpers.Request, entity, password: string, alternate: boolean = false) => {
        if (Helpers.Encryption.checkPassword(entity.password, password) == false) {
            throw this.buildError(403, alternate ? "A User has already registered with the email address." : "Incorrect email/password.")
        }
        const isConfirmed = entity.account.confirmedAt !== undefined;
        const auth: Helpers.JWT.Auth = {
            id: entity._id,
            email: entity.email,
            expiryTime: 0,
            isConfirmed
        };

        const { accessToken, refreshToken } = this.createJwt(request, auth, true);

        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.AUTH.USER_SIGNED_IN,
            data: {
                accessToken,
                refreshToken,
                userId: entity._id,
                email: entity.email,
                ip: request.getIP(),
                alternate
            }
        });

        return { accessToken, refreshToken, isConfirmed, userId: entity._id }

    }

    getMe = async (request: Helpers.Request) => {
        try {
            return await this.repository.getAccountById(request.getUserId());
        } catch (error) {
            console.log(error);
            return {};
        }
    }

    sendConfirmationToken = async (request: Helpers.Request) => {
        try {
            const confirmationToken = Utils.EncryptionUtils.encrypt(JSON.stringify({
                userId: request.getUserId(),
                time: new Date().getTime()
            }));

            let confirmationTokenAlias: string = '';

            while (confirmationTokenAlias === '' || confirmationTokenCollection().hasItem(confirmationTokenAlias)) {
                confirmationTokenAlias = Utils.CommonUtils.generateRandomString({ length: 6, numbers: true });
            }

            confirmationTokenCollection().putItem(confirmationTokenAlias, confirmationToken);

            console.log('\n\n\n\n\n\n\n\n\nconfirmationTokenAlias:', confirmationTokenAlias, '\n\n\n\n\n\n\n\n\n')

            const response = await Utils.MailerUtils.sendMail({
                from: 'CabBuddies',
                to: request.getEmail(),
                subject: 'Confirmation Token',
                text: `Here is your token : ${confirmationTokenAlias}`
            });

            if (response)
                return true;
        } catch (error) {
            console.log(error);
        }
        return false;
    }

    confirmationToken = async (request: Helpers.Request, data) => {
        try {
            let { token } = data;
            token = confirmationTokenCollection().getItem(token);
            token = JSON.parse(Utils.EncryptionUtils.decrypt(token));
            if (request.getUserId() === token.userId) {
                confirmationTokenCollection().deleteItem(token);
                await this.repository.setConfirmedAt(request.getUserId(), new Date());

                const { accessToken, refreshToken } = this.createJwt(request, {
                    id: request.getUserId(),
                    email: request.getEmail(),
                    expiryTime: 0,
                    isConfirmed: true
                }, true);

                Services.PubSub.publishMessage({
                    request,
                    type: PubSubMessageTypes.AUTH.USER_CONFIRMED,
                    data: {
                        accessToken,
                        refreshToken,
                        userId: request.getUserId(),
                        email: request.getEmail(),
                        ip: request.getIP()
                    }
                });

                return { accessToken, refreshToken, isConfirmed: true, userId: request.getUserId() };
            }
        } catch (error) {
            console.log(error);
        }
        return false;
    }


    getAccessToken = async (request: Helpers.Request) => {
        return {
            ...this.createJwt(request, {
                id: request.getUserId(),
                email: request.getEmail(),
                expiryTime: 0,
                isConfirmed: request.isUserConfirmed()
            }, false), isConfirmed: request.isUserConfirmed(), userId: request.getUserId()
        };
    }

    signOut = async (request: Helpers.Request) => {
        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.AUTH.USER_SIGN_OUT,
            data: {
                userId: request.getUserId(),
                refreshToken: request.getTokenValue()
            }
        });
    }

    signOutAll = async (request: Helpers.Request) => {
        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.AUTH.USER_SIGN_OUT_ALL,
            data: {
                userId: request.getUserId()
            }
        });
    }

}

export default AuthService.getInstance();
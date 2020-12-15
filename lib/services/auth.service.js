"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const repositories_1 = require("../repositories");
const nk_node_library_1 = require("nk-node-library");
const nk_js_library_1 = require("nk-js-library");
const pubsub_helper_1 = require("../helpers/pubsub.helper");
function confirmationTokenCollection() {
    return nk_js_library_1.Services.MemoryDatabaseService.getDatabase('Auth').getCollection('ConfirmationToken');
}
class AuthService extends nk_node_library_1.Services.BaseService {
    constructor() {
        super(new repositories_1.AuthRepository());
        this.createJwt = (request, auth, buildRefresh) => {
            const accessToken = nk_node_library_1.Helpers.JWT.encodeToken(auth, nk_node_library_1.Helpers.JWT.SECRET_TYPE.access, nk_node_library_1.Helpers.JWT.TIME.s30);
            if (buildRefresh) {
                const refreshToken = nk_node_library_1.Helpers.JWT.encodeToken(auth, nk_node_library_1.Helpers.JWT.SECRET_TYPE.refresh, nk_node_library_1.Helpers.JWT.TIME.d30);
                return { accessToken, refreshToken };
            }
            return { accessToken };
        };
        this.signUp = (request, user) => __awaiter(this, void 0, void 0, function* () {
            console.log(user);
            let { email, password, firstName, lastName, displayPicture, registrationType } = user;
            console.log('querying for users on :', email);
            const users = yield this.repository.getUsersByEmail(email);
            console.log('users', users);
            if (users.resultSize !== 0) {
                if (users.resultSize === 1) {
                    return yield this.signInRaw(request, users.result[0], password, true);
                }
                throw this.buildError(403, "A User has already registered with the email address.");
            }
            password = nk_node_library_1.Helpers.Encryption.encryptPassword(password);
            let entity = {
                email,
                password,
                account: {
                    type: registrationType
                }
            };
            if (registrationType === 'google') {
                entity.account.confirmedAt = new Date();
            }
            entity = yield this.create(request, entity);
            const isConfirmed = entity.account.confirmedAt !== undefined;
            if (!entity)
                throw this.buildError(400);
            console.log(entity);
            const auth = {
                id: entity._id,
                email,
                expiryTime: 0,
                isConfirmed
            };
            const { accessToken, refreshToken } = this.createJwt(request, auth, true);
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGNED_UP,
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
            return { accessToken, refreshToken, isConfirmed, userId: entity._id };
        });
        this.signIn = (request, user) => __awaiter(this, void 0, void 0, function* () {
            let { email, password } = user;
            const users = yield this.repository.getUsersByEmail(email);
            if (users.resultSize === 0) {
                throw this.buildError(404, "A User with this email is not available.");
            }
            if (users.resultSize !== 1) {
                throw this.buildError(500, "Duplicate email error.");
            }
            const entity = users.result[0];
            return yield this.signInRaw(request, entity, password);
        });
        this.signInRaw = (request, entity, password, alternate = false) => __awaiter(this, void 0, void 0, function* () {
            if (nk_node_library_1.Helpers.Encryption.checkPassword(entity.password, password) == false) {
                throw this.buildError(403, alternate ? "A User has already registered with the email address." : "Incorrect email/password.");
            }
            const isConfirmed = entity.account.confirmedAt !== undefined;
            const auth = {
                id: entity._id,
                email: entity.email,
                expiryTime: 0,
                isConfirmed
            };
            const { accessToken, refreshToken } = this.createJwt(request, auth, true);
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGNED_IN,
                data: {
                    accessToken,
                    refreshToken,
                    userId: entity._id,
                    email: entity.email,
                    ip: request.getIP(),
                    alternate
                }
            });
            return { accessToken, refreshToken, isConfirmed, userId: entity._id };
        });
        this.getMe = (request) => __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.repository.getAccountById(request.getUserId());
            }
            catch (error) {
                console.log(error);
                return {};
            }
        });
        this.sendConfirmationToken = (request) => __awaiter(this, void 0, void 0, function* () {
            try {
                const confirmationToken = nk_js_library_1.Utils.EncryptionUtils.encrypt(JSON.stringify({
                    userId: request.getUserId(),
                    time: new Date().getTime()
                }));
                let confirmationTokenAlias = '';
                while (confirmationTokenAlias === '' || confirmationTokenCollection().hasItem(confirmationTokenAlias)) {
                    confirmationTokenAlias = nk_js_library_1.Utils.CommonUtils.generateRandomString({ length: 6, numbers: true });
                }
                confirmationTokenCollection().putItem(confirmationTokenAlias, confirmationToken);
                console.log('\n\n\n\n\n\n\n\n\nconfirmationTokenAlias:', confirmationTokenAlias, '\n\n\n\n\n\n\n\n\n');
                const response = yield nk_js_library_1.Utils.MailerUtils.sendMail({
                    from: 'CabBuddies',
                    to: request.getEmail(),
                    subject: 'Confirmation Token',
                    text: `Here is your token : ${confirmationTokenAlias}`
                });
                if (response)
                    return true;
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
        this.confirmationToken = (request, data) => __awaiter(this, void 0, void 0, function* () {
            try {
                let { token } = data;
                token = confirmationTokenCollection().getItem(token);
                token = JSON.parse(nk_js_library_1.Utils.EncryptionUtils.decrypt(token));
                if (request.getUserId() === token.userId) {
                    confirmationTokenCollection().deleteItem(token);
                    yield this.repository.setConfirmedAt(request.getUserId(), new Date());
                    const { accessToken, refreshToken } = this.createJwt(request, {
                        id: request.getUserId(),
                        email: request.getEmail(),
                        expiryTime: 0,
                        isConfirmed: true
                    }, true);
                    nk_node_library_1.Services.PubSub.publishMessage({
                        request,
                        type: pubsub_helper_1.PubSubMessageTypes.AUTH.USER_CONFIRMED,
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
            }
            catch (error) {
                console.log(error);
            }
            return false;
        });
        this.getAccessToken = (request) => __awaiter(this, void 0, void 0, function* () {
            return Object.assign(Object.assign({}, this.createJwt(request, {
                id: request.getUserId(),
                email: request.getEmail(),
                expiryTime: 0,
                isConfirmed: request.isUserConfirmed()
            }, false)), { isConfirmed: request.isUserConfirmed(), userId: request.getUserId() });
        });
        this.signOut = (request) => __awaiter(this, void 0, void 0, function* () {
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGN_OUT,
                data: {
                    userId: request.getUserId(),
                    refreshToken: request.getTokenValue()
                }
            });
        });
        this.signOutAll = (request) => __awaiter(this, void 0, void 0, function* () {
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGN_OUT_ALL,
                data: {
                    userId: request.getUserId()
                }
            });
        });
    }
    static getInstance() {
        if (!AuthService.instance) {
            AuthService.instance = new AuthService();
        }
        return AuthService.instance;
    }
}
exports.default = AuthService.getInstance();

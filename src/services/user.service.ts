import { UserRepository } from '../repositories';
import { Services, Helpers } from 'nk-node-library';
import { Services as JsServices, Utils } from 'nk-js-library';
import { PubSubMessageTypes } from '../helpers/pubsub.helper';
import { BinderNames } from '../helpers/binder.helper';

class UserService extends Services.BaseService {

    private static instance: UserService;

    public static getInstance(): UserService {
        if (!UserService.instance) {
            UserService.instance = new UserService();
        }

        return UserService.instance;
    }

    private constructor() {
        super(new UserRepository());
        Services.PubSub.addSubscriber(PubSubMessageTypes.AUTH.USER_SIGNED_UP, this);
        JsServices.BinderService.bindFunction(BinderNames.USER.EXTRACT.USER_PROFILES, this.getUsersByUserIds);
        JsServices.BinderService.bindFunction(BinderNames.USER.CHECK.ID_EXISTS, this.userIdExists);
    }

    processMessage(message: Services.PubSub.NLMessage) {
        console.log('UserService', message);
        switch (message.type) {
            case PubSubMessageTypes.AUTH.USER_SIGNED_UP:
                this.userCreated(message);
                break;

            default:
                break;
        }
    }

    userIdExists = async (request: Helpers.Request, userId: string) => {
        return this.repository.getUserByUserId(userId);
    }

    getUsersByUserIds = async (userIds: string[]) => {
        return await this.repository.getUsersByUserIds(userIds);
    }

    userCreated(event: Services.PubSub.NLMessage) {

        const {
            userId,
            email,
            firstName,
            lastName
        } = event.data;

        this.create(event.request, {
            userId,
            email,
            firstName,
            lastName
        });

    }

    getUserByEmail = async (request: Helpers.Request, email) => {
        return await this.repository.getUserByEmail(email);
    }

    getUserByUserId = async (request: Helpers.Request, userId) => {
        return await this.repository.getUserByUserId(userId);
    }

    getAll = async (request: Helpers.Request, query = {}, sort = {}, pageSize: number = 5, pageNum: number = 1, attributes: string[] = []) => {
        const exposableAttributes = ['userId', 'email', 'firstName', 'lastName', 'displayPicture'];
        if (attributes.length === 0)
            attributes = exposableAttributes;
        else
            attributes = attributes.filter(function (el: string) {
                return exposableAttributes.includes(el);
            });
        return this.repository.getAll(query, sort, pageSize, pageNum, attributes);
    }

    update = async (request: Helpers.Request, entityId, body) => {
        body.lastModifiedAt = new Date();
        return await this.repository.updateUserByUserId(request.getUserId(), Utils.JSONUtils.normalizeJson(body));
    }
}

export default UserService.getInstance();
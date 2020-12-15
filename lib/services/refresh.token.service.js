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
const pubsub_helper_1 = require("../helpers/pubsub.helper");
class RefreshTokenService extends nk_node_library_1.Services.BaseService {
    constructor() {
        super(new repositories_1.RefreshTokenRepository());
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.AUTH, this);
    }
    static getInstance() {
        if (!RefreshTokenService.instance) {
            RefreshTokenService.instance = new RefreshTokenService();
        }
        return RefreshTokenService.instance;
    }
    processMessage(message) {
        console.log('UserService', message);
        switch (message.type) {
            case pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGNED_UP:
            case pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGNED_IN:
            case pubsub_helper_1.PubSubMessageTypes.AUTH.USER_CONFIRMED:
                this.refreshTokenCreate(message);
                break;
            case pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGN_OUT:
            case pubsub_helper_1.PubSubMessageTypes.AUTH.USER_SIGN_OUT_ALL:
                this.refreshTokenDelete(message);
                break;
            default:
                break;
        }
    }
    refreshTokenCreate(message) {
        const { userId, refreshToken, ip } = message.data;
        this.repository.create({
            userId,
            refreshToken,
            ip
        });
    }
    refreshTokenDelete(message) {
        const { userId, refreshToken, ip } = message.data;
        if (userId) {
            this.repository.removeAllByUserId(userId);
        }
        else if (refreshToken) {
            this.repository.removeByRefreshToken(refreshToken.value);
        }
    }
    getActiveRefreshTokenCount(request) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('getActiveRefreshTokenCount', 'tokenValue', request.getTokenValue());
            return yield this.repository.getActiveRefreshTokenCount(request.getTokenValue());
        });
    }
}
exports.default = RefreshTokenService.getInstance();

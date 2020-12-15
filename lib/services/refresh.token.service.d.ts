import { Services, Helpers } from 'nk-node-library';
declare class RefreshTokenService extends Services.BaseService {
    private static instance;
    static getInstance(): RefreshTokenService;
    private constructor();
    processMessage(message: Services.PubSub.NLMessage): void;
    refreshTokenCreate(message: Services.PubSub.NLMessage): void;
    refreshTokenDelete(message: Services.PubSub.NLMessage): void;
    getActiveRefreshTokenCount(request: Helpers.Request): Promise<any>;
}
declare const _default: RefreshTokenService;
export default _default;

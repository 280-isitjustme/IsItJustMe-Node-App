import { Services, Helpers } from 'nk-node-library';
declare class UserService extends Services.BaseService {
    private static instance;
    static getInstance(): UserService;
    private constructor();
    processMessage(message: Services.PubSub.NLMessage): void;
    userIdExists: (request: Helpers.Request, userId: string) => Promise<any>;
    getUsersByUserIds: (userIds: string[]) => Promise<any>;
    userCreated(event: Services.PubSub.NLMessage): void;
    getUserByEmail: (request: Helpers.Request, email: any) => Promise<any>;
    getUserByUserId: (request: Helpers.Request, userId: any) => Promise<any>;
    getAll: (request: Helpers.Request, query?: {}, sort?: {}, pageSize?: number, pageNum?: number, attributes?: string[]) => Promise<{
        query: any;
        sort: any;
        attributes: any;
        pageSize: number;
        pageNum: number;
        resultSize: number;
        resultTotalSize: number;
        result: any[];
    }>;
    update: (request: Helpers.Request, entityId: any, body: any) => Promise<any>;
}
declare const _default: UserService;
export default _default;

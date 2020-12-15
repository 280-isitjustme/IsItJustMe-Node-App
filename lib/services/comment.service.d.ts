import { Helpers, Services } from 'nk-node-library';
import StatsService from './stats.service';
declare class CommentService extends StatsService {
    private static instance;
    private constructor();
    static getInstance(): CommentService;
    processMessage(message: Services.PubSub.NLMessage): void;
    possibleCommentResolve(request: Helpers.Request, data: any, enable: boolean): void;
    create: (request: Helpers.Request, data: any) => Promise<object>;
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
    get: (request: Helpers.Request, documentId: string, attributes?: any[]) => Promise<object>;
    update: (request: Helpers.Request, documentId: string, data: any) => Promise<object>;
    delete: (request: Helpers.Request, documentId: string) => Promise<object>;
}
declare const _default: CommentService;
export default _default;

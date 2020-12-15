import { Helpers, Services } from 'nk-node-library';
declare class OpinionService extends Services.AuthorService {
    private static instance;
    private constructor();
    static getInstance(): OpinionService;
    create: (request: Helpers.Request, data: any) => Promise<any>;
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
    delete: (request: Helpers.Request, documentId: any) => Promise<any>;
}
declare const _default: OpinionService;
export default _default;

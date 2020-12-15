import { Helpers, Services } from 'nk-node-library';
import StatsService from './stats.service';
declare class PostService extends StatsService {
    private static instance;
    private constructor();
    static getInstance(): PostService;
    processMessage(message: Services.PubSub.NLMessage): void;
    postRead(request: Helpers.Request, data: any): void;
    commentStats: (request: Helpers.Request, data: any, entityAttribute: string, increased: boolean) => Promise<any>;
    commentContextChanged: (request: Helpers.Request, data: any, entityAttribute: string) => Promise<any>;
    sanitizeTags: (tags: string[]) => string[];
    embedTagInformation: (request: Helpers.Request, arr?: any[]) => Promise<any[]>;
    create: (request: Helpers.Request, data: any, override?: boolean) => Promise<any>;
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
    get: (request: Helpers.Request, documentId: string, attributes?: any[]) => Promise<any>;
    update: (request: Helpers.Request, documentId: string, data: any) => Promise<any>;
    delete: (request: Helpers.Request, documentId: string) => Promise<any>;
    tagsChanged: (oldTags: string[], newTags: string[]) => {
        deleted: string[];
        added: string[];
        tagsChanged: boolean;
    };
    deepEqual: (x: any, y: any) => boolean;
}
declare const _default: PostService;
export default _default;

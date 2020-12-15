import { Helpers, Services } from 'nk-node-library';
declare class TagService extends Services.BaseService {
    private static instance;
    private constructor();
    static getInstance(): TagService;
    processMessage(message: Services.PubSub.NLMessage): void;
    getTagsByTagList: (tags: string[]) => Promise<any>;
    updateTags: (request: Helpers.Request, oldTags: string[], newTags: string[]) => Promise<void>;
}
declare const _default: TagService;
export default _default;

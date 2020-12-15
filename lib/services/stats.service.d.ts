import { Helpers, Services } from 'nk-node-library';
import { StatsRepository } from '../repositories';
declare class StatsService extends Services.AuthorService {
    constructor(repository: StatsRepository);
    updateStatMany: (request: Helpers.Request, entityId: string, data: {
        property: string;
        increase: number;
    }[]) => Promise<any>;
    opinionCreated: (request: Helpers.Request, data: any, entityAttribute: string) => Promise<any>;
    opinionDeleted: (request: Helpers.Request, data: any, entityAttribute: string) => Promise<any>;
}
export default StatsService;

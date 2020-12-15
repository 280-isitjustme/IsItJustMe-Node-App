import { Repositories } from 'nk-node-library';
import * as mongoose from 'mongoose';
declare class StatsRepository extends Repositories.AuthorRepository {
    constructor(model: mongoose.Model<any, {}>);
    updateStat: (entityId: any, property: string, increase: boolean) => Promise<any>;
    updateStatMany: (entityId: any, data: {
        property: string;
        increase: number;
    }[]) => Promise<any>;
}
export default StatsRepository;

import { Helpers, Services } from 'nk-node-library';
import { Utils } from 'nk-js-library';
import { StatsRepository } from '../repositories';

class StatsService extends Services.AuthorService {

    constructor(repository: StatsRepository) {
        super(repository);
    }

    // updateStat = async(request:Helpers.Request, entityId:string, statType:string, increase:boolean) => {
    //     console.log('updateStat',entityId,statType,increase);
    //     return await this.repository.updateStat(entityId,statType,increase);
    // }

    updateStatMany = async (request: Helpers.Request, entityId: string, data: { property: string, increase: number }[]) => {
        console.log('updateStat', entityId, data);
        return await this.repository.updateStatMany(entityId, data);
    }

    opinionCreated = async (request: Helpers.Request, data: any, entityAttribute: string) => {
        console.log('opinionCreated', data, entityAttribute, data[entityAttribute]);
        if (entityAttribute in data === false && data[entityAttribute] !== 'none') {
            console.log('opinionCreated', entityAttribute, 'nope');
            return;
        }
        const scoreMap = {
            'follow': 2,
            'upvote': 1,
            'downvote': -1,
            'spamreport': -2
        };
        return await this.updateStatMany(request, data[entityAttribute], [
            {
                property: data['opinionType'] + 'Count',
                increase: 1
            },
            {
                property: 'score',
                increase: scoreMap[data['opinionType']]
            }
        ]);
    }

    opinionDeleted = async (request: Helpers.Request, data: any, entityAttribute: string) => {
        console.log('opinionDeleted', data, entityAttribute, data[entityAttribute]);
        if (entityAttribute in data === false && data[entityAttribute] !== 'none')
            return;

        const scoreMap = {
            'follow': -2,
            'upvote': -1,
            'downvote': 1,
            'spamreport': 2
        };

        return await this.updateStatMany(request, data[entityAttribute], [
            {
                property: data['opinionType'] + 'Count',
                increase: -1
            },
            {
                property: 'score',
                increase: scoreMap[data['opinionType']]
            }
        ]);
    }

}

export default StatsService;
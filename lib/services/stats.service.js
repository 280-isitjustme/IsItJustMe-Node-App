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
const nk_node_library_1 = require("nk-node-library");
class StatsService extends nk_node_library_1.Services.AuthorService {
    constructor(repository) {
        super(repository);
        this.updateStatMany = (request, entityId, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('updateStat', entityId, data);
            return yield this.repository.updateStatMany(entityId, data);
        });
        this.opinionCreated = (request, data, entityAttribute) => __awaiter(this, void 0, void 0, function* () {
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
            return yield this.updateStatMany(request, data[entityAttribute], [
                {
                    property: data['opinionType'] + 'Count',
                    increase: 1
                },
                {
                    property: 'score',
                    increase: scoreMap[data['opinionType']]
                }
            ]);
        });
        this.opinionDeleted = (request, data, entityAttribute) => __awaiter(this, void 0, void 0, function* () {
            console.log('opinionDeleted', data, entityAttribute, data[entityAttribute]);
            if (entityAttribute in data === false && data[entityAttribute] !== 'none')
                return;
            const scoreMap = {
                'follow': -2,
                'upvote': -1,
                'downvote': 1,
                'spamreport': 2
            };
            return yield this.updateStatMany(request, data[entityAttribute], [
                {
                    property: data['opinionType'] + 'Count',
                    increase: -1
                },
                {
                    property: 'score',
                    increase: scoreMap[data['opinionType']]
                }
            ]);
        });
    }
}
exports.default = StatsService;

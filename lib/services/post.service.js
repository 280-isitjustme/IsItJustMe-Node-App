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
const repositories_1 = require("../repositories");
const nk_node_library_1 = require("nk-node-library");
const nk_js_library_1 = require("nk-js-library");
const pubsub_helper_1 = require("../helpers/pubsub.helper");
const binder_helper_1 = require("../helpers/binder.helper");
const stats_service_1 = require("./stats.service");
const CommonUtils = require("../helpers/common.helper");
class PostService extends stats_service_1.default {
    constructor() {
        super(new repositories_1.PostRepository());
        this.commentStats = (request, data, entityAttribute, increased) => __awaiter(this, void 0, void 0, function* () {
            console.log('commentStats', data, entityAttribute, increased);
            if (entityAttribute in data === false)
                return;
            const statsMap = {
                'general': ['comment'],
                'update': ['comment', 'update'],
                'resolve': ['comment', 'resolve']
            };
            const stats = [];
            statsMap[data['context']].forEach((sm) => {
                stats.push({ property: `${sm}Count`, increase: increased ? 1 : -1 });
            });
            return yield this.updateStatMany(request, data[entityAttribute], stats);
        });
        this.commentContextChanged = (request, data, entityAttribute) => __awaiter(this, void 0, void 0, function* () {
            console.log('commentContextChanged', data, entityAttribute);
            if (entityAttribute in data === false)
                return;
            let stats = [];
            if (data['old'] === 'general' && data['new'] === 'update')
                stats = [{ property: 'updateCount', increase: 1 }];
            if (data['old'] === 'general' && data['new'] === 'resolve')
                stats = [{ property: 'resolveCount', increase: 1 }];
            if (data['old'] === 'update' && data['new'] === 'general')
                stats = [{ property: 'updateCount', increase: -1 }];
            if (data['old'] === 'update' && data['new'] === 'resolve')
                stats = [{ property: 'updateCount', increase: -1 }, { property: 'resolveCount', increase: 1 }];
            if (data['old'] === 'resolve' && data['new'] === 'general')
                stats = [{ property: 'resolveCount', increase: -1 }];
            if (data['old'] === 'resolve' && data['new'] === 'update')
                stats = [{ property: 'updateCount', increase: 1 }, { property: 'resolveCount', increase: -1 }];
            return yield this.updateStatMany(request, data[entityAttribute], stats);
        });
        this.sanitizeTags = (tags) => {
            return [...new Set(tags.map((tag) => tag.trim().toLowerCase().replace(/  +/g, ' ')))];
        };
        this.embedTagInformation = (request, arr = []) => __awaiter(this, void 0, void 0, function* () {
            console.log('embedTagInformation', arr);
            try {
                if (arr.length === 0)
                    return arr;
                const tags = {};
                arr.forEach((a) => {
                    a.content.tags.forEach((at) => {
                        tags[at] = {};
                    });
                });
                const tagInfos = yield nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.TAG.EXTRACT.TAG_LIST)(Object.keys(tags));
                tagInfos.forEach((tagInfo) => {
                    tagInfo = JSON.parse(JSON.stringify(tagInfo));
                    tags[tagInfo['tag']] = tagInfo;
                });
                console.log('embedTagInformation', tags);
                for (let i = 0; i < arr.length; i++) {
                    arr[i] = JSON.parse(JSON.stringify(arr[i]));
                    arr[i]['content']['tags'] = arr[i]['content']['tags'].map(tag => tags[tag]);
                }
                console.log('embedTagInformation', arr);
            }
            catch (error) {
                console.error(error);
            }
            return arr;
        });
        this.create = (request, data, override = false) => __awaiter(this, void 0, void 0, function* () {
            console.log('post.service', request, data);
            if (!override) {
                data.author = request.getUserId();
                data.location = data.location || request.getLocation();
                if (!data.location.raw) {
                    data.location.raw = (yield CommonUtils.reverseLookup(data.location));
                }
                data.content.tags = this.sanitizeTags(data.content.tags);
                console.log('post.service', 'db insert', data);
            }
            try {
                data = yield this.repository.create(data);
            }
            catch (error) {
                throw this.buildError(400, error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.POST.CREATED,
                data
            });
            console.log('post.service', 'published message');
            if (!override) {
                data = (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
                data = (yield this.embedTagInformation(request, [data]))[0];
            }
            return data;
        });
        this.getAll = (request, query = {}, sort = {}, pageSize = 5, pageNum = 1, attributes = []) => __awaiter(this, void 0, void 0, function* () {
            const exposableAttributes = ['author', 'content.title', 'content.tags', 'location', 'status', 'isDeleted', 'stats', 'createdAt', 'lastModifiedAt', 'threadLastUpdatedAt'];
            if (attributes.length === 0)
                attributes = exposableAttributes;
            else
                attributes = attributes.filter(function (el) {
                    return exposableAttributes.includes(el);
                });
            const data = yield this.repository.getAll(query, sort, pageSize, pageNum, attributes);
            data.result = yield this.embedAuthorInformation(request, data.result, ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES));
            data.result = yield this.embedTagInformation(request, data.result);
            return data;
        });
        this.get = (request, documentId, attributes) => __awaiter(this, void 0, void 0, function* () {
            let data = yield this.repository.get(documentId, attributes);
            if (!data)
                this.buildError(404);
            if (request.raw.query['full']) {
                nk_node_library_1.Services.PubSub.publishMessage({
                    request,
                    type: pubsub_helper_1.PubSubMessageTypes.POST.READ,
                    data
                });
            }
            data = (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
            data = (yield this.embedTagInformation(request, [data]))[0];
            console.log(data);
            return data;
        });
        this.update = (request, documentId, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('post.service', request, data);
            data.lastModifiedAt = new Date();
            data.isDeleted = false;
            data.content.tags = this.sanitizeTags(data.content.tags);
            console.log('post.service', 'db update', data);
            const old = yield this.repository.get(documentId);
            if (!old)
                throw this.buildError(404, 'postId not found');
            try {
                data = yield this.repository.updatePartial(documentId, data);
            }
            catch (error) {
                throw this.buildError(400, error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.POST.UPDATED,
                data
            });
            const { added, deleted, tagsChanged } = this.tagsChanged(old.content.tags, data.content.tags);
            if (tagsChanged) {
                nk_node_library_1.Services.PubSub.publishMessage({
                    request,
                    type: pubsub_helper_1.PubSubMessageTypes.POST.TAG_CHANGED,
                    data: {
                        added,
                        deleted
                    }
                });
            }
            data = (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
            data = (yield this.embedTagInformation(request, [data]))[0];
            return data;
        });
        this.delete = (request, documentId) => __awaiter(this, void 0, void 0, function* () {
            let data = {
                isDeleted: true
            };
            try {
                data = yield this.repository.updatePartial(documentId, data);
            }
            catch (error) {
                throw this.buildError(400, error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.POST.DELETED,
                data
            });
            data = (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
            data = (yield this.embedTagInformation(request, [data]))[0];
            return data;
        });
        this.tagsChanged = (oldTags, newTags) => {
            const oldSet = new Set(oldTags);
            const newSet = new Set(newTags);
            oldSet.forEach((o) => {
                if (newSet.delete(o))
                    oldSet.delete(o);
            });
            return { deleted: [...oldSet], added: [...newSet], tagsChanged: (oldSet.size > 0 || newSet.size > 0) };
        };
        this.deepEqual = (x, y) => {
            if (x === y) {
                return true;
            }
            else if ((typeof x == "object" && x != null) && (typeof y == "object" && y != null)) {
                if (Object.keys(x).length != Object.keys(y).length)
                    return false;
                for (var prop in x) {
                    if (y.hasOwnProperty(prop)) {
                        if (!this.deepEqual(x[prop], y[prop]))
                            return false;
                    }
                    else
                        return false;
                }
                return true;
            }
            else
                return false;
        };
        nk_js_library_1.Services.BinderService.bindFunction(binder_helper_1.BinderNames.POST.CHECK.ID_EXISTS, this.checkIdExists);
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.POST, this);
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.COMMENT, this);
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.OPINION, this);
    }
    static getInstance() {
        if (!PostService.instance) {
            PostService.instance = new PostService();
        }
        return PostService.instance;
    }
    processMessage(message) {
        switch (message.type) {
            case pubsub_helper_1.PubSubMessageTypes.POST.READ:
                this.postRead(message.request, message.data);
                break;
            case pubsub_helper_1.PubSubMessageTypes.OPINION.CREATED:
                this.opinionCreated(message.request, message.data, 'postId');
                break;
            case pubsub_helper_1.PubSubMessageTypes.OPINION.DELETED:
                this.opinionDeleted(message.request, message.data, 'postId');
                break;
            case pubsub_helper_1.PubSubMessageTypes.COMMENT.CREATED:
                this.commentStats(message.request, message.data, 'postId', true);
                break;
            case pubsub_helper_1.PubSubMessageTypes.COMMENT.DELETED:
                this.commentStats(message.request, message.data, 'postId', false);
                break;
            case pubsub_helper_1.PubSubMessageTypes.COMMENT.CONTEXT_CHANGED:
                this.commentContextChanged(message.request, message.data, 'postId');
                break;
        }
    }
    postRead(request, data) {
        this.updateStatMany(request, data._id, [{ property: "viewCount", increase: 1 }]);
    }
}
exports.default = PostService.getInstance();

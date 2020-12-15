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
const CommonUtils = require("../helpers/common.helper");
class OpinionService extends nk_node_library_1.Services.AuthorService {
    constructor() {
        super(new repositories_1.OpinionRepository());
        this.create = (request, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('opinion.service', request, data);
            data.postId = request.raw.params['postId'];
            data.commentId = request.raw.params['commentId'] || 'none';
            data.location = data.location || request.getLocation();
            if (!data.location.raw) {
                data.location.raw = (yield CommonUtils.reverseLookup(data.location));
            }
            const post = yield nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.POST.CHECK.ID_EXISTS)(request, data.postId);
            console.log('comment.service', 'create', 'postIdExists', post);
            if (!post)
                throw this.buildError(404, 'postId not available');
            if (data.commentId !== 'none') {
                const comment = yield nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.COMMENT.CHECK.ID_EXISTS)(request, data.commentId);
                console.log('comment.service', 'create', 'commentIdExists', comment);
                if (!comment)
                    throw this.buildError(404, 'commentId not available');
                if (comment.postId !== data.postId)
                    throw this.buildError(404, 'commentId not available under the postId');
            }
            data.author = request.getUserId();
            data.postAuthorOpinion = data.author === post.author;
            let response = yield this.repository.getAll({
                author: data.author,
                postId: data.postId,
                commentId: data.commentId
            }, {}, 100);
            if (response.resultSize > 0) {
                for (const opinion of response.result) {
                    console.log('OpinionService', 'Create', opinion, data);
                    if (data.opinionType === opinion.opinionType) {
                        return opinion;
                    }
                    if ((data.opinionType === 'upvote' && opinion.opinionType === 'downvote')
                        ||
                            (data.opinionType === 'downvote' && opinion.opinionType === 'upvote')) {
                        yield this.delete(request, opinion._id);
                    }
                }
            }
            data = nk_js_library_1.Utils.JSONUtils.normalizeJson(data);
            console.log('opinion.service', 'db insert', data);
            data = yield this.repository.create(data);
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.OPINION.CREATED,
                data
            });
            console.log('opinion.service', 'published message');
            return data;
        });
        this.getAll = (request, query = {}, sort = {}, pageSize = 5, pageNum = 1, attributes = []) => __awaiter(this, void 0, void 0, function* () {
            const exposableAttributes = ['author', 'postId', 'commentId', 'location', 'opinionType', 'isDeleted', 'stats', 'createdAt', 'lastModifiedAt'];
            if (attributes.length === 0)
                attributes = exposableAttributes;
            else
                attributes = attributes.filter(function (el) {
                    return exposableAttributes.includes(el);
                });
            const postId = request.raw.params['postId'];
            const commentId = request.raw.params['commentId'] || 'none';
            const data = yield this.repository.getAll({
                $and: [
                    query,
                    {
                        postId,
                        commentId
                    }
                ]
            }, sort, pageSize, pageNum, attributes);
            data.result = yield this.embedAuthorInformation(request, data.result, ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES));
            return data;
        });
        this.get = (request, documentId, attributes) => __awaiter(this, void 0, void 0, function* () {
            const postId = request.raw.params['postId'];
            const commentId = request.raw.params['commentId'] || 'none';
            const data = yield this.repository.getOne({ _id: documentId, postId, commentId }, attributes);
            if (!data)
                this.buildError(404);
            return (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
        });
        this.delete = (request, documentId) => __awaiter(this, void 0, void 0, function* () {
            const postId = request.raw.params['postId'];
            const commentId = request.raw.params['commentId'] || 'none';
            const query = {
                postId,
                commentId,
                _id: documentId
            };
            let data = yield this.repository.deleteOne(query);
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.OPINION.DELETED,
                data
            });
            return data;
        });
    }
    static getInstance() {
        if (!OpinionService.instance) {
            OpinionService.instance = new OpinionService();
        }
        return OpinionService.instance;
    }
}
exports.default = OpinionService.getInstance();

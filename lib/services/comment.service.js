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
class CommentService extends stats_service_1.default {
    constructor() {
        super(new repositories_1.CommentRepository());
        this.create = (request, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('comment.service', request, data);
            data.postId = request.raw.params['postId'];
            data.location = data.location || request.getLocation();
            if (!data.location.raw) {
                data.location.raw = (yield CommonUtils.reverseLookup(data.location));
            }
            const post = yield nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.POST.CHECK.ID_EXISTS)(request, data.postId);
            console.log('comment.service', 'create', 'postIdExists', post);
            if (!post)
                throw this.buildError(404, 'postId not available');
            data.author = request.getUserId();
            if (data.context === 'resolve') {
                if (data.author !== post.author)
                    throw this.buildError(403, 'Since you are not the author of the post, you are not allowed to post resolve comments on the post.');
            }
            data = nk_js_library_1.Utils.JSONUtils.normalizeJson(data);
            console.log('comment.service', 'db insert', data);
            try {
                data = yield this.repository.create(data);
            }
            catch (error) {
                throw this.buildError(error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.COMMENT.CREATED,
                data
            });
            console.log('comment.service', 'published message');
            return (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
        });
        this.getAll = (request, query = {}, sort = {}, pageSize = 5, pageNum = 1, attributes = []) => __awaiter(this, void 0, void 0, function* () {
            const exposableAttributes = ['author', 'postId', 'content', 'context', 'location', 'status', 'isDeleted', 'stats', 'createdAt', 'lastModifiedAt'];
            if (attributes.length === 0)
                attributes = exposableAttributes;
            else
                attributes = attributes.filter(function (el) {
                    return exposableAttributes.includes(el);
                });
            const postId = request.raw.params['postId'];
            const data = yield this.repository.getAll({
                $and: [
                    query,
                    {
                        postId
                    }
                ]
            }, sort, pageSize, pageNum, attributes);
            data.result = yield this.embedAuthorInformation(request, data.result, ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES));
            return data;
        });
        this.get = (request, documentId, attributes) => __awaiter(this, void 0, void 0, function* () {
            const postId = request.raw.params['postId'];
            const data = yield this.repository.getOne({ _id: documentId, postId }, attributes);
            if (!data)
                this.buildError(404);
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.COMMENT.READ,
                data
            });
            return (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
        });
        this.update = (request, documentId, data) => __awaiter(this, void 0, void 0, function* () {
            console.log('comment.service', request, data);
            data.postId = request.raw.params['postId'];
            const post = yield nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.POST.CHECK.ID_EXISTS)(request, data.postId);
            console.log('comment.service', 'create', 'postIdExists', post);
            if (!post)
                throw this.buildError(404, 'postId not available');
            const old = yield this.repository.getOne({
                _id: documentId,
                postId: data.postId
            });
            if (!old)
                throw this.buildError(404, 'commentId not available');
            data.author = request.getUserId();
            if (data.context === 'resolve') {
                console.log('data.author', data.author, 'post.author', post.author);
                if (data.author !== post.author)
                    throw this.buildError(400, 'Since you are not the author of the post, you are not allowed to post resolve comments on the post.');
            }
            data = nk_js_library_1.Utils.JSONUtils.normalizeJson(data);
            data.isDeleted = false;
            console.log('comment.service', 'db update', data);
            try {
                data = yield this.repository.updateOnePartial({
                    _id: documentId,
                    postId: data.postId
                }, data);
            }
            catch (error) {
                throw this.buildError(400, error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.COMMENT.UPDATED,
                data
            });
            if (data.context !== old.context) {
                nk_node_library_1.Services.PubSub.publishMessage({
                    request,
                    type: pubsub_helper_1.PubSubMessageTypes.COMMENT.CONTEXT_CHANGED,
                    data: {
                        'postId': old.postId,
                        'old': old.context,
                        'new': data.context
                    }
                });
            }
            return (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
        });
        this.delete = (request, documentId) => __awaiter(this, void 0, void 0, function* () {
            let data = {
                isDeleted: true
            };
            const postId = request.raw.params['postId'];
            try {
                data = yield this.repository.updateOnePartial({
                    _id: documentId,
                    postId
                }, data);
            }
            catch (error) {
                throw this.buildError(400, error);
            }
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.COMMENT.DELETED,
                data
            });
            return (yield this.embedAuthorInformation(request, [data], ['author'], nk_js_library_1.Services.BinderService.boundFunction(binder_helper_1.BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
        });
        nk_js_library_1.Services.BinderService.bindFunction(binder_helper_1.BinderNames.COMMENT.CHECK.ID_EXISTS, this.checkIdExists);
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.OPINION, this);
    }
    static getInstance() {
        if (!CommentService.instance) {
            CommentService.instance = new CommentService();
        }
        return CommentService.instance;
    }
    processMessage(message) {
        switch (message.type) {
            case pubsub_helper_1.PubSubMessageTypes.OPINION.CREATED:
                this.opinionCreated(message.request, message.data, 'commentId');
                this.possibleCommentResolve(message.request, message.data, true);
                break;
            case pubsub_helper_1.PubSubMessageTypes.OPINION.DELETED:
                this.opinionDeleted(message.request, message.data, 'commentId');
                this.possibleCommentResolve(message.request, message.data, false);
                break;
        }
    }
    possibleCommentResolve(request, data, enable) {
        if (('commentId' in data) && (data['commentId'] !== 'none') && data['postAuthorOpinion'] && data['opinionType'] === 'follow') {
            this.repository.updatePartial(data['commentId'], { 'context': enable ? 'resolve' : 'update' });
            nk_node_library_1.Services.PubSub.publishMessage({
                request,
                type: pubsub_helper_1.PubSubMessageTypes.COMMENT.CONTEXT_CHANGED,
                data: {
                    'postId': data['postId'],
                    'old': enable ? 'general' : 'resolve',
                    'new': enable ? 'resolve' : 'update'
                }
            });
        }
    }
}
exports.default = CommentService.getInstance();

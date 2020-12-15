import { CommentRepository } from '../repositories';
import { Helpers, Services } from 'nk-node-library';
import { Services as JsServices, Utils } from 'nk-js-library';
import { PubSubMessageTypes } from '../helpers/pubsub.helper';
import { BinderNames } from '../helpers/binder.helper';
import StatsService from './stats.service';
import * as CommonUtils from '../helpers/common.helper';

class CommentService extends StatsService {

    private static instance: CommentService;

    private constructor() {
        super(new CommentRepository());
        JsServices.BinderService.bindFunction(BinderNames.COMMENT.CHECK.ID_EXISTS, this.checkIdExists);
        Services.PubSub.addSubscriberAll(PubSubMessageTypes.OPINION, this);
    }

    public static getInstance(): CommentService {
        if (!CommentService.instance) {
            CommentService.instance = new CommentService();
        }

        return CommentService.instance;
    }

    processMessage(message: Services.PubSub.NLMessage) {
        switch (message.type) {
            case PubSubMessageTypes.OPINION.CREATED:
                this.opinionCreated(message.request, message.data, 'commentId');
                this.possibleCommentResolve(message.request, message.data, true);
                break;
            case PubSubMessageTypes.OPINION.DELETED:
                this.opinionDeleted(message.request, message.data, 'commentId');
                this.possibleCommentResolve(message.request, message.data, false);
                break;
        }
    }

    possibleCommentResolve(request: Helpers.Request, data: any, enable: boolean) {
        if (('commentId' in data) && (data['commentId'] !== 'none') && data['postAuthorOpinion'] && data['opinionType'] === 'follow') {
            this.repository.updatePartial(data['commentId'], { 'context': enable ? 'resolve' : 'update' });
            Services.PubSub.publishMessage({
                request,
                type: PubSubMessageTypes.COMMENT.CONTEXT_CHANGED,
                data: {
                    'postId': data['postId'],
                    'old': enable ? 'general' : 'resolve',
                    'new': enable ? 'resolve' : 'update'
                }
            })
        }
    }

    create = async (request: Helpers.Request, data) => {
        console.log('comment.service', request, data);

        data.postId = request.raw.params['postId'];

        data.location = data.location || request.getLocation();

        if (!data.location.raw) {
            data.location.raw = (await CommonUtils.reverseLookup(data.location));
        }

        const post = await JsServices.BinderService.boundFunction(BinderNames.POST.CHECK.ID_EXISTS)(request, data.postId)

        console.log('comment.service', 'create', 'postIdExists', post)

        if (!post)
            throw this.buildError(404, 'postId not available')

        data.author = request.getUserId();

        if (data.context === 'resolve') {
            if (data.author !== post.author)
                throw this.buildError(403, 'Since you are not the author of the post, you are not allowed to post resolve comments on the post.')
        }

        data = Utils.JSONUtils.normalizeJson(data);

        console.log('comment.service', 'db insert', data);

        try {
            data = await this.repository.create(data);
        } catch (error) {
            throw this.buildError(error);
        }

        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.COMMENT.CREATED,
            data
        });

        console.log('comment.service', 'published message');

        return (await this.embedAuthorInformation(request, [data], ['author'],
            JsServices.BinderService.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

    getAll = async (request: Helpers.Request, query = {}, sort = {}, pageSize: number = 5, pageNum: number = 1, attributes: string[] = []) => {
        const exposableAttributes = ['author', 'postId', 'content', 'context', 'location', 'status', 'isDeleted', 'stats', 'createdAt', 'lastModifiedAt'];
        if (attributes.length === 0)
            attributes = exposableAttributes;
        else
            attributes = attributes.filter(function (el: string) {
                return exposableAttributes.includes(el);
            });
        const postId = request.raw.params['postId'];
        const data = await this.repository.getAll({
            $and: [
                query,
                {
                    postId
                }
            ]
        }, sort, pageSize, pageNum, attributes);

        data.result = await this.embedAuthorInformation(request, data.result, ['author'],
            JsServices.BinderService.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES));

        return data;
    }

    get = async (request: Helpers.Request, documentId: string, attributes?: any[]) => {

        const postId = request.raw.params['postId'];
        const data = await this.repository.getOne({ _id: documentId, postId }, attributes);

        if (!data)
            this.buildError(404);

        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.COMMENT.READ,
            data
        });

        return (await this.embedAuthorInformation(request, [data], ['author'],
            JsServices.BinderService.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

    update = async (request: Helpers.Request, documentId: string, data) => {
        console.log('comment.service', request, data);

        data.postId = request.raw.params['postId'];

        const post = await JsServices.BinderService.boundFunction(BinderNames.POST.CHECK.ID_EXISTS)(request, data.postId)

        console.log('comment.service', 'create', 'postIdExists', post)

        if (!post)
            throw this.buildError(404, 'postId not available')

        const old = await this.repository.getOne({
            _id: documentId,
            postId: data.postId
        });

        if (!old)
            throw this.buildError(404, 'commentId not available')

        data.author = request.getUserId();

        if (data.context === 'resolve') {
            console.log('data.author', data.author, 'post.author', post.author);
            if (data.author !== post.author)
                throw this.buildError(400, 'Since you are not the author of the post, you are not allowed to post resolve comments on the post.')
        }

        data = Utils.JSONUtils.normalizeJson(data);

        data.isDeleted = false;

        console.log('comment.service', 'db update', data);

        try {
            data = await this.repository.updateOnePartial({
                _id: documentId,
                postId: data.postId
            }, data);
        } catch (error) {
            throw this.buildError(400, error);
        }

        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.COMMENT.UPDATED,
            data
        });

        if (data.context !== old.context) {
            Services.PubSub.publishMessage({
                request,
                type: PubSubMessageTypes.COMMENT.CONTEXT_CHANGED,
                data: {
                    'postId': old.postId,
                    'old': old.context,
                    'new': data.context
                }
            })
        }

        return (await this.embedAuthorInformation(request, [data], ['author'],
            JsServices.BinderService.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }

    delete = async (request: Helpers.Request, documentId: string) => {
        let data: any = {
            isDeleted: true
        };

        const postId = request.raw.params['postId'];

        try {
            data = await this.repository.updateOnePartial({
                _id: documentId,
                postId
            }, data);
        } catch (error) {
            throw this.buildError(400, error);
        }

        Services.PubSub.publishMessage({
            request,
            type: PubSubMessageTypes.COMMENT.DELETED,
            data
        });

        return (await this.embedAuthorInformation(request, [data], ['author'],
            JsServices.BinderService.boundFunction(BinderNames.USER.EXTRACT.USER_PROFILES)))[0];
    }
}

export default CommentService.getInstance();
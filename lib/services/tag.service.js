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
class TagService extends nk_node_library_1.Services.BaseService {
    constructor() {
        super(new repositories_1.TagRepository());
        this.getTagsByTagList = (tags) => __awaiter(this, void 0, void 0, function* () {
            return yield this.repository.getTagsByTagList(tags);
        });
        this.updateTags = (request, oldTags, newTags) => __awaiter(this, void 0, void 0, function* () {
            try {
                if (oldTags.length > 0)
                    for (let i = 0; i < oldTags.length; i++) {
                        yield this.repository.updateTag(oldTags[i], false);
                    }
                if (newTags.length > 0)
                    for (let i = 0; i < newTags.length; i++) {
                        yield this.repository.updateTag(newTags[i], true);
                    }
            }
            catch (error) {
                console.error(error);
            }
        });
        nk_node_library_1.Services.PubSub.addSubscriberAll(pubsub_helper_1.PubSubMessageTypes.POST, this);
        nk_js_library_1.Services.BinderService.bindFunction(binder_helper_1.BinderNames.TAG.EXTRACT.TAG_LIST, this.getTagsByTagList);
    }
    static getInstance() {
        if (!TagService.instance) {
            TagService.instance = new TagService();
        }
        return TagService.instance;
    }
    processMessage(message) {
        switch (message.type) {
            case pubsub_helper_1.PubSubMessageTypes.POST.CREATED:
                this.updateTags(message.request, [], message.data.content.tags);
                break;
            case pubsub_helper_1.PubSubMessageTypes.POST.TAG_CHANGED:
                this.updateTags(message.request, message.data['deleted'], message.data['added']);
                break;
            case pubsub_helper_1.PubSubMessageTypes.POST.DELETED:
                this.updateTags(message.request, message.data.content.tags, []);
                break;
        }
    }
}
exports.default = TagService.getInstance();

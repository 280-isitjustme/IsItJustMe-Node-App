"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const services_1 = require("../services");
const nk_node_library_1 = require("nk-node-library");
class PostController extends nk_node_library_1.Controllers.BaseController {
    constructor() {
        super(services_1.PostService);
    }
}
exports.default = PostController;

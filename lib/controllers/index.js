"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.OpinionController = exports.CommentController = exports.PostController = exports.TagController = exports.AuthController = exports.UserController = void 0;
var user_controller_1 = require("./user.controller");
Object.defineProperty(exports, "UserController", { enumerable: true, get: function () { return user_controller_1.default; } });
var auth_controller_1 = require("./auth.controller");
Object.defineProperty(exports, "AuthController", { enumerable: true, get: function () { return auth_controller_1.default; } });
var tag_controller_1 = require("./tag.controller");
Object.defineProperty(exports, "TagController", { enumerable: true, get: function () { return tag_controller_1.default; } });
var post_controller_1 = require("./post.controller");
Object.defineProperty(exports, "PostController", { enumerable: true, get: function () { return post_controller_1.default; } });
var comment_controller_1 = require("./comment.controller");
Object.defineProperty(exports, "CommentController", { enumerable: true, get: function () { return comment_controller_1.default; } });
var opinion_controller_1 = require("./opinion.controller");
Object.defineProperty(exports, "OpinionController", { enumerable: true, get: function () { return opinion_controller_1.default; } });
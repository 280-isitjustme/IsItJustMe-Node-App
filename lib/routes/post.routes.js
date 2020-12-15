"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nk_node_library_1 = require("nk-node-library");
const controllers_1 = require("../controllers");
const comment_routes_1 = require("./comment.routes");
const opinion_routes_1 = require("./opinion.routes");
const router = express_1.Router();
const controller = new controllers_1.PostController();
const authorService = (controller.service);
const validatorMiddleware = new nk_node_library_1.Middlewares.ValidatorMiddleware();
const schema = {
    "type": "object",
    "additionalProperties": false,
    "required": ["content"],
    "properties": {
        "content": {
            "type": "object",
            "additionalProperties": false,
            "required": ["title", "body", "tags"],
            "properties": {
                "title": {
                    "type": "string"
                },
                "body": {
                    "type": "string"
                },
                "tags": {
                    "type": "array",
                    "items": {
                        "type": "string"
                    }
                }
            }
        },
        "location": {
            "type": "object",
            "additionalProperties": true,
            "required": ["latitude", "longitude"],
            "properties": {
                "latitude": {
                    "type": "number"
                },
                "longitude": {
                    "type": "number"
                },
                "raw": {
                    "type": "object"
                }
            }
        }
    }
};
router.param('id', nk_node_library_1.Middlewares.addParamToRequest());
router.param('postId', nk_node_library_1.Middlewares.addParamToRequest());
router.post('/', nk_node_library_1.Middlewares.authCheck(true, true), validatorMiddleware.validateRequestBody(schema), controller.create);
router.post('/search', nk_node_library_1.Middlewares.authCheck(false), controller.getAll);
router.get('/:id', nk_node_library_1.Middlewares.authCheck(false), nk_node_library_1.Middlewares.checkDocumentExists(authorService, 'id'), controller.get);
router.put('/:id', nk_node_library_1.Middlewares.authCheck(true, true), nk_node_library_1.Middlewares.checkDocumentExists(authorService, 'id'), nk_node_library_1.Middlewares.isAuthor(authorService), validatorMiddleware.validateRequestBody(schema), controller.update);
router.delete('/:id', nk_node_library_1.Middlewares.authCheck(true, true), nk_node_library_1.Middlewares.checkDocumentExists(authorService, 'id'), nk_node_library_1.Middlewares.isAuthor(authorService), controller.delete);
router.use('/:postId/comment', nk_node_library_1.Middlewares.checkDocumentExists(authorService, 'postId'), comment_routes_1.default);
router.use('/:postId/opinion', nk_node_library_1.Middlewares.checkDocumentExists(authorService, 'postId'), opinion_routes_1.default);
exports.default = router;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nk_node_library_1 = require("nk-node-library");
const controllers_1 = require("../controllers");
const router = express_1.Router();
const controller = new controllers_1.OpinionController();
const authorService = (controller.service);
const validatorMiddleware = new nk_node_library_1.Middlewares.ValidatorMiddleware();
router.post('/', nk_node_library_1.Middlewares.authCheck(true, true), validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["opinionType"],
    "properties": {
        "body": {
            "type": "string"
        },
        "opinionType": {
            "type": "string",
            "enum": ['follow', 'upvote', 'downvote', 'spamreport']
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
}), controller.create);
router.post('/search', nk_node_library_1.Middlewares.authCheck(false), controller.getAll);
router.get('/:id', nk_node_library_1.Middlewares.authCheck(false), controller.get);
router.delete('/:id', nk_node_library_1.Middlewares.authCheck(true, true), nk_node_library_1.Middlewares.isAuthor(authorService), controller.delete);
exports.default = router;

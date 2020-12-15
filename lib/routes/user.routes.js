"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nk_node_library_1 = require("nk-node-library");
const controllers_1 = require("../controllers");
const router = express_1.Router();
const userController = new controllers_1.UserController();
const validatorMiddleware = new nk_node_library_1.Middlewares.ValidatorMiddleware();
router.post('/search', nk_node_library_1.Middlewares.authCheck(false), userController.getAll);
router.put('/', nk_node_library_1.Middlewares.authCheck(true), validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName", "lastName", "displayPicture"],
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "displayPicture": {
            "type": "string"
        }
    }
}), userController.update);
router.get('/me', nk_node_library_1.Middlewares.authCheck(true), userController.getMe);
router.get('/:id', nk_node_library_1.Middlewares.authCheck(false), userController.getId);
exports.default = router;

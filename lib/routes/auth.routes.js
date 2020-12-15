"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const nk_node_library_1 = require("nk-node-library");
const controllers_1 = require("../controllers");
const router = express_1.Router();
const authController = new controllers_1.AuthController();
const validatorMiddleware = new nk_node_library_1.Middlewares.ValidatorMiddleware();
router.post('/sign_up', validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName", "lastName", "email", "password", "registrationType"],
    "properties": {
        "firstName": {
            "type": "string"
        },
        "lastName": {
            "type": "string"
        },
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        },
        "registrationType": {
            "type": "string",
            "enum": ['inapp', 'google']
        }
    }
}), authController.signUp);
router.post('/sign_in', validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["email", "password"],
    "properties": {
        "email": {
            "type": "string"
        },
        "password": {
            "type": "string"
        }
    }
}), authController.signIn);
router.get('/access_token', nk_node_library_1.Middlewares.authCheck(true), authController.getAccessToken);
router.get('/me', nk_node_library_1.Middlewares.authCheck(true), authController.me);
router.get('/send_confirmation_token', nk_node_library_1.Middlewares.authCheck(true), authController.sendConfirmationToken);
router.post('/confirmation_token', nk_node_library_1.Middlewares.authCheck(true), validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["token"],
    "properties": {
        "token": {
            "type": "string"
        }
    }
}), authController.confirmationToken);
router.delete('/sign_out', nk_node_library_1.Middlewares.authCheck(true), authController.signOut);
router.delete('/sign_out_all', nk_node_library_1.Middlewares.authCheck(true), authController.signOutAll);
exports.default = router;

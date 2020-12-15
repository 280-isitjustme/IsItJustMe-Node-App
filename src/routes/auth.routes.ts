import { Router } from 'express';
import { Middlewares } from 'nk-node-library';
import { AuthController } from '../controllers';

const router = Router()

const authController = new AuthController()

const validatorMiddleware = new Middlewares.ValidatorMiddleware();

router.post('/sign_up',validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["firstName","lastName","email","password","registrationType"],
    "properties": {
        "firstName":{
            "type":"string"
        },
        "lastName":{
            "type":"string"
        },
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        },
        "registrationType":{
            "type":"string",
            "enum":['inapp', 'google']
        }
    }
}),authController.signUp)

router.post('/sign_in',validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["email","password"],
    "properties": {
        "email":{
            "type":"string"
        },
        "password":{
            "type":"string"
        }
    }
}),authController.signIn)

router.get('/access_token',Middlewares.authCheck(true),authController.getAccessToken)

router.get('/me',Middlewares.authCheck(true),authController.me)

router.get('/send_confirmation_token',Middlewares.authCheck(true),authController.sendConfirmationToken)

router.post('/confirmation_token',Middlewares.authCheck(true),validatorMiddleware.validateRequestBody({
    "type": "object",
    "additionalProperties": false,
    "required": ["token"],
    "properties": {
        "token":{
            "type":"string"
        }
    }
}),authController.confirmationToken)

router.delete('/sign_out',Middlewares.authCheck(true),authController.signOut)

router.delete('/sign_out_all',Middlewares.authCheck(true),authController.signOutAll)

export default router;
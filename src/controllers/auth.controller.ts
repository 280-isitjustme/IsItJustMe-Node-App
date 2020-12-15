//const BaseController = require('./base.controller')
import * as express from 'express';
import {AuthService} from '../services';
import {Controllers,Helpers} from 'nk-node-library';

class AuthController extends Controllers.BaseController{
    
    constructor(){
        super(AuthService);
    }

    signUp = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Helpers.Request = res.locals.request;
        try {
            const creds = await this.service.signUp(request,body);
            return res.status(201).send(creds);
        } catch (error) {
            console.log(error)
            return res.status(error.status).send(error.message);
        }
    }

    signIn = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Helpers.Request = res.locals.request;
        try {
            console.log(request,body);
            const creds = await this.service.signIn(request,body);
            console.log(creds);
            return res.status(201).send(creds);
        } catch (error) {
            console.log('blah')
            console.log('signIn auth controller',error)
            return res.status(error.status).send(error.message);
        }
    }

    confirmationToken = async(req : express.Request , res : express.Response) => {
        const { body } = req;
        const request : Helpers.Request = res.locals.request;
        try {
            console.log(request,body);
            const response = await this.service.confirmationToken(request,body);
            console.log(response);
            return res.status(201).send(response);
        } catch (error) {
            console.log('blah')
            console.log('confirmationToken auth controller',error)
            return res.status(error.status).send(error.message);
        }
    }

    me = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        res.status(200).send(await this.service.getMe(request));
    }

    sendConfirmationToken = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        res.status(201).send(await this.service.sendConfirmationToken(request));
    }

    getAccessToken = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        res.status(201).send(await this.service.getAccessToken(request));
    }

    signOut = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        await this.service.signOut(request);
        res.sendStatus(204)
    }

    signOutAll = async(req : express.Request , res : express.Response) => {
        const request : Helpers.Request = res.locals.request;
        await this.service.signOutAll(request);
        res.sendStatus(204)
    }

}
export default AuthController;
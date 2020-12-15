import * as express from 'express';

import {Controllers,Helpers} from 'nk-node-library';

import {UserService} from '../services';

class UserController extends Controllers.BaseController{
    constructor(){
        super(UserService);
    }

    getMe = async(req : express.Request , res : express.Response) => {
        try {
            const request : Helpers.Request = res.locals.request;
            console.log('request :',request)
            const result = await this.service.getUserByEmail(request, request.getEmail());
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }

    getId = async(req : express.Request , res : express.Response) => {
        try {
            const request : Helpers.Request = res.locals.request;
            console.log('request :',request)
            const result = await this.service.getUserByUserId(request, req.params.id);
            return res.send(result);
        } catch (error) {
            console.log(error);
            res.sendStatus(error.status)
        }
    }
}
export default UserController;
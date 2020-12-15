import * as express from 'express';
import { Controllers } from 'nk-node-library';
declare class UserController extends Controllers.BaseController {
    constructor();
    getMe: (req: express.Request, res: express.Response) => Promise<express.Response<any>>;
    getId: (req: express.Request, res: express.Response) => Promise<express.Response<any>>;
}
export default UserController;

import * as express from 'express';
import { Controllers } from 'nk-node-library';
declare class AuthController extends Controllers.BaseController {
    constructor();
    signUp: (req: express.Request, res: express.Response) => Promise<express.Response<any>>;
    signIn: (req: express.Request, res: express.Response) => Promise<express.Response<any>>;
    confirmationToken: (req: express.Request, res: express.Response) => Promise<express.Response<any>>;
    me: (req: express.Request, res: express.Response) => Promise<void>;
    sendConfirmationToken: (req: express.Request, res: express.Response) => Promise<void>;
    getAccessToken: (req: express.Request, res: express.Response) => Promise<void>;
    signOut: (req: express.Request, res: express.Response) => Promise<void>;
    signOutAll: (req: express.Request, res: express.Response) => Promise<void>;
}
export default AuthController;

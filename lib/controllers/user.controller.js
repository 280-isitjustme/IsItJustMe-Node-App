"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const nk_node_library_1 = require("nk-node-library");
const services_1 = require("../services");
class UserController extends nk_node_library_1.Controllers.BaseController {
    constructor() {
        super(services_1.UserService);
        this.getMe = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = res.locals.request;
                console.log('request :', request);
                const result = yield this.service.getUserByEmail(request, request.getEmail());
                return res.send(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(error.status);
            }
        });
        this.getId = (req, res) => __awaiter(this, void 0, void 0, function* () {
            try {
                const request = res.locals.request;
                console.log('request :', request);
                const result = yield this.service.getUserByUserId(request, req.params.id);
                return res.send(result);
            }
            catch (error) {
                console.log(error);
                res.sendStatus(error.status);
            }
        });
    }
}
exports.default = UserController;

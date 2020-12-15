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
exports.me = exports.id = exports.getAll = void 0;
const nk_node_library_1 = require("nk-node-library");
const config_helper_1 = require("../helpers/config.helper");
var expect = nk_node_library_1.Test.Chai.expect;
var request = nk_node_library_1.Test.Request;
var common = nk_node_library_1.Test.Common;
const baseUrl = config_helper_1.default.HOST + config_helper_1.default.API_BASE;
function me(data) {
    return __awaiter(this, void 0, void 0, function* () {
        data.responseStatus = data.responseStatus || 200;
        let response = yield request.formattedApiRequest({
            host: baseUrl,
            method: 'get',
            path: config_helper_1.default.PATH.PROFILE.ME,
            token: {
                type: 'access',
                value: data.accessToken
            }
        });
        console.log(response);
        expect(response.status).to.equal(data.responseStatus);
        return response.data || {};
    });
}
exports.me = me;
function getAll(data) {
    return __awaiter(this, void 0, void 0, function* () {
        data.responseStatus = data.responseStatus || 200;
        const req = {
            host: baseUrl,
            method: 'get',
            path: config_helper_1.default.PATH.PROFILE.GET_ALL
        };
        if (data.accessToken) {
            req.token = {
                type: 'access',
                value: data.accessToken
            };
        }
        if (data.query) {
            req.query = data.query;
        }
        if (data.body) {
            req.body = data.body;
        }
        let response = yield request.formattedApiRequest(req);
        console.log(response);
        expect(response.status).to.equal(data.responseStatus);
        return response.data || {};
    });
}
exports.getAll = getAll;
function id(data) {
    return __awaiter(this, void 0, void 0, function* () {
        data.responseStatus = data.responseStatus || 200;
        const req = {
            host: baseUrl,
            method: 'get',
            path: config_helper_1.default.PATH.PROFILE.ID,
            params: {
                id: data.id
            }
        };
        if (data.accessToken) {
            req.token = {
                type: 'access',
                value: data.accessToken
            };
        }
        let response = yield request.formattedApiRequest(req);
        console.log(response);
        expect(response.status).to.equal(data.responseStatus);
        return response.data || {};
    });
}
exports.id = id;

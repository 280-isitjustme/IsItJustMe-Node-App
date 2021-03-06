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
const models_1 = require("../models");
class AuthRepository extends nk_node_library_1.Repositories.BaseRepository {
    constructor() {
        super(models_1.Auth);
        this.getUsersByEmail = (email) => __awaiter(this, void 0, void 0, function* () {
            return yield this.getAll({ email }, {}, 5, 1, []);
        });
        this.getAccountById = (_id) => __awaiter(this, void 0, void 0, function* () {
            return yield this.get(_id, ["account"]);
        });
        this.setConfirmedAt = (_id, confirmedAt) => __awaiter(this, void 0, void 0, function* () {
            return this.model.updateOne({ _id }, {
                $set: {
                    "account.confirmedAt": confirmedAt
                }
            });
        });
    }
}
exports.default = AuthRepository;

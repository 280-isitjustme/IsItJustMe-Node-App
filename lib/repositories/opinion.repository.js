"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const models_1 = require("../models");
const nk_node_library_1 = require("nk-node-library");
class OpinionRepository extends nk_node_library_1.Repositories.AuthorRepository {
    constructor() {
        super(models_1.Opinion);
    }
}
exports.default = OpinionRepository;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    latitude: {
        type: Number,
        default: 0.0
    },
    longitude: {
        type: Number,
        default: 0.0
    },
    raw: {
        type: mongoose.Schema.Types.Mixed,
        default: {}
    }
});

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
exports.default = new mongoose.Schema({
    viewCount: {
        type: Number,
        default: 0
    },
    followCount: {
        type: Number,
        default: 0
    },
    upvoteCount: {
        type: Number,
        default: 0
    },
    downvoteCount: {
        type: Number,
        default: 0
    },
    spamreportCount: {
        type: Number,
        default: 0
    },
    commentCount: {
        type: Number,
        default: 0
    },
    updateCount: {
        type: Number,
        default: 0
    },
    resolveCount: {
        type: Number,
        default: 0
    },
    score: {
        type: Number,
        default: 0
    }
});

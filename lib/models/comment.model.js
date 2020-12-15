"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schemas_1 = require("../schemas");
const commentSchema = new mongoose.Schema({
    author: {
        type: String,
        required: 'author is required',
        ref: 'User'
    },
    postId: {
        type: String,
        required: 'postId is required'
    },
    content: {
        type: String,
        trim: true,
        required: 'content is required'
    },
    context: {
        type: String,
        enum: ['general', 'update', 'resolve'],
        default: 'general'
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    location: {
        type: schemas_1.LocationSchema,
        default: {}
    },
    stats: {
        type: schemas_1.StatsSchema,
        default: {}
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastModifiedAt: {
        type: Date,
        default: Date.now
    }
});
const Comment = mongoose.model('Comment', commentSchema);
exports.default = Comment;

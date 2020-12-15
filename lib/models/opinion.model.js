"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const schemas_1 = require("../schemas");
const opinionSchema = new mongoose.Schema({
    author: {
        type: String,
        required: 'author is required'
    },
    postId: {
        type: String,
        required: 'postId is required'
    },
    commentId: {
        type: String,
        required: 'commentId is required'
    },
    body: {
        type: String
    },
    opinionType: {
        type: String,
        enum: ['follow', 'upvote', 'downvote', 'spamreport'],
        default: 'upvote'
    },
    postAuthorOpinion: {
        type: Boolean,
        default: false
    },
    location: schemas_1.LocationSchema,
    createdAt: {
        type: Date,
        default: Date.now
    }
});
opinionSchema.index({ 'opinionType': 1, 'postId': 1, 'commentId': 1, 'author': 1 }, { unique: true });
const Opinion = mongoose.model('Opinion', opinionSchema);
exports.default = Opinion;

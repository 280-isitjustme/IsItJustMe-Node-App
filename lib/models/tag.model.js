"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const tagSchema = new mongoose.Schema({
    tag: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true
    },
    type: {
        type: String,
        trim: true,
        lowercase: true,
        default: 'generic'
    },
    count: {
        type: Number,
        default: 0
    }
});
const Tag = mongoose.model('Tag', tagSchema);
exports.default = Tag;

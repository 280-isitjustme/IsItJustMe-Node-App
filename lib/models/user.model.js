"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const userSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: 'userId is required',
        unique: true,
        immutable: true
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required'
    },
    firstName: {
        type: String,
        trim: true,
        default: ''
    },
    lastName: {
        type: String,
        trim: true,
        default: ''
    },
    displayPicture: {
        type: String,
        trim: true,
        default: ''
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
userSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        error = new Error();
        error.status = 400;
        error.message = 'Email already exists.';
        next(error);
    }
    else {
        next(error);
    }
});
userSchema.index({ 'userId': 1 }, { unique: true });
userSchema.index({ 'email': 1 }, { unique: true });
const User = mongoose.model('User', userSchema);
exports.default = User;

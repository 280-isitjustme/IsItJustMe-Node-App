import * as mongoose from 'mongoose';
import { LocationSchema, StatsSchema } from '../schemas';

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
        //@ts-ignore
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
        type: LocationSchema,
        default: {}
    },
    stats: {
        type: StatsSchema,
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

export default Comment;
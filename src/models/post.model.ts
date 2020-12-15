import * as mongoose from 'mongoose';
import { LocationSchema, StatsSchema } from '../schemas';

const postSchema = new mongoose.Schema({
    author:{
        type: String,
        required:'author is required',
        ref:'User'
    },
    content:{
        title:{
            type: String,
            trim: true,
            required: 'title is required'
        },
        body:{
            type: String,
            trim: true,
            default:''
        },
        tags:[{
            type: String,
            trim: true,
            lowercase: true
        }]
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    location:{
        type:LocationSchema,
        default:{}
    },
    stats:{
        type:StatsSchema,
        default:{}
    },
    createdAt:{
        type:Date,
        default:Date.now
    },
    lastModifiedAt:{
        type:Date,
        default:Date.now
    },
    threadLastUpdatedAt:{
        type:Date,
        default:Date.now
    }
});

const Post = mongoose.model('Post',postSchema);

export default Post;
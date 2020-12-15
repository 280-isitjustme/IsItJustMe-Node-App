import * as mongoose from 'mongoose';

const tagSchema = new mongoose.Schema({
    tag:{
        type: String,
        trim: true,
        lowercase: true,
        unique:true
    },
    type:{
        type:String,
        trim:true,
        lowercase:true,
        default:'generic'
    },
    count:{
        type:Number,
        default:0
    }
});

const Tag = mongoose.model('Tag',tagSchema);

export default Tag;
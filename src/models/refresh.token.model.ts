import * as mongoose from 'mongoose';

const refreshTokenSchema = new mongoose.Schema({
    userId:{
        type:String,
        required: 'userId is required'
    },
    ip:{
        type:String,
        required: 'ip is required'
    },
    refreshToken:{
        value:{
            type:String,
            required: 'refreshToken.value is required',
            unique: true
        },
        expiryTime:{
            type:Number,
            required: 'refreshToken.expiryTime is required'
        }
    },
    issuedAt:{
        type: Date,
        default: Date.now
    }
});


const RefreshToken = mongoose.model('RefreshToken',refreshTokenSchema);

export default RefreshToken;
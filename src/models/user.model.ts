import * as mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    //@ts-ignore
    userId: {
        type: String,
        required: 'userId is required',
        unique: true,
        immutable: true
    },
    email: {
        type: String,
        //@ts-ignore
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required'
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
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
    } else {
        next(error);
    }
});

userSchema.index({ 'userId': 1 }, { unique: true });
userSchema.index({ 'email': 1 }, { unique: true });

const User = mongoose.model('User', userSchema);

export default User;
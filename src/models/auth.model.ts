import * as mongoose from 'mongoose';

const authSchema = new mongoose.Schema({
    email: {
        type: String,
        //@ts-ignore
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        //match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        //@ts-ignore
        trim: true,
        required: 'Password is required',
        //match: [/(?=.{8,})/, 'Please provide a valid password']
    },
    account: {
        type: {
            type: String,
            enum: ['inapp', 'google'],
            default: 'inapp'
        },
        registeredAt: {
            type: Date,
            default: Date.now
        },
        confirmedAt: {
            type: Date
        }
    }
});


authSchema.post('save', function (error, doc, next) {
    if (error.name === 'MongoError' && error.code === 11000) {
        error = new Error();
        error.status = 400;
        error.message = 'Email already exists.';
        next(error);
    } else {
        next(error);
    }
});

authSchema.index({ 'email': 1 }, { unique: true });

const Auth = mongoose.model('Auth', authSchema);

export default Auth;
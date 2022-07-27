const { default: mongoose } = require("mongoose");
console.log("i am inside models/users")

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    phone: {
        type: Number,
        required: true,
        trim: true
    },
    active: {
        default: false,
        type: Boolean,
        required: true
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    type: {
        type: String,
        enum: ['ta_exec','interviewer','interviewee']
    },
    password: {
        type: String,
        required: true
    }
});

// UserSchema.pre('save', function(next){
//     now = new Date();
//     this.updated_at = now;
//     if(!this.created_at) {
//         this.created_at = now
//     }
//     next();
// });

module.exports= mongoose.model('user', UserSchema);
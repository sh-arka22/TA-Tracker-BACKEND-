const { default: mongoose } = require("mongoose");
const { create, createIndexes } = require("./users");
console.log("i am inside models/candidates");

const CandidateSchema = new mongoose.Schema({
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
    status: {
        type: String,
        default: 'created',
        enum: [
            'created',
            'scheduled',
            'selected',
            'rejected'
        ]
    },
    created_at: {type: Date, default: Date.now},
    updated_at: {type: Date, default: Date.now},
    resume: {
        type:String,
    },
    slots: [{ start : Date, end : Date }],
    interview: {
        type: mongoose.Schema.Types.ObjectId, ref: 'interview'
    },
    
});

CandidateSchema.pre('save', function(next){
    now = new Date();
    this.updated_at = now;
    if(!this.created_at) {
        this.created_at = now
    }
    next();
});
module.exports = mongoose.model('candidate',CandidateSchema);
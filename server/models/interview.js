const mongoose = require('mongoose');
console.log("inside models/interview");

const interview = new mongoose.Schema({
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'candidate',
        // required: true,
        trim: true
    },
    interviewer_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user',
        // required: true,
        trim: true
    },
    interview_slot: {
       start:{
           type:String
       },
       end:{
           type:String
       }
    },
    rating: {
        type: String,
        enum: ['1', '2', '3', '4', '5']
    },
    feedback: {
        type: String,
        // required:true,
        trim:true
    },
    status: {
        type: String,
        enum: ['created','selected', 'rejected']
    }
});

module.exports = mongoose.model('interview',interview);
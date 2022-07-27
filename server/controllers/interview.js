const Candidate = require('../models/candidates');
const User = require('../models/users');
const Interview = require('../models/interview');
const jwt = require('jsonwebtoken');

exports.update = async (req, res, next) => {
    try {
        const interviewerID = req.userId; //interviewer ID
        const user = req.user; // here i received the interviewer
        if(user.type != 'interviewer'){
            return res.status(401).json({
                message: "you are not interviewer so not allowed to update Interview Model"
            });
        }
    
        const update = req.body;
        const interviewID = req.params.userId;
        console.log(interviewID);
        const interview = await Interview.findOneAndUpdate({interviewID},update);
        // const n = update.slots.length;
        if(interview != null){
            const candidateID = interview.candidate_id;
            const candiadate = await Candidate.findById(candidateID);
            candiadate.status = interview.status;
            candiadate.interview = interview;
            candiadate.save();
            interview.save();
            res.status(200).json({
            date: interview,
            message: 'interview has been updated and the candidate status'
        });
        }
        
        } catch (error) {
        next(error)
        }

}

exports.getUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        // console.log(userId);
        const user = await Interview.findById(userId);
        if (!user) return next(new Error('User does not exist'));
        res.status(200).json({
        data: user
        });
    } catch (error) {
        next(error)
    }
};

exports.getUsers = async (req, res, next) => {
    const users = await Interview.find({});
    console.log(users);
    res.status(200).json({
     data: users
    });
}



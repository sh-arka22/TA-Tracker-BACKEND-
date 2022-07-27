const Candidate = require('../models/candidates');
const jwt = require('jsonwebtoken');
const User = require('../models/users');
const Interview_slot = require('../models/interviewSlot');
const { findById } = require('../models/users');

exports.create = async (req, res, next) => {
    try{
        const userId = req.userId; 
        const user = req.user; // here i get the interviewer
        if(user.type != 'interviewer'){
            return res.status(401).json({
                message: "you are not interviewer so not allowed to create interviewSlot model"
            });
        }
        const update = req.body; 
        for(var i=0;i<update.slots.length;i++){
            // console.log(update.slots[i].start);
            if(update.slots[i].end - update.slots[i].start != 3600000){
                return res.status(401).json({
                    message: "not scheduled an hour interview"
                });
            }
        }
        const interviewSlot = new Interview_slot({ slots: update.slots});
        interviewSlot.interviwer_id = user;
        await interviewSlot.save();
        res.json({
            data: interviewSlot
        })
    }
    catch(err){
        console.log(err);
    }
    
};


exports.updateSlot = async (req, res, next) => {
try {
    const interviewerID = req.userId; //interviewer ID
    const user = req.user; // here i received the interviewer
    if(user.type != 'interviewer'){
        return res.status(401).json({
            message: "you are not interviewer so not allowed to update Interview Slot"
        });
    }

    const update = req.body;
    for(var i=0;i<update.slots.length;i++){
        if(update.slots[i].end - update.slots[i].start != 3600000){
            return res.status(401).json({
                message: "not scheduled an hour interview"
            });
        }
    }
    const interviewSlotID = req.params.userId;
    const interviewSlot = await Interview_slot.findOne({_id: interviewSlotID});
    const n = update.slots.length;
    for(let i=0;i<n;i++){
        interviewSlot.slots.push(update.slots[i]);
    }
    interviewSlot.save();
    res.status(200).json({
        data: interviewSlot,
        message: 'interviewr_slot has been updated'
    });
    } catch (error) {
    next(error)
    }
}


exports.deleteSlot = async (req, res, next) => {
    try {
    const userId = req.userId;
    const interviewer = req.user;
    if(interviewer.type != 'interviewer'){
        return res.status(401).json({
            message: "you are not interviewer so not allowed to delete Interview Slot"
        });
    }
    const interviewSlotID = req.params.userId;
    await Interview_slot.findByIdAndDelete(interviewSlotID);
    res.status(200).json({
    data: null,
    message: 'interviewr_slot has been deleted'
    });
    } catch (error) {
     next(error)
    }
}

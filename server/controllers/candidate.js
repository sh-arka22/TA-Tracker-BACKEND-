const Candiate = require('../models/candidates');
const Interview = require('../models/interview');
const jwt = require('jsonwebtoken');
const ta = require('../models/users');

exports.create = async (req, res, next) => {
    try {
    const userId = req.userId; //user id of ta
    const ta = req.user; // here i received the ta user 
    if(ta.type != 'ta_exec'){
        return res.status(401).json({
            message: "you are not ta so not allowed to create candidate model"
        });
    }

    const { name, phone, status, resume, slots, interviewer} = req.body;
    for(var i=0;i<slots.length;i++){
        if(slots[i].end - slots[i].start != 3600000){
            return res.status(401).json({
                message: "not scheduled an hour interview"
            });
        }
    }
    const newCandidate = new Candiate({ name, phone, status : status || "created", resume, slots: slots, interviewer });
     await newCandidate.save();
     res.json({
        message: 'candidate model has been created',
        data: newCandidate
     })
    } catch (error) {
     next(error)
    }
};

exports.updateSlot = async (req, res, next) => {
    try {
        const userId = req.userId;
        const ta = req.user;
        if(ta.type != 'ta_exec'){
            return res.status(401).json({
                message: "you are not ta so not allowed to update candidate model bcs u r not TA"
            });
        }
        const update = req.body
        const updateSlot = update.slots;
        for(var i=0;i<update.slots.length;i++){
            if(update.slots[i].end - update.slots[i].start != 3600000){
                return res.status(401).json({
                    message: "not scheduled an hour interview"
                });
            }
        }
        const userIdparam = req.params.userId;
        const user = await Candiate.findById(userIdparam);
        const n = update.slots.length;
        for(let i=0;i<n;i++){
            user.slots.push(update.slots[i]);
        }
        user.save();
        res.status(200).json({
         data: user,
         message: `Candiate model has been updated`
        });
       } catch (error) {
        next(error)
    }
}

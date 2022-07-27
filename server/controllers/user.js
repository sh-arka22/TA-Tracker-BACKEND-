const User = require('../models/users');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const Candidate = require('../models/candidates');
const validatePhoneNumber = require('validate-phone-number-node-js');
async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
 
async function validatePassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
}

exports.create = async (req, res, next) => {
 try {
  const { name, phone, active, type, password} = req.body;
  var pass = req.body.password.toString();
  var no = req.body.phone.toString();
  if(pass.length<7){
    return res.status(401).json({message: "entered incorrect credentials"});
  }
  const result = validatePhoneNumber.validate(no);
  if(!result){
    return res.status(401).json({message: "entered incorrect phone number type"});
  }
  const hashedPassword = await hashPassword(password);
  const newUser = new User({ name, phone, active: active, password: hashedPassword, type: type || "ta_exec"});
  await newUser.save();
  res.json({
   data: newUser
  })
 } catch (error) {
  next(error)
 }
};

exports.login = async (req, res, next) => {
try {
    const { name, password } = req.body;
    const user = await User.findOne({ name });
    if (!user) return next(new Error('Ta dont exist'));
    const validPassword = await validatePassword(password, user.password);
    if (!validPassword) return res.status(401).json({message: "you entered wrong credentials"});
    const accessToken = jwt.sign({ userId: user._id, user: user}, process.env.JWT_SECRET, {expiresIn: "1d"});
    await User.findByIdAndUpdate(user._id, { accessToken });
    user.accessToken = accessToken;
    user.active = true;
    user.updated_at = Date.now();
    user.save();
    res.status(200).json({
    user,
    accessToken,
    message: 'you are logged in'
    })
    } catch (error) {
        next(error);
    }
};

exports.onboard = async(req, res, next)=> {
    try{
        const userId = req.userId;
        const user = req.user;
        if(user.type != 'ta_exec'){
            return res.status(401).json({
                message: "you are not ta so not allowed to create interviewer model because you are not TaExec"
            });
        }
        
        const { name, phone, active,type, password} = req.body; 
        const hashedPassword = await hashPassword(password);
        const newUser = new User({ name, phone, active: active,password: hashedPassword, type: type || "interviewer"});
        await newUser.save();
        res.json({
            data: newUser
        })
    }
    catch(err){
        console.log(err);
    }
}
exports.logout = async (req, res, next) => {
    try {
        const { name, password } = req.body;
        const user = await User.findOne({ name });
        const validPassword = await validatePassword(password, user.password);
        if (!validPassword) return res.status(401).json({message: "you entered wrong credentials"});

        user.active = false;
        user.save();
        res.status(200).json({
        user,
        message: 'you are logged out'
        })
        } catch (error) {
            next(error);
        }
    };


exports.deleteUser = async (req, res, next) => {
    try {
        const userId = req.params.userId;
        const user = req.user;
        if(user.type != 'ta_exec'){
            return res.status(401).json({
                message: "you are not ta so not allowed to delete interviewer because you are not TaExec"
            });
        }
        await User.findByIdAndDelete(userId);
        res.status(200).json({
        data: null,
        message: 'User has been deleted'
        });
    } catch (error) {
        next(error)
    }
}


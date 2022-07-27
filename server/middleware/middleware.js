const jwt = require('jsonwebtoken');
const candiadate = require('../models/candidates');
const interviewSlot = require('../models/interviewSlot');
const user = require('../models/users');
exports.middleware = async(req, res, next) =>{
    try{
        const accessToken = req.headers["x-access-token"];
        // const paramsId = req.params.userId;
        const { userId,user, exp } = await jwt.verify(accessToken, process.env.JWT_SECRET);
        // console.log(usertype);
        // Check if token has expired
        if (exp < Date.now().valueOf() / 1000) { 
            return res.status(401).json({ error: "JWT token has expired" });
        }
        // req.userId = userId;
        req.user = user;
        // req.paramsId = paramsId;
        next();
    }
    catch(err){
        console.log(err);
    }
}
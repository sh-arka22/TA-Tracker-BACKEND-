const { roles } = require('../roles');
const candidates = require('../models/candidates');
 
exports.grantAccess = function(action, resource) {
return async (req, res, next) => {
    try {
    const permission = roles.can(req.user.type)[action](resource);
    if (!permission.granted) {
    return res.status(401).json({
        error: "You don't have enough permission to perform this action"
    });
    }
    next()
    } 
    catch (error) {
        next(error)
        }
    }
}

exports.allowIfLoggedin = async (req, res, next) => {
    try {
        const user = res.locals.loggedInUser;
        if (!user)
        return res.status(401).json({
        error: "You need to be logged in to access this route"
        });
        req.user = user;
        next();
        } 
        catch (error) {
        next(error);
    }
}
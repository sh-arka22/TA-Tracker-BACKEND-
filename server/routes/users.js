const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const middleware = require('../middleware/middleware');
console.log("i am inside routes/users");
 
router.post('/createTa', userController.create);
 
router.post('/login', userController.login);

router.post('/createInterviewer',middleware.middleware,userController.onboard);

router.post('/logout', userController.logout);

router.post('/delete/:userId', middleware.middleware,userController.deleteUser);

 
 
module.exports = router;

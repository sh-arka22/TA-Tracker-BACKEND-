const express = require('express');
const router = express.Router();
const userController = require('../controllers/interview');
const middleware = require('../middleware/middleware');
console.log('i am inside router/interview');

router.post('/update/:userId',middleware.middleware,userController.update);
router.get('/view/:userId', userController.getUser);
router.get('/getInterviews', userController.getUsers);

module.exports = router;
const express = require('express');
const router = express.Router();
const userController = require('../controllers/interviewSlot');
const middleware = require('../middleware/middleware');
 
router.post('/createInterviewSlot',middleware.middleware,userController.create);
router.put('/updateSlot/:userId',middleware.middleware ,userController.updateSlot);
router.delete('/deleteSlot/:userId',middleware.middleware ,userController.deleteSlot);

module.exports = router;
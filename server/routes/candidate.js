const express = require('express');
const router = express.Router();
const userController = require('../controllers/candidate');
const middleware  = require('../middleware/middleware');
console.log("i am inside routes/candidate");
 
router.post('/createCandidate',middleware.middleware ,userController.create);
router.put('/candiateSlot/:userId',middleware.middleware,userController.updateSlot);


module.exports = router;


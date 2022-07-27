const express = require('express');
const res = require('express/lib/response');
const multer = require('multer');
const router = express.Router();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, './upload');
     },
    filename: function (req, file, cb) {
        cb(null , file.originalname);
    }
});
var upload = multer({ storage: storage })
router.post("/resume", upload.single("resume"),(req,res)=>{
    console.log("resume uploded");
    res.send(req.file);
})

module.exports = router;
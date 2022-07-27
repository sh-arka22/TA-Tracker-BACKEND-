const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
app.use(express.json());
const PORT = process.env.PORT || 3000;
const io = require('socket.io')(server);
const fileuploadRouter = require("./routes/fileupload");

const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const path = require('path')
const User = require('./models/users')
const UserRoutes = require('./routes/users');
const CandidateRoute = require('./routes/candidate');
const interviewSlotRoute = require('./routes/interviewSlot');
const interviewRoute = require('./routes/interview');
const cron = require('node-cron');
//requireing the models
const candidates = require('./models/candidates');
const user = require('./models/users');
const interview = require('./models/interview');
const interview_slot = require('./models/interviewSlot');
const { createDecipheriv } = require('crypto');
// const soio = require('./socket/socketio');
/****************************************************** DB CONNECTION ***************************************************** */
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});
const dbUI = "mongodb://localhost:27017/Rough";
mongoose.connect(dbUI).then(() => {
    console.log("connection succesfull");
}).catch((err)=>{
    console.log("connectin failed");
});
/************************************************************* BODY PARSER ************************************************** */
app.use(bodyParser.urlencoded({ extended: true }));

//******************************************** FUNCTION FOR ADDING AN HOUR TO GIVEN DATE AND TIME *******************************/
function addHours(numOfHours, date = new Date()) {
    date.setTime(date.getTime() + numOfHours * 60 * 60 * 1000);
  
    return date;
}
/*************************************** SOCKET.IO CONNECTION *****************************************************************/
var flag = false;
var message = ' ';
async function noCandiate(data,msg){
    flag = data;
    message = msg;
}
io.on("connection", (socket) => {
    setInterval(function() {
        if(flag){
            socket.emit("message",message);
            // flag = false;
        }
        else{
            socket.emit("message",message);
        }
    },3 * 1000);
});

/************************************************ JOB SCHEDULAR *****************************************************************/
var CanSet = new Set(); // this is created outside bcs once the candidate has been interviewed cant be interviewed again
const job4 = async function(){
    var timeStringToTimeStamp = new Map();
    var intArr = [];
    var canArr = [];
    var IntSet = new Set(); //after every hour new set is created bcs after an hour the same interviewer is available to take new interviews
    candidates.find({status: 'created'}, (err,candiadate1) => { //array of candidate objects
        if(err){
            console.log(err);
        }
        else{
            // console.log("here");
            if(candiadate1.length === 0){
                noCandiate(false,'there are no created candidates');
            }
            else{
                interview_slot.find({}, (err, interview_slot1) => { //array of all interview_slot object
                    for(var j =0 ;j<interview_slot1.length;j++){
                        const interviewSlot = interview_slot1[j].slots;
                        const intervierID = interview_slot1[j];
                        for(var I=0 ;I<interviewSlot.length;I++){
                            const start = interviewSlot[I].start.toTimeString();
                            timeStringToTimeStamp.set(start,interviewSlot[I].start);
                            intArr.push([start,intervierID]);
                        }
                    }
                    intArr.sort(); //O(nlog(n))
                    asyncCall();
                });
                async function asyncCall(){
                    //if there is no candidate in created ststus this for loop wont run
                    for(var k =0 ;k<candiadate1.length;k++){
                        const candidateSlot = candiadate1[k].slots; //candidate object slot array
                        const candidateID = candiadate1[k]; //candidate object 
                        for(var J = 0;J<candidateSlot.length;J++){
                            const start = candidateSlot[J].start.toTimeString();
                            canArr.push([start,candidateID]);
                        }
                        canArr.sort(); //O(nlog(n))
                        console.log(canArr);
                        let intArrSi = 0;
                        let canArrSi = 0;
                        console.log(intArr.length, canArr.length);
                        while(intArrSi<intArr.length && canArrSi<canArr.length){  //O(n + 2n) => O(n) at worst case
                            const [intStart,intID] = intArr[intArrSi];
                            const [canStart,canID] = canArr[canArrSi];
                            if(canStart === intStart && CanSet.has(canID._id) === false && IntSet.has(intID._id) === false){
                                CanSet.add(canID._id); // this is used to stop the repetation of the candiates tha has already been used
                                IntSet.add(intID._id); // this is used to so that single interviewer is not mapped to different candidate unless and untill an hout is completed
                                const interview01 = new interview({});
                                interview01.candidate_id = canID;
                                interview01.interviewer_id = intID;
                                interview01.interview_slot.start = (timeStringToTimeStamp.get(canStart)).toTimeString(); //start time
                                const start = new Date(timeStringToTimeStamp.get(canStart));
                                const end = addHours(1, start); //function that adds an hour
                                // console.log(end.toTimeString());
                                // interview01.interview_slot.end = end.toTimeString();
                                candiadate1[k].status = "scheduled";
                                console.log(candiadate1[k].status);
                                candiadate1[k].save();
                                interview01.save();
                                noCandiate(false, 'candidate matched with interviewer');
                                break; // if gets matched than dont go further and map the next candidate
                            }
                            else if(canStart < intStart || CanSet.has(canID._id) === true){
                                canArrSi++; //if the candidate has already been sceduled => next candidate or start time of the can is smaller than the start time of the interviewer
                            }
                            else if(intStart < canStart || IntSet.has(intID._id) === true){
                                intArrSi++ //if interviewer has been scheduled for some other candidate try next interviewer
                            }
                            else{
                                
                            }
                        }
                        if(intArrSi==intArr.length || canArrSi==canArr.length){
                            //no interview matched
                            console.log("not matched");
                            // indicator(true);// indication that there is a created candidate but cannot be matched with any interviewer
                            noCandiate(true, 'cannot found match');
                        }
                        canArr = []; //clearing the candidate array bcs another candidate has to be stored 
                    }
                }
            }
            
        }
    });
    // flag = true;
    console.log("i ran");
}
// after an hour the interviewer_vis_set is again created bcs after an hour the same interviwer is available to take new interview calls

cron.schedule("*/3 * * * * *", job4); // hourly basis new this will run
/******************************************************************************************************************************** */


/******************************************** APIS ***************************************************************************/
app.use('/ta', UserRoutes); // i am the ta
app.use('/createCandidate',CandidateRoute); // want to crate candiadate
app.use('/interviewSlot', interviewSlotRoute); // changes in the interview slot
app.use('/interview', interviewRoute); // interview model
app.use('/fileupload',fileuploadRouter);// for uploading files

server.listen(PORT);
// module.exports = app;
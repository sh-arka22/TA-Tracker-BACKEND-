const AccessControl = require("accesscontrol");
const ac = new AccessControl();
 
exports.roles = ( () => {
ac.grant("interviewee")
 .readOwn("profile")
 .updateOwn("profile")
 
ac.grant("interviewer")
 .extend("interviewee")
 
ac.grant("ta_exec")
 .extend("interviewee")
 .extend("interviewer")
 .updateAny("profile")
 .deleteAny("profile")
 .createAny('profile')
 .readAny('profile')
 
return ac;
})();
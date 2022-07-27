# TA-Tracker-BACKEND

### **Tech Stack**
```s
1. Node/Python/nestJs 
2. MongoDB
3. Git - Version Control 
4. GCP - Deployment
```
---
### **Features**
```s
1. Authentication
2. CRUD Operations
3. FIle Upload
4. State Management
5. Background Jobs
6. Socket Implementation
```
  ### **Working of the project**
```s
1. Developer will create one user [Lets say TA1] as ta_exec.
2. New user (TA1) will login into the system.
3. TA1 will on-board interviewers.
4. On-boarded Interviewers will login.
5. On-boarded Interviewers will update their availability.
6. TA1 will on-board new candidates. He/she can either provide the candidate’s availability at the time of creation or can update it later on.
7. Interview Scheduler [hourly job] will schedule the interview. Candidate status will move to scheduled. Interview will be in created state.
8. Interviewer will be able to provide rating, feedback and status against any candidate for which he was assigned the interview.
9. Based on the feedback, rating and status provided by the interviewer, candidate status will either move to rejected or selected. Interview
status will also move to either rejected or selected.
10. TA1 will be able to view info for any candidate with interview details and their feedback.
```

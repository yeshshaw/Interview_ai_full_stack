const express = require('express') ;
const interviexController = require ("../controllers/interview.controller")
const authMiddleware = require("../middleware/auth.middleware");
const upload = require('../middleware/file.middleware') ;
const interviewRouter = express.Router() ;

interviewRouter.post('/' , authMiddleware.authMiddleware , upload.single("resume") ,  interviexController.generateInterviewReportController)

interviewRouter.get("/report/:interviewId" , authMiddleware.authMiddleware , interviexController.getInterviewReportByIdController)

interviewRouter.get("/" , authMiddleware.authMiddleware , interviexController.getAllInterviewReportsController)

interviewRouter.post("/generate-resume/:interviewReportId" , authMiddleware.authMiddleware , interviexController.generateResumePdfController)

module.exports = interviewRouter
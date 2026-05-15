const pdfParse = require('pdf-parse')

const {generateInterviewReport , generateResumePdf } = require('../service/ai.services')
const interviewReportModel = require('../model/interviewReport.model');
const { create } = require('../model/user.model');
const emailService = require("../service/email.services")

async function getInterviewReportByIdController(req , res) {
  const {interviewId} = req.params;
  const interviewReport = await interviewReportModel.findOne({_id : interviewId , user : req.user.id})
  if (!interviewReport) {
    return res.status(404).json({
      message: "Interview report not found"
    })
  }
  res.status(200).json({
    message: "interview report fetched succesfully" ,
    interviewReport
  })
}

async function getAllInterviewReportsController(req, res) {
  const interviewReports = await interviewReportModel.find({ user: req.user.id }).sort({ createdAt: -1 }).select("-resume -selfDescription -jobDescription -__v -technicalQuestions -behavioralQuestions -skillGaps -preparationPlan")
  if (!interviewReports) {
     return res.status(404).json({
      message: "Interview report not found"
    })
  }
    res.status(200).json({
        message: "Interview reports fetched successfully.",
        interviewReports
    })
}

async function generateInterviewReportController(req, res) {

  try {

    const { selfDescription, jobDescription } = req.body;

    let resumeText = "";

    // Resume optional
    if (req.file) {

      const resumeContent = await (
        new pdfParse.PDFParse(
          Uint8Array.from(req.file.buffer)
        )
      ).getText();

      resumeText = resumeContent.text;
    }

    const interviewReportByAi = await generateInterviewReport({
      resume: resumeText,
      selfDescription,
      jobDescription
    });

    const interviewReport = await interviewReportModel.create({
      user: req.user.id,
      resume: resumeText,
      selfDescription,
      jobDescription,
      ...interviewReportByAi
    });
    //send email
   
    res.status(201).json({
      message: "Interview report generated successfully",
      interviewReport
    });
     emailService.userGeneratedReportEmail(req.user.email , req.user.userName)

  } catch (error) {

    console.log(error);

    res.status(500).json({
      message: error.message
    });
  }
}

async function generateResumePdfController(req , res) {
  const {interviewReportId} = req.params ;
  console.log("ID:", interviewReportId);
  const interviewReport = await interviewReportModel.findById(interviewReportId)
  if(!interviewReport) {
    return res.status(400).json({
      message :"interview report not found"
    })
  }

  const {resume , selfDescription , jobDescription} = interviewReport ;
  const pdfBuffer = await generateResumePdf({ resume, selfDescription, jobDescription }) ;
  res.set({
      "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename=resume_${interviewReportId}.pdf`
  })
  res.send(pdfBuffer)
}



module.exports = {generateInterviewReportController , getAllInterviewReportsController , getInterviewReportByIdController , generateResumePdfController} ;
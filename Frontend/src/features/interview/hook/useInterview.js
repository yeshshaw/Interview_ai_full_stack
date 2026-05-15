import { useContext } from "react";
import { InterviewContext } from "../interview.contex";

import{generateInterviewReport , getAllInterviewReports , getInterviewReportById , generateResumePdf} from '../services/interview.api'
import {  useParams } from "react-router";


export const useInterview = ()=>{
  const context = useContext(InterviewContext) ;
  const {interviewId} = useParams()
  if (!context) {
    throw new Error ("useInterview must be used within an Interview Provider ")
  }

  const {loading , setLoading , report , setReport , reports , setReports} = context ;

  const generateReport = async  ({jobDescription , selfDescription , resume })=> {
    setLoading(true) ;
    try{
      const response = await generateInterviewReport({jobDescription , selfDescription , resume })
      setReport(response.interviewReport) ;
      return response.interviewReport
    }catch(error) {
      console.log(error)
    }finally{
      setLoading(false)
    }
  }

  const getReportById = async(interviewId)=>{
    setLoading(true) ;
    try{
      const response = await getInterviewReportById(interviewId) ;
      setReport(response.interviewReport) ;
      return response.interviewReport
    }
    catch(err){
      console.log(err) ;
    }finally{
      setLoading(false)
    }

  }


  const getAllReport = async()=>{
    setLoading(true)
    try {
      const response = await getAllInterviewReports() 
        setReports(response.interviewReports)
        return response.interviewReports
    }catch(err){ console.log(err)}finally{setLoading(false)}
  }
  
  const getResumePdf = async(interviewReportId)=>{
  setLoading(true) ;
  try {
    const response = await generateResumePdf({interviewReportId}) 
    const url = window.URL.createObjectURL(new Blob([response] , {type : "application/pdf"}))
    const link = document.createElement('a')
    link.href= url ;
    link.setAttribute("download" , `result_${interviewReportId}.pdf`)
    document.body.appendChild(link)
    link.click() ;
  }
        catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

  return {loading , report , reports , generateReport , getAllReport , getReportById , getResumePdf }
}





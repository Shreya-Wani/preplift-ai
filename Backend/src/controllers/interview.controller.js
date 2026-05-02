const pdf = require('pdf-parse')
const interviewReportModel = require('../models/interviewReport.model.js')
const aiService = require('../services/ai.service.js')

async function generateInterviewReport(req, res) {
    try {
        if (!req.file) {
            return res.status(400).json({
                message: "Resume file is required. Please upload a PDF file."
            })
        }

        if (!req.body.selfDescription || !req.body.jobDescription) {
            return res.status(400).json({
                message: "selfDescription and jobDescription are required."
            })
        }

        const { selfDescription, jobDescription } = req.body

        // Parse PDF using PDFParse class from pdf-parse
        const pdfData = await new pdf.PDFParse(req.file.buffer)
        const resumeContent = pdfData.text

        const interviewReportByAi = await aiService.generateInterviewReport({
            resume: resumeContent,
            selfDescription,
            jobDescription
        })

        const interviewReport = await interviewReportModel.create({
            user: req.user._id,   
            resume: resumeContent,
            selfDescription,
            jobDescription,
            ...interviewReportByAi
        })

        res.status(201).json({
            message: "Interview report generated successfully",
            interviewReport
        })
    } catch (err) {
        console.error("Interview report error:", err)
        res.status(500).json({
            message: "Error generating interview report",
            error: err.message
        })
    }
}

module.exports = { generateInterviewReport }

const { GoogleGenAI, ControlReferenceImage, FunctionCallingConfigMode } = require("@google/genai")
const z = require("zod")
const { zodToJsonSchema } = require("zod-to-json-schema")

const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_GENAI_API_KEY
});

const interviewReportSchema = z.object({
    matchScore: z.number().describe("A score between 0 and 100 that indicates how well the candidate matches the job description based on their resume and self description. A higher score indicates a better match."),

    technicalQuestions: z.array(z.object({
        question: z.string().describe("The technical question can be in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z.string().describe("How the candidate should answer this question, what points they should cover in the answer, what the approach should be, etc.")
    })).describe("A list of technical questions that can be asked in the interview, along with the intention behind each question and how the candidate should answer it."),

    behavioralQuestions: z.array(z.object({
        question: z.string().describe("The behavioral question can be in the interview"),
        intention: z.string().describe("The intention behind the question"),
        answer: z.string().describe("How the candidate should answer this question, what points they should cover in the answer, etc.")
    })).describe("A list of behavioral questions that can be asked in the interview, along with the intention behind each question and how the candidate should answer it."),

    skillGaps: z.array(z.object({
        skill: z.string().describe("The skill that the candidate is lacking based on the resume, self description and job description"),
        severity: z.enum(["low", "medium", "high"]).describe("The severity of the skill gap, i.e., how important it is for the candidate to work on this skill gap before the interview")
    })).describe("A list of skill gaps that the candidate has based on the resume, self description and job description, along with the severity of each skill gap."),

    preparationPlan: z.array(z.object({
        day: z.number().describe("The day number in the preparation plan, e.g., 1 for the first day, 2 for the second day, etc."),
        focus: z.string().describe("The main focus of the preparation for that day, e.g., data structures, system design, behavioral questions, etc."),
        tasks: z.array(z.string()).describe("A list of tasks that the candidate should do on that day to prepare for the interview, e.g., solve 3 coding problems on LeetCode, read a chapter from a system design book, practice answering 5 behavioral questions, etc.")
    })).describe("A day-wise preparation plan for the candidate to prepare for the interview, based on the skill gaps and the questions that can be asked in the interview.")
})


async function generateInterviewReport({ resume, selfDescription, jobDescription }) {

    const prompt = `You are an AI assistant tasked with generating a comprehensive interview report for a candidate based on their resume, self-description, and the job description. Please analyze the provided information and create a detailed report that includes:
                    1. A match score between 0 and 100 indicating how well the candidate matches the job description.
                    2. A list of technical questions that can be asked in the interview, along with the intention behind each question and how the candidate should answer it. Generate at least 5 questions.
                    3. A list of behavioral questions that can be asked in the interview, along with the intention behind each question and how the candidate should answer it. Generate at least 5 questions.
                    4. A list of skill gaps that the candidate has based on the resume, self description and job description, along with the severity of each skill gap. Generate at least 3-5 gaps.
                    5. A day-wise preparation plan for the candidate to prepare for the interview, based on the skill gaps and the questions that can be asked in the interview. Generate a 5-7 day plan.
                    
                    IMPORTANT: Return ONLY valid JSON matching this exact structure:
                        "matchScore": number,
                        "technicalQuestions": [{"question": string, "intention": string, "answer": string}, ...],
                        "behavioralQuestions": [{"question": string, "intention": string, "answer": string}, ...],
                        "skillGaps": [{"skill": string, "severity": "low|medium|high"}, ...],
                        "preparationPlan": [{"day": number, "focus": string, "tasks": [string, ...]}, ...]
                    
                    Resume: ${resume}
                    Self-Description: ${selfDescription}
                    Job-Description: ${jobDescription}`

    try {
        console.log('🚀 Calling Gemini API with interview report schema...')
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: [{
                role: "user",
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: zodToJsonSchema(interviewReportSchema),
            }
        })

        console.log('📩 Raw Gemini response:', response.response?.text || response.text)
        let responseText = response.response?.text || response.text
        
        if (!responseText) {
            throw new Error('No response text from Gemini API')
        }
        
        // Strip markdown code block wrapper if present
        responseText = responseText.replace(/^```json\n?/, '').replace(/\n?```$/, '').trim()
        
        console.log('📋 Cleaned response:', responseText)
        const parsed = JSON.parse(responseText)
        console.log('✅ Parsed response:', JSON.stringify(parsed, null, 2))
        return parsed
    } catch (err) {
        console.error('❌ AI Service error:', err.message)
        console.error('Full error:', err)
        throw err
    }

}

module.exports = { generateInterviewReport }

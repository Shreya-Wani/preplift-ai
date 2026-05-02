const mongoose = require("mongoose")

/**
 * -job description schema
 * -resume text
 * -Self description
 * 
 * -matchScore : number
 * 
 * -Technical questions :
 *          [{
 *              question : "",
 *              intention "",
 *              answer : "",
 *          }]
 * 
 * -Behavioral questions :
 *          [{
 *              question : "",
 *              intention "",
 *              answer : "",
 *          }]
 * 
 * -Skill gaps: 
 *          [{
 *              skill: "",
 *              severity: {
 *                  type : String,
 *                  enum : ["low", "medium", "high"]
 *              }
 *          }]
 * 
 * -preperation plan : 
 *          [{
 *             day : Number,
 *             focus : String,
 *             tasks : [String]
 *          }]
 */

const technicalQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [ true, "Technical question is required" ]
    },
    intention : {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer : {
        type: String,
        required: [ true, "Answer is required" ]
    }  
},  {
    _id: false
    }
)

const BehavioralQuestionSchema = new mongoose.Schema({
    question : {
        type: String,
        required: [ true, "Behavioral question is required" ]
    },
    intention : {
        type: String,
        required: [ true, "Intention is required" ]
    },
    answer : {
        type: String,
        required: [ true, "Answer is required" ]
    }  
},  {
    _id: false
    }
)

const skillGapSchema = new mongoose.Schema({
    skill: {
        type: String,       
        required: [ true, "Skill is required" ]
    },
    severity: {
        type : String,
        enum : ["low", "medium", "high"],
        required: [ true, "Severity is required" ]
    }
},  {
    _id: false
    }
)

const preperationPlanSchema = new mongoose.Schema({
    day : {
        type: Number,
        required: [ true, "Day is required" ]
    },
    focus : {   
        type: String,
        required: [ true, "Focus is required" ]
    },
    tasks : {
        type: [String],
        required: [ true, "Tasks are required" ]
    }
},  {
    _id: false
    }
)

const interviewReportSchema = new mongoose.Schema({

    jobDescription : {
        type: String,
        required: [ true, "Job description is required" ]
    },
    resume : {
        type: String,
    },
    selfDescription : {
        type: String,
    },
    matchScore : {
        type: Number,
        min: 0,
        max: 100,
    },
    
    technicalQuestions : [technicalQuestionSchema],
    behavioralQuestions : [BehavioralQuestionSchema],
    skillGaps : [skillGapSchema],
    preparationPlan : [preperationPlanSchema],
    user : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true
})

const InterviewReport = mongoose.model("InterviewReport", interviewReportSchema)

module.exports = InterviewReport
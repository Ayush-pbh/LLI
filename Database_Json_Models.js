const users = {
    "id" :  "qwerty",
    "name" : "Jay",
    "m-name" : "",
    "s-name" : "Dixit",
    "mail" : "jay.dixit@gmail.com",
    "phone" : "8964084967",
    "position" : "user",
    "dob" : {
        "dd" : "12",
        "mm" : "04",
        "yy" : "2013"
    },
    "ngo-id" : "nog_to_which_the_user_belongs_given_by_MongoDB",
    "ngo-admin-id" : "given_by_MongoDB",
    "volunteer-id" : "given_by_MongoDB",
    "case-list" : ["case_id_given_by_MongoDB", "case_id_given_by_MongoDB", "case_id_given_by_MongoDB",],
    "karma" : 46,
}
const gallery = {
    "gallery-id" : "given_by_MongoDB",
    "case-id" : "case_to_which_gallery_belongs_to",
    "collections" : [
        {
            "type" : "img/jpg",
            "uri" : "https://--------",
            "description" : "Pet Image"
        },
        {  
            "type" : "doc/xlxs",
            "uri" : "https://--------",
            "description" : "Fund descripency"
        },
    ]
}
const mycase = {
    "case_id" : "given_by_MongoDB",
    "hero_heading" : "",
    "description" : "",
    "factory-date" : "",
    "gallery-id" : "id_of_gallery_of_this_case",
    "ngo-id" : "NGO_ID_given_by_MongoDB",
    "verified-status" : "verified/un-verified",
    "volunteer-head-id" : "given_by_MongoDB",
    "volunteer-list" : [
        {
            "volunteer-id" : "given_by_MongoDB",
            "karma-point" : 4
        }
    ]
}

// SCHEMA
const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    fname : {
        type:String,
        required:true
    },
    lname : {
        type:String,
        required:true
    },
    age : {
        type:String,
        required:true
    },
    password : {
        type:String,
        required:true
    },
    mail : {
        type:String,
        required:true
    },
    mailVerified: {
        type: Boolean,
        required : true
    },
    phone : {
        type:String,
        required:true
    },
    phoneVerified: {
        type: Boolean,
        required : true
    },
    position : {
        type:String,
        required:true
    },
    dob : {
        type:Date,
        required:true
    },
    ngoid : {
        type:String,
        required:true
    },
    ngoadminid : {
        type:String,
        required:true
    },
    volunteerid : {
        type:String,
        required:true
    },
    caselist : {
        type:Array,
        required:true
    },
    dac : {
        type:Date,
        required:true
    },
    mailSecret : {
        type: String,
        required:false
    },
    karma : {
        type:String,
        required:true
    },
    casesVolIn : {
        type:Array,
        required:false
    }
    
})
const caseSchema = new mongoose.Schema({
    userSubmitFName : {
        type: String,
        required : true
    },
    userSubmitLName : {
        type: String,
        required : true
    },
    userSubmitContact : {
        type: String,
        required : true
    },
    userSubmitId : {
        type: String,
        required : true
    },
    caseAnimalName : {
        type:String,
        required:true
    },
    caseAnimalType : {
        type:String,
        required:true
    },
    caseIncidentType : {
        type:String,
        required:true
    },
    description : {
        type:String,
        required:true
    },
    additionalNotes : {
        type:String,
        required:false
    },
    caseLocation : {
        type:Array,
        required:true
    },
    caseLocationGMapLink : {
        type:String,
        required : false
    },

    caseStatus : {
        type:String,
        required : true
    },
    caseGenerateDate : {
        type:Date,
        required:true
    },
    caseFinishedDate : {
        type:Date,
        required:false
    },
    caseGalleryId : {
        type:String,
        required:false
    },
    caseUnderNgoId : {
        type:String,
        required:false
    },
    caseVerified : {
        type:Boolean,
        required:true
    },
    volunteerHeadId : {
        type: String,
        required:false
    },
    volunteerList : {
        type: Array,
        required: false
    }
})
const gallerySchema = new mongoose.Schema({
    caseId : {
        type:String,
        required: true
    },
    collections : {
        type: Array,
        required:true
    }
})
// MODELS
const USER = mongoose.model('USER', userSchema)
const CASE = mongoose.model('CASE', caseSchema)
const GALLERY = mongoose.model('GALLERY', gallerySchema)
module.exports = {
    USER : USER,
    GALLERY : GALLERY,
    CASE : CASE
}

// const NGO = {
//     "ngo-id" : "    ",
//     ""
// }
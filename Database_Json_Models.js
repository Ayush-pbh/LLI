
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
    volunteerRequestedNGO : {
        type: String,
        required:false
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
    },
    profilepicurl : {
        type:String,
        required: false
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

const ngoSchema = new mongoose.Schema({
    ngoFullName : {
        type: String,
        required: true
    },
    ngoOfficialMail : {
        type: String,
        required: true
    },
    ngoOfficialContact : {
        type: String,
        required : true
    },
    ngoDateOfEstablishment : {
        type: Date,
        required : true
    },
    ngoTotalMembers : {
        type: String,
        required: true
    },
    ngoActiveMembers : {
        type: String,
        required: true
    },
    ngoShelterStatus : {
        type: Boolean,
        required: true
    },
    ngoAddress : {
        type: String,
        required: true
    },
    ngoAddCity : {
        type: String,
        required: true
    },
    ngoAddDistrict : {
        type: String,
        required: true
    },
    ngoAddState : {
        type: String,
        required: true
    },
    ngoAddPincode : {
        type: String,
        required: true
    },
    ngoLogoFileId : {
        type: String,
        required : true
    },
    ngoDocumentsFileId : {
        type: String,
        required: true
    },
    ngoLogoUrl : {
        type: String,
        required: true
    },
    ngoDocumentsUrl : {
        type: String,
        required: true
    },
    ngoBoardMembers : {
        type: Array,
        required: true
    },
    ngoRefrenceCode : {
        type: String,
        required: true
    },
    ngoVolunteerList : {
        type: Array,
        required: true
    },
    ngoPendingRequestList : {
        type: Array,
        required: true
    },
    ngoDeclineRequestList : {
        type: Array,
        required: true
    },
    ngoKarma : {
        type: String,
        required: true
    },
    ngoKarmaList : {
        type: Array,
        required: true
    },
    ngoAdminId : {
        type:String,
        required:true
    }
})

const fileSchema = new mongoose.Schema({
    filename : {
        type: String,
        required: true
    },
    uploaderId : {
        type: String,
        required : true
    },
    fileTag: {
        type: String,
        required: true
    },
	originalname : {
        type: String,
        required: true
    },
	encoding:  {
        type: String,
        required: true
    },
	mimetype:  {
        type: String,
        required: true
    },
	destination:  {
        type: String,
        required: true
    },
	path: {
        type: String,
        required: true
    },
	size: {
        type: String,
        required: true
    },
    doc :  {
        type:Date,
        required: false
    }
})
// MODELS
const USER = mongoose.model('USER', userSchema)
const CASE = mongoose.model('CASE', caseSchema)
const GALLERY = mongoose.model('GALLERY', gallerySchema)
const NGO = mongoose.model('NGO', ngoSchema)
const FILEUPLOAD = mongoose.model('FILE', fileSchema)
module.exports = {
    USER : USER,
    GALLERY : GALLERY,
    CASE : CASE,
    NGO: NGO,
    FILEUPLOAD : FILEUPLOAD
}

// const NGO = {
//     "ngo-id" : "    ",
//     ""
// }
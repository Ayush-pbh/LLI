/*
    Author : Ayush Tripathi (@Ayush-pbh)
    Desc   : Application for Lifline India Ltd.
*/

/*
    Imports 
*/
const express = require('express')
var bodyParser = require('body-parser')
const multer = require('multer')

const mongoose = require('mongoose')
const mongo_models = require('./Database_Json_Models.js')
const jwt = require('jsonwebtoken')
const jwtConfig = require('./config/auth.config')
const bcrypt = require('bcrypt')
const { USER } = require('./Database_Json_Models.js')
const path = require('path')
const fs = require('fs')
var ObjectId = require('mongoose').Types.ObjectId; 
const cors = require('cors')
const util = require('util')
const nodemailer = require('nodemailer')

const saltRounds = 10
const maxSize = 50 * 1024 * 1024; // 50 Mb File Max Size.

/*
    Import Setup Lines Below!
*/
const transporter = nodemailer.createTransport({
    port: 465,               // true for 465, false for other ports
    host: "smtp.gmail.com",
       auth: {
            user: 'ayushmediagroup.noreply@gmail.com',
            pass: 'mzrcilxtjuonhclp',
         },
    secure: true,
});

const port  = 3000  // Port for Application in development
const app = express()  
app.use(express.static('site/'))
app.use(express.static('uploads/'))
app.use(cors())
app.use(bodyParser.json())
//Database setup
let database_uri = 'mongodb+srv://admin:admingunpayswell@basedb.ogh4zui.mongodb.net/base?retryWrites=true&w=majority'
//Connecting to the Database
const DB = mongoose.connect(database_uri).then(()=>{
    console.log("Connected to the DB")
}).catch((err)=>{
    console.log("Error in connection : "+err)
})



/**
 * 
 *  Functions
 *      [1] : validate_register_details ,  "For validating the details provided by the uer to register him/her to the application, this function first  performs a value check on all the fields and then checks the type of data entered then validates email, phone & position"
*/


const validate_register_details = function(req, res, next){
     
    const {fname, lname, mail, phone, password, cpassword, dob, position} = req.body
    if(!fname || !lname || !mail || !phone || !password || !cpassword || !dob || !position){
        res.status(422).json({error:"Don't leave any field empty! "})
    }
    else{
        if(password!==cpassword){
            res.status(422).json({error:"Password do not match"})
        }
        else{
            next()
        }
    }

}
const verify_token = function(req, res, next){
    //validate the token and then put the id in req.id

    let token = req.headers['x-access-token']
    if(!token){
        res.status(403).json({message:"No token provided"})
    }
    else{
        jwt.verify(token, jwtConfig.jwtSecret, (err, decode)=>{
            if(err){
                res.status(403).json({message:"Token Not Verified"})
            }
            else{
                req.userId = decode.id;
                next()
            }
        })
    }
}
const validate_newcase_details = function(req,res,next){
    const {userSubmitFName,userSubmitLName,userSubmitContact,caseAnimalName,caseAnimalType,caseIncidentType,description,caseLocation} = req.body
    if( !userSubmitFName || !userSubmitLName || !userSubmitContact || !caseAnimalName || !caseAnimalType || !caseIncidentType || !description || !caseLocation ){
        res.status(422).json({error: "Field Found Empty / Invalid Inputs"})
    }
    else{
        next()
    }
}
function createNewGalleryForCaseAndUpdateCase(case_id) {
    full_json = {
        caseId : case_id,
        collections : []
    }
    const newGallery = mongo_models.GALLERY(full_json)
    newGallery.save().then((ee)=>{
        var idd = { _id: new ObjectId(case_id) };
        mongo_models.CASE.updateOne({_id: idd}, {caseGalleryId : newGallery._id}).catch(err=>console.log(`Erorr in Linking Gallery to Case ${err}`))
    })
    .catch((err)=>{
        console.log(`Error in creating the Gallery for Case[${case_id}]`+err)
    })
}
function createChatroomForCaseAndUpdateCase(case_id){
    full_json = {
        caseId : case_id,
        chats : []
    }
    const newChatroom = mongo_models.CHATROOM(full_json)
    newChatroom.save().then((ee)=>{
        var idd = {_id : new ObjectId(case_id)}
        mongo_models.CASE.updateOne({_id : idd}, {chatroomId : newChatroom._id}).catch(err=>console.log('Error in linking chatroom to case'))
    })
    .catch((err)=>{
        console.log('Error in creating chatroom!')
    })
}
function addCaseToUserCaseList(userid,caseid) {
    var idd = { _id: new ObjectId(userid) };
    mongo_models.USER.updateOne({_id: idd}, {$push : {caselist : caseid}}).then((resp)=>{
        if(resp){
            console.log("Caselist of the user updated!")
        }
    }).catch(err=>console.log(`Erorr in updating the caselist of the user ${err}`))
}
function getMailConfirmObj(otp,mail) {
    const mailData = {
        from: 'ayushmediagroup.noreply@gmail.com',  // sender address
        to: mail,   // list of receivers
        subject: 'Email Confirmation',
        text: 'Test Email Works!',
        html:  `<h2>Hi! Welcome to LifeLifeIndia.</h2><br><h4>${otp}</h4><h5>Is your mail confirmation OTP. Paste this otp in the otp section of the application.<br> Please do not share it with anyone.</h5><br>If you didn't initiate this request, Please Ignore.`,
    };
    return mailData
}
let storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, './uploads')
    }
})
const upload = multer({storage: storage})
/**
 *  SIMPLE COMMANDS - required for some purpose, written beside every app
 *  
 */


/**
 * Routes : 
 *      /   -> Default homepage Route
 *      /login -> For login
 *      /register -> For register
 *      /profile  -> For User Profile
 *      /password-cahange   -> For User Password Change
 *      
 *      /upload-data -> upload-file 
*/

// Cookie Test

//  '/' -> For Homepage 
app.get('/', (req,res)=>{
    res.sendFile((path.join(__dirname, "/site/login.html")))
})
//  '/login' -> FOr Login
app.post('/login', (req,res)=>{
    // Here login canbe done using JWT
    
    const {mail, password} = req.body
    mongo_models.USER.findOne({mail:mail}).then((status)=>{
        if(status){
            //user found!

            original_hash = status['password']
            bcrypt.compare(password, original_hash, function(err, result) {
                if(result){
                    //check for uses's email and phone verification
                    if(status['mailVerified']){
                        if(status['phoneVerified']){
                            payload = status['id'].toString()
                            var token = jwt.sign({ id: payload }, jwtConfig.jwtSecret, {
                                expiresIn: 86400 // 24 hours
                            });
                            console.log(`The Web token is : ${token}`);
                            res.status(200).json({message:"Logged In!", token:token}).send()
                        }
                        else{
                            res.status(401).json({message:"Please verify your phone"})
                        }
                    }
                    else{
                        res.status(401).json({message:"Please verify your e-mail"})
                    }
                }
                else{
                    res.status(401).json({message:"Login Id / Password Does Not Match!"})
                }
            });
        }
        else{
            res.status(401).json({message:"Login Id / Password Does Not Match!"})
        }
    }).catch((err)=>{
        console.log(err)
        res.status(202)
    }) 
})
app.post('/register', validate_register_details, (req,res)=>{
    
    const {fname, lname, mail, phone, password, cpassword, dob, position} = req.body
    // age calculation
    ff = new Date(Date.now() - (new Date(dob).getTime()))
    age = Math.abs(ff.getUTCFullYear() - 1970)
    /**
     * Check the user's given email id, for pre-exsistance
     * The same process will go forward for phone
     */
    
    mongo_models.USER.findOne({mail:mail}).then((status)=>{
        if(status){
            res.status(422).json({error:"User with the email already exsits"})
            return undefined
        }
        else{
            mongo_models.USER.findOne({phone:phone}).then((status)=>{
                if(status){
                    res.status(422).json({error:"User with the phone number already exsits"})
                }
                else{
                    /**
                     * Password Encryption using bcrypt!
                     * 
                     */
                    bcrypt.hash(password, saltRounds, function(err, hash) {
                        // Store hash in your password DB.
                        hashedPasscode = hash;
                        ngoid = "000", ngoadminid = "000", volunteerid = "000", caselist = "000", karma = "000", mailVerified = false, phoneVerified = true, profilepicurl='000'
                        dac = new Date()
                        let data_to_create_new_user = {}    
                        mailSecret = parseInt(Math.abs(Math.random()*1000000))
                        if(position=='volunteer'){
                            data_to_create_new_user = {fname, lname, age, password:hashedPasscode, mail, mailVerified,phone, phoneVerified,position, dob, ngoid, ngoadminid, volunteerid, caselist,dac, mailSecret, karma, casesVolIn:[],profilepicurl }
                        }
                        else{
                            data_to_create_new_user = {fname, lname, age, password:hashedPasscode, mail, mailVerified,phone, phoneVerified,position, dob, ngoid, ngoadminid, volunteerid, caselist,dac, mailSecret, karma, profilepicurl }
                        }
                        const new_user = new mongo_models.USER(data_to_create_new_user)
                        
                        
                        new_user.save().then((ee)=>{
                            
                            mailData = getMailConfirmObj(mailSecret, new_user.mail);
                            // Sending mail Now
                            transporter.sendMail(mailData, function (err, info) {
                                if(err)
                                    console.log(err)
                                else
                                    console.log(info)

                            });
                            res.json({message:"User Created Succesfully! You May Login now!", otp:mailSecret})
                        }).catch((err)=>{
                            console.log(err)
                        })
                    })
                }
                
            })
        }
        
    }).catch((err)=>{
        console.log("Error Happend "+err)
    })
   

    
    

})
app.post('/confirmEmail', (req,res)=>{
    const {mail, mailSecret} = req.body
    console.log(`Mail Id = ${mail} and Mail Secret = ${mailSecret}`)
    
    mongo_models.USER.findOne({'mail':mail}).then((stat)=>{
        if(stat){
            // if user with that email exsist then we will verify his secret.
            originalSecret = stat['mailSecret']
            if (originalSecret===mailSecret){
                console.log("VALID VALID")
                stat['mailVerified'] = true
                stat.save().then((p)=>{
                    if(p){
                        res.status(200).json({message:"Account Validated"})
                    }
                    else{
                        res.status(501).json({message:"Mail Secret is Correct but Database updation failed!"})
                    }
                })
            }
            else{
                console.log("Account validation failed")
                res.status(401).json({message:"Account validation failed"})
            }
        }
        else{
            res.status(401).json({message:"No Such user exsist"})
        }
    })
    // res.status(200)
})
app.post('/userProfile',verify_token, (req,res)=>{
    // console.log(`Decoded User Id : ${req.userId.prototype.toString()}`)
    // start = performance.now()
    var query = { _id: new ObjectId(req.userId) };
    mongo_models.USER.findOne(query).then((stat)=>{
        if(stat){
            res.status(200).json(stat)
        }
        else{
            res.status(200).json({message:`No user for user id ${req.userId} Found!`})
            
        }
    })
    // end = performance.now()
    // t = end - start
    // console.log("Time taken = "+(t/1000)+" Seconds.")
    // res.status(200).json({message:`User Id : ${req.userId}`})
})
app.post('/createNewCase', verify_token, validate_newcase_details, (req,res)=>{
    console.log(`UserId for case creation : ${req.userId}`);
    jdata = req.body
    
    // First create the Gallery then save the user!

    full_json = {
        
        userSubmitFName : jdata.userSubmitFName,
        userSubmitLName : jdata.userSubmitLName,
        userSubmitContact : jdata.userSubmitContact,
        userSubmitId : req.userId,
        caseAnimalName : jdata.caseAnimalName,
        caseAnimalType : jdata.caseAnimalType,
        caseIncidentType : jdata.caseIncidentType,
        description : jdata.description,
        additionalNotes : (jdata.additionalNotes?jdata.additionalNotes:""),
        caseLocation : jdata.caseLocation,
        caseLocationGMapLink : (jdata.caseLocationGMapLink?jdata.caseLocationGMapLink:""),
        caseStatus : "open",
        caseGenerateDate : new Date(),
        caseFinishedDate : "",
        caseGalleryId : "First Gallry Creation! Then link here!",
        caseUnderNgoId : "",
        caseVerified : false,
        volunteerHeadId : "",
        volunteerList : [],
        chatroomId : "000"
    }
    
    // Creating the new case
    const newCase = mongo_models.CASE(full_json)
    newCase.save().then((ee)=>{
        console.log("Case Created Successfully " + newCase._id)
        // Creating a new Gallery and link it to the case
        createNewGalleryForCaseAndUpdateCase(newCase._id)
        // Creating a new Chatroom and linking it to the case
        createChatroomForCaseAndUpdateCase(newCase._id)
        // Adding the newCase id to the user's case list who is, creating the case
        addCaseToUserCaseList(req.userId, newCase._id)
        res.status(200).json({message:"Case Created Successfully!",caseId : newCase._id})
    })
    .catch((err)=>{
        console.log("error happened while creating cases "+err)
        res.status(500).json({error:err})
    })    
})
app.post('/getUserGeneratedCases', verify_token, (req,res)=>{
    // Input
    // userId from token
    // Output... Array of cases
    // var idd = { _id: new ObjectId(req.userId) };
    mongo_models.CASE.find({userSubmitId : req.userId} , function(err,cases){
        if(!err){
            let caseSet = Array()
            cases.forEach(cc => {                
                caseSet.push(cc)
            });
            res.status(200).json({message:caseSet})
        }
        else{
            console.log("Err :"+ err)
            res.status(422).json({message:"Error "+err})
        }
    }).sort({caseGenerateDate:-1})
})
app.post('/getCaseByStatus', verify_token, (req,res)=>{
    // Checking if the user is a volunteer then only showing him open cases to work on!
    if(req.body.caseFilter=="open" || req.body.caseFilter=="full" || req.body.caseFilter=="closed"){
        var query = { _id: new ObjectId(req.userId) };
        mongo_models.USER.findOne(query).then((stat)=>{
            if(stat){
                if(stat.position==='volunteer'){
                    mongo_models.CASE.find({caseStatus: req.body.caseFilter}, (err,cases)=>{
                        let caseSet = Array()
                        if(!err){
                            cases.forEach((cc)=>{
                                caseSet.push(cc)
                            })
                            res.status(200).json({message:caseSet})
                        }
                        else{
                            res.status(422).json({message:"err : "+err})
                        }
                    })
                }
                else{
                    res.status(401).json({message:`Only Volunteers can access Case Find Query.`})
                }
            }
            else{
                res.status(422).json({message:`No user for user id ${req.userId} Found!`})
            }
        })
    }
    else if(req.body.caseFilter=="*"){
        var query = { _id: new ObjectId(req.userId) };
        mongo_models.USER.findOne(query).then((stat)=>{
            if(stat){
                if(stat.position==='volunteer'){
                    mongo_models.CASE.find({}, (err,cases)=>{
                        let caseSet = Array()
                        if(!err){
                            cases.forEach((cc)=>{
                                caseSet.push(cc)
                            })
                            res.status(200).json({message:caseSet})
                        }
                        else{
                            res.status(422).json({message:"err : "+err})
                        }
                    })
                }
                else{
                    res.status(401).json({message:`Only Volunteers can access Case Find Query.`})
                }
            }
            else{
                res.status(422).json({message:`No user for user id ${req.userId} Found!`})
            }
        })
    }
    else{
        res.status(422).json({message:"Invalid Filter Passed!"})
    }
})
app.post('/joinACase', verify_token, (req,res)=>{
    // Check if the user is volunteer then only considering his request!
    // We can perform many checks here like, total-ongoing cases the user is part of. 
    // The Karma he has recived... On these basis we decide to allow him in the case.
    
    caseRequestedToJoin = req.body.caseId
    console.log("Try Joining: "+caseRequestedToJoin)
    mongo_models.USER.findOne({_id : req.userId}).then((stat)=>{
        if(stat){
            if(stat.position==='volunteer'){
                mongo_models.CASE.findOne({_id: caseRequestedToJoin}, (err,output)=>{
                    console.log(output)
                    console.log(err)

                    if(!err){
                        // Check if the user is not already a part of the case
                        let alreadyJoined = false
                        let vol_len = output.volunteerList.length
                        output.volunteerList.forEach((vol)=>{
                            if(vol==req.userId){
                                alreadyJoined = true
                            }
                        })  
                        if(!alreadyJoined){
                            // Remember to check if the case is even open for admissons
                            if(output.caseStatus==='open'){
                                // Adding Ids to respective list
                                mongo_models.CASE.updateOne({_id: caseRequestedToJoin}, {$push : {volunteerList : req.userId}}).then((resp)=>{if(resp){console.log("Volunteer added to the Volunteer-List of the Case!")}})
                                .catch(err=>console.log(`Error in adding Volunteer to the Volunteer-List of the Case : ${err}`))
                                
                                mongo_models.USER.updateOne({_id: req.userId}, {$push : {casesVolIn : caseRequestedToJoin}}).then((resp)=>{if(resp){console.log("Case added to the Case-List of the Volunteer!")}})
                                .catch(err=>console.log(`Error in adding Case to the Case-List of the Volunteer : ${err}`))
                                
                                // Checking if the flag needs to be changed
                                if(vol_len==5){
                                    // Length was 5 now it is 6 since we added a volunteer
                                    // Hence we need to put on the full tag in the case status option
                                    mongo_models.CASE.updateOne({_id: caseRequestedToJoin},  {caseStatus : "full"}).then((resp)=>{if(resp){console.log("Case is Now Full")}})
                                    .catch(err=>console.log(`Error in updating the status of Case`))
                                }
                                res.status(200).json({message:"Joined!"})
                            }
                            else{
                                res.status(422).json({message:`The case you are trying to join is ${output.caseStatus} already!`})
                            }
                        }
                        else{
                            res.status(200).json({message:`Already Joined!`})
                        }
                    }
                    else{
                        
                        res.status(422).json({message:`No Such Case Found!`})
                    }
                })
            }
            else{
                res.status(401).json({message:`Only Volunteers can join cases.`})
            }
        }
        else{
            res.status(422).json({message:`No user for user id ${req.userId} Found!`})
        }
    })
})
app.post('/getVolJoinedCases', verify_token, (req,res)=>{
    // Cases Joined by the Volunteer Location case.
    // Get User caselist then get each case and addit to the caselist to return
    var query = { _id: new ObjectId(req.userId) };
    mongo_models.USER.findOne(query).then((userdata)=>{
        // caselist = userdata.
        caselist = userdata.casesVolIn
        // Update the caselist String to ObjectId type
        for (let i = 0; i < caselist.length; i++) {
            element = caselist[i];
            caselist[i] = mongoose.Types.ObjectId(element)
        }
        mongo_models.CASE.find({
            '_id': { $in: caselist}
        }, function(err, docs){
            if(err){
                res.status(422).json({message:"Error "+err})
            }
            else{
                res.status(200).json({message:docs})
            }
        });        
    }).catch((err)=>{
        res.status(422);
    })
})

app.post('/getVolFeedCase', verify_token, (req,res)=>{
    // Cases for the Volunteer Location case.
    mongo_models.CASE.find({}, function(err, docs){
        if(err){
            res.status(422).json({message:"Error "+err})
        }
        else{
            res.status(200).json({message:docs})
        }
    });
})

app.post('/sendForgotPasswordOtp', (req,res)=>{
    // mail
    // return OTP , also otp is stored in the database
    let mail = req.body.mail
    if(mail){
        mongo_models.USER.findOne({mail:mail}).then((status)=>{
            if(status){
                // User found now we will send the mailSecret to the user
                mailData = getMailConfirmObj(status.mailSecret, status.mail);
                    // Sending mail Now
                    transporter.sendMail(mailData, function (err, info) {
                        if(err)
                            console.log(err)
                        else
                            console.log(info)

                });
                res.status(200).json({otp:"Sent on mail."})   
            }
            else{
                res.status(422).json({error:"No User Found!"})
            }})
    }
    else{
        res.status(422).json({message:"Empty Field!"})
    }

})

app.post('/forgotPasswordVerify', (req,res)=>{
    // mail, new password and otp
    // if otpVerified then change password
    let mail = req.body.mail
    let otp = req.body.otp
    let newPass = req.body.newPass
    if(mail && otp && newPass){
        mongo_models.USER.findOne({mail:mail}).then((status)=>{
            if(status){
                // User found now we will send the mailSecret to the user
                if(otp==status.mailSecret){
                    // replace to the new password!
                    bcrypt.hash(newPass, saltRounds, function(err, hash) {
                        if(hash){
                            mongo_models.USER.findOneAndUpdate({ _id: new ObjectId(status._id) }, {password: hash}).then(()=>{
                                console.log("Password Changed for User")
                                res.status(200).json({message: "Password Changed Succesfully!"})
                            }).catch((err)=>{
                                console.log("Error in Password Changed for User"+err)
                                res.status(422).json({message: "Error in Password Change!"+err})
                            })
                        }
                    })
                }
                else{
                    res.status(422).json({error:"Wrong OTP"})
                }
            }
            else{
                res.status(422).json({error:"No User Found!"})
            }})
    }
    else{
        res.status(422).json({message:"Empty Field!"})
    }  
})

// NGO Stuff
app.post('/registerNGO', verify_token,(req, res)=>{

    // validate that the user is of a type admin. and does not already has a ngo registered.
    mongo_models.USER.findOne({_id : new ObjectId(req.userId)}).then((ud)=>{
        if(ud.position=='ngo-admin'){
            // Now check if ngo-admin already has a ngo!
            if(ud.ngoid=="000"){
                // No prior ngo exsist
                // Create a new entry in files DB and add it's 
                // Create NGO here!
                let jsonD = {
                    ngoFullName : req.body.ngoFullName,
                    ngoOfficialMail : req.body.ngoOfficialMail,
                    ngoOfficialContact : req.body.ngoOfficialContact,
                    ngoDateOfEstablishment : req.body.ngoDateOfEstablishment,
                    ngoTotalMembers : req.body.ngoTotalMembers,
                    ngoActiveMembers : req.body.ngoActiveMembers,
                    ngoShelterStatus : req.body.ngoShelterStatus,
                    ngoAddress : req.body.ngoAddress,
                    ngoAddCity : req.body.ngoAddCity,
                    ngoAddDistrict : req.body.ngoAddDistrict,
                    ngoAddState : req.body.ngoAddState,
                    ngoAddPincode : req.body.ngoAddPincode,
                    
                    ngoLogoUrl : "Not Yet Usable",
                    ngoDocumentsUrl : "Not Yet Usable",
                    
                    ngoBoardMembers : req.body.ngoBoardMembers,
                    ngoRefrenceCode : req.userId,
                    ngoVolunteerList : [],
                    ngoPendingRequestList : [],
                    ngoDeclineRequestList : [],
                    ngoKarma : "000",
                    ngoKarmaList : [],
                    ngoAdminId : req.userId,
                    
                    ngoDocumentsFileId:"=*=*",
                    ngoLogoFileId:"====="
                }
                const newNGO = mongo_models.NGO(jsonD)
                newNGO.save().then((e)=>{
                    console.log("Case created Successfully!")
                    // Now add the Ngo Id to the Admins DB
                    mongo_models.USER.updateOne({_id: req.userId}, {ngoid : newNGO._id}).catch((e)=>{
                        console.log(`Error in Adding NGO ${newNGO._id} to Admin ${req.userId}.`)
                    })
                    res.status(200).json({message:"Case Created Successfully with CaseID : "+newNGO._id})
                })
                .catch((err)=>{
                    console.log("Failed to create Case! "+err)
                    res.status(500).json({message:err})
                })
            }
            else{
                // NGO already created by the ngo admin
                res.status(406).json({message:"NGO is already created!"})
            }
        }
        else{
            res.status(400).json({message:"Only Admins are allowed to create ngo's"})
        }
    })
    .catch((err)=>{
        res.status(422).json({message:`Error Happended ${err}`})
    })
})

app.post('/getMyNgoDetails',verify_token, (req,res)=>{
    // Get NGO ID 
    mongo_models.USER.findOne({_id : new ObjectId(req.userId)}).then((resp)=>{
        if(resp.position=='ngo-admin'){
            // Now get the NGO ID from here
            if(resp.ngoid=='000'){
                res.status(400).json({message:"You Don't Have an Ngo Yet!"})
            }
            else{
                userNgoId = resp.ngoid
                // Now find this Ngo from NGO mongo_models
                mongo_models.NGO.findOne({_id : userNgoId}).then((rr)=>{
                    // Now also send files ....

                    res.status(200).json(rr)
                })
                .catch((err)=>{res.status(500).json({err:`Error is ${err}`})})

            }
        }
        else{
            res.status(402).json({message:"Only NGO admin can access NGO Details!"})
        }
    })
    .catch((err)=>{res.status(500).json({err:`Error is ${err}`})})
})

app.post('/getCaseInfo', verify_token, (req,res)=>{
    let caseid = req.body.caseid;
    if(caseid){
        mongo_models.CASE.findOne({_id: new ObjectId(req.body.caseid)})
        .then((resp)=>{
            res.status(200).json(resp)
        })
        .catch((err)=>{res.status(400).json({message:"Error : "+err})})
        
    }
    else{
        res.status(400).json({message:"CaseId Not Provided"})
    }
})

app.post('/getVolunteerName', verify_token, (req,res)=>{
    let caseId = req.body.caseid
    if(caseId){
        mongo_models.CASE.findOne({_id : new ObjectId(caseId)})
        .then((resp)=>{
            let volnList = resp.volunteerList
           
            for(let i=0;i<volnList.length;i++){
                volnList[i] = new ObjectId(volnList[i])
            }
            mongo_models.USER.find({
                _id : {$in : volnList}
            }, function(err,docs){
                if(err){
                    res.status(403).json({m : "Error happened "+err})
                }
                else{
                    // res.status(200).json({dd: docs})
                    let names = []
                    docs.forEach(doc => {
                        let nn = doc.fname + " " + doc.lname
                        names.push(nn)
                    });
                    res.status(200).json(names)
                }
            })
            
        })
        .catch((err)=>{res.send(402).json({err : `Error : ${err}`})})
    }
    else{
        res.status(400).json({message:"No CaseId Found!"})
    }
})

app.post('/getAllVolunteers', verify_token, (req,res)=>{
    mongo_models.USER.find({position:"volunteer"}, function(err,doc){
        if(err){
            console.log(err)
            res.status(400).json({err : "Error "+err})
        }
        else{
            console.log(doc)
            res.status(200).json(doc)
        }
    })
})
app.post('/ngo-docs-upload', verify_token, upload.array('ngo_docs', 2), function (req, res, next) {
    // req.file is the `avatar` file
    // req.body will hold the text fields, if there were any
    // console.log(`File name = ${req.files[0].filename}`)
    // console.log(req.files[1].filename)
    // console.log(req.body.name)
    // res.send(200)
    let ff = {

        filename: req.files[0].filename,
        uploaderId : req.userId,
        fileTag : "ngo-logo",
        originalname: req.files[0].originalname,
        encoding : req.files[0].encoding,
        mimetype : req.files[0].mimetype,
        destination : req.files[0].destination,
        path : req.files[0].path,
        size : req.files[0].size,

    }
    let ffs = {

        filename: req.files[1].filename,
        uploaderId : req.userId,
        fileTag : "ngo-doc",
        originalname: req.files[1].originalname,
        encoding : req.files[1].encoding,
        mimetype : req.files[1].mimetype,
        destination : req.files[1].destination,
        path : req.files[1].path,
        size : req.files[1].size,

    }
    const logoDBObj = mongo_models.FILEUPLOAD(ff)
    logoDBObj.save().then((e)=>{
        console.log("Uploaded File 1 LOGO")
    })
    const docDBObj = mongo_models.FILEUPLOAD(ffs)
    docDBObj.save().then((e)=>{
        console.log("Uploaded File 2 DOCS")
    })
    // Now update newfile url to ngo DB
    console.log(`LOGO ID : ${logoDBObj._id}`)
    mongo_models.NGO.findOne({'ngoAdminId':req.userId}).then((stat)=>{
        
        stat['ngoLogoFileId'] = logoDBObj._id
        stat['ngoDocumentsFileId'] = docDBObj._id
        stat['ngoLogoUrl'] = logoDBObj.filename
        stat['ngoDocumentsUrl'] = docDBObj.filename

        stat.save().then(()=>{
            console.log("Fields @ NGO updated with logo and docs")
        })
        .catch((err)=>{
            console.log(err)
        })
    })

    res.status(200).json({msg:"File Uploaded!"})
})
app.post('/profile-pic-upload', verify_token, upload.array('profile_pic', 1), function (req, res, next){
    
    let ffs = {
        filename: req.files[0].filename,
        uploaderId : req.userId,
        fileTag : "propic",
        originalname: req.files[0].originalname,
        encoding : req.files[0].encoding,
        mimetype : req.files[0].mimetype,
        destination : req.files[0].destination,
        path : req.files[0].path,
        size : req.files[0].size,
    }

    const propic = mongo_models.FILEUPLOAD(ffs)
    propic.save().then((e)=>{
        console.log("Profile Picture Uploaded!")
    })
    // Add it to the database
    mongo_models.USER.findOne({_id : new ObjectId(req.userId)})
    .then((ss)=>{
        ss['profilepicurl'] = req.files[0].filename
        ss.save().then(()=>{
            console.log("Profile Picture Url Updated")
            res.status(200).json({msg:"Profile Picture Updated!"})
        })
    })
    .catch((err)=>{
        res.status(400).json({msg:"Failed to Update Picture."})
    })

})

app.post('/upload-case-file',verify_token,upload.single('case_docs'), (req,res)=>{
    // type ->
    // Now add this f._id to gallery entry of that specific case.
    let ffs = {
        filename: req.file.filename,
        uploaderId : req.userId,
        fileTag : 'case-doc',
        originalname: req.file.originalname,
        encoding : req.file.encoding,
        mimetype : req.file.mimetype,
        destination : req.file.destination,
        path : req.file.path,
        size : req.file.size,
    }
    const f = mongo_models.FILEUPLOAD(ffs)
    f.save().then((e)=>{
        console.log(`Case File Uploaded! for case ${req.body.uploadCaseId}`)
        res.status(200).json({msg:"File Uploaded!"})
    })
    // res.status(200).json({req:req.body})
    // mongo_models.USER.findOne({_id : new ObjectId(req.userId)})
    // .then((ss)=>{
    
    // })

})

app.post('/sendMail', (req,res)=>{
    
    // Sending mail Now
    transporter.sendMail(mailData, function (err, info) {
        if(err)
            res.status(400).json({err:err})
        else
            res.status(200).json({info:info})
    });
})
const http = require('http')
const server = http.createServer(app);
server.listen(process.env.port || 8080, ()=>{
    console.log(`App Running @ http://localhost:${port}`)
});

// Here we will write the socket code.
const {Server} = require('socket.io') 
const io = new Server(server);

io.on('connection', (socket) => {
    console.log("A new user connected.");
    socket.broadcast.emit("Welcome to the server.")
    console.log(`Socket ID : ${socket.id}`)
    
    socket.on('disconnect', (socke) =>{
        console.log("user Disconnected.")
        // Flash code below
        io.to('the-real-console').emit('user-disconnected', socket.id)

    })
    
    socket.on('chat-init', (arg,callback)=>{
        socket.join(arg.caseId)   //joining thesocket to it's case room.
        callback(`Joined : ChatRoom - ${arg.caseId}`) //sending back the confirmation
    })
    
    socket.on("chat-message", (arg,callback) =>{
        // Passing on the chat to all the sockets in the group...
        io.to(arg.caseId).emit("chat-message", arg);
        // Adding the chat to the Database
        arg.datetime = Date.now()

        mongo_models.CHATROOM.findOneAndUpdate({caseId : arg.caseId}, {$push : {chats : arg}})
        .catch(err=>console.log(err))
    })


    // Flash Messages / Alerts
    socket.on("to-flash-console", (arg, callback)=>{
        // This event point is for officials & users to send info to the console.
        // Forwarding the message to the console.
        io.to('the-real-console').emit("to-flash-console", arg)
        // Storing it in DB will do later.
    })

    socket.on("init-user", (arg,callback)=>{
        // This event initializes the users to their rooms.
        socket.join("all-users")        //all users
        socket.join(arg.userId)         // for personal data transfers
        // Now send these new user details to the console
        arg.socketId = socket.id
        io.to("the-real-console").emit("new-user", arg)
        console.log("New User came to us")
    })
    socket.on("init-off", (arg,c_)=>{
        socket.join("all-off")
        arg.socketId = socket.id
        socket.join(arg.userId)
        io.to("the-real-console").emit("new-user", arg)
        console.log("OFFFFF")
    })
    socket.on("init-console", (arg,c_)=>{
        console.log("Console Initalized")
        // Now adding it to the the-real-console room 
        socket.join("the-real-console")
    })
    socket.on("to-user", (arg,c_)=>{
        // Send to user of a particular group
        io.to(arg.targetRoom).emit("from-console",arg)
    })

    socket.on("to-off", (arg,c_)=>{
        // Send to user of a particular group
        io.to(arg.targetRoom).emit("from-console",arg)
    })
})

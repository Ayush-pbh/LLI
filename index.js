/*
    Author : Ayush Tripathi (@Ayush-pbh)
    Desc   : Application for Lifline India Ltd.
*/

/*
    Imports 
*/
const express = require('express')
var bodyParser = require('body-parser')

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
const saltRounds = 10
/*
    Import Setup Lines Below!
*/
const port  = 3000  // Port for Application in development
const app = express()  
app.use(express.static('site/'))
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

function addCaseToUserCaseList(userid,caseid) {
    var idd = { _id: new ObjectId(userid) };
    mongo_models.USER.updateOne({_id: idd}, {$push : {caselist : caseid}}).then((resp)=>{
        if(resp){
            console.log("Caselist of the user updated!")
        }
    }).catch(err=>console.log(`Erorr in updating the caselist of the user ${err}`))
}

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
                        ngoid = "000", ngoadminid = "000", volunteerid = "000", caselist = "000", karma = "000", mailVerified = false, phoneVerified = true
                        dac = new Date()
                        let data_to_create_new_user = {}    
                        mailSecret = parseInt(Math.abs(Math.random()*1000000))
                        if(position=='volunteer'){
                            data_to_create_new_user = {fname, lname, age, password:hashedPasscode, mail, mailVerified,phone, phoneVerified,position, dob, ngoid, ngoadminid, volunteerid, caselist,dac, mailSecret, karma, casesVolIn:[] }
                        }
                        else{
                            data_to_create_new_user = {fname, lname, age, password:hashedPasscode, mail, mailVerified,phone, phoneVerified,position, dob, ngoid, ngoadminid, volunteerid, caselist,dac, mailSecret, karma }
                        }
                        const new_user = new mongo_models.USER(data_to_create_new_user)
                        
                        
                        new_user.save().then((ee)=>{
                            res.json({message:"User Created Succesfully! You May Login now!", otp:mailSecret})
                            console.log(`Please go to /confirmMail Route and enter your mail and ${mailSecret}`)
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
    var query = { _id: new ObjectId(req.userId) };
    mongo_models.USER.findOne(query).then((stat)=>{
        if(stat){
            res.status(200).json(stat)
        }
        else{
            res.status(200).json({message:`No user for user id ${req.userId} Found!`})
            
        }
    })
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
    }
    
    // Creating the new case
    const newCase = mongo_models.CASE(full_json)
    newCase.save().then((ee)=>{
        console.log("Case Created Successfully " + newCase._id)
        // Creating a new Gallery and link it to the case
        createNewGalleryForCaseAndUpdateCase(newCase._id)
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
        console.log(caselist)
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

app.listen(process.env.port || 8080, ()=>{
    console.log(`App Running @ http://localhost:${port}`)
});

// app.listen(port, ()=>{
// })





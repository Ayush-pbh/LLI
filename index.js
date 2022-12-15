const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();


router.get('/',function(req,res){
  res.status(200).json({message:"Hello Its Working!"})
});

router.get('/bye',function(req,res){
  res.status(200).json({message:"Don't Say Bye!"})
});

//add the router
app.use('/', router);
app.listen(process.env.port || 7823);

console.log('Running at Port http://localhost:7823');
const express = require('express');
const app = express();
app.use(express.static('site'))
const path = require('path');
const router = express.Router();



router.get('/',function(req,res){
  // res.status(200).json({message:"Hello Its Working!"})
  res.sendFile(path.join(__dirname+'/site/index.html'))
});
router.get('/about',function(req,res){
  res.sendFile(path.join(__dirname+'/site/about.html'))
});

router.get('/bye',function(req,res){
  res.status(200).json({message:"Don't Say Bye!"})
});

//add the router

app.use('/', router);


app.listen(process.env.port || 8080);


console.log('Running at Port 8080');
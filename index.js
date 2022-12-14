const express = require('express');
const app = express();
const path = require('path');
const router = express.Router();
app.use(express.static(__dirname + '/site'));
router.get('/',function(req,res){
res.sendFile(path.join(__dirname+'/site/login.html'));
  //__dirname : It will resolve to your project folder.
});

router.get('/about',function(req,res){
res.sendFile(path.join(__dirname+'/about.html'));
});

router.get('/sitemap',function(req,res){
res.sendFile(path.join(__dirname+'/sitemap.html'));
});

//add the router
app.use('/', router);
app.listen(process.env.port || 3999);

console.log('Running at Port 3000');
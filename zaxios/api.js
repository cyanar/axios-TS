let express = require('express');
let bodyParser = require('body-parser');
let app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.use(function(req,res,next){
  res.set({
    'Access-Control-Allow-Origin': 'http://localhost:3000',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type,name'
  });
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200)
  }
  next();
})
app.get('/get',function(req,res){
  res.json(req.query);
});
app.post('/post',function(req,res){
  res.json(req.body);
})
app.post('/post_status',function(req,res){
  
})
app.listen(8080);
//jshint esversion:6
require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const ejs = require('ejs');
const mongoose = require('mongoose');
const encrypt = require('mongoose-encryption');
const md5 = require('md5');


const app = express();

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended:true}));

mongoose.connect('mongodb://localhost:27017/userDB', {useNewUrlParser:true});

const userSchema = new mongoose.Schema({
  email: String,
  password: String
});




const user = new mongoose.model('user', userSchema);

app.get('/', function(req, res){
  res.render('home');
});

app.get('/login', function(req, res){
  res.render('login');
});

app.get('/register', function(req, res){
  res.render('register');
});

app.post('/register', function(req, res){
  const newUser = new user({
    email:req.body.username,
    password:md5(req.body.password)
  })
  newUser.save(function(err){
    if(err){
      res.send(err)
    }else{
      res.render('secrets')
    }
  });
});

app.post('/login', function(req, res){
  un = req.body.username;
  pwd = req.body.password;

  user.findOne({email:un}, function(err, result){
    if(err){
      console.log(err);
    }else{
      if(result){
        if(md5(pwd) === result.password){
          res.render('secrets');
        }else{
          res.send('wrong password');
        }
      } else{
        res.send("Please double check your email address, that seems not exist.");
      }
    }
  });
});



app.listen(3000, ()=>{
  console.log('app is listening in port 3000!');
})

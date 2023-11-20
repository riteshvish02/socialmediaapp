var express = require('express');
var router = express.Router();
const usermodel = require("./users");
const passport = require('passport');

const localstrategy = require("passport-local")
passport.use(new localstrategy(usermodel.authenticate()))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});



router.post('/register', function(req, res, next) {
var userdets = new usermodel({
 email:req.body.email,
 username:req.body.username,
 picture:req.body.picture,
})

usermodel.register(userdets,req.body.password)
.then(function(userregister){
  passport.authenticate("local")(req,res,function(){
    res.redirect("/profile")
  })
})
});


router.get('/profile',isLoggedIn,async function(req, res, next) {
  const allusers = await usermodel.findOne({username:req.session.passport.user})
  // const all = await usermodel.findOneAndDelete({'_id':"65337896c0c350f18ad974ef"})
  res.render('profile',{allusers});
  // res.send(allusers)
});

router.post('/login',passport.authenticate("local",{
    successRedirect:"/profile"  ,
    failureRedirect:"/"
}),function(req,res,next) {})
 

router.get('/logout',function(req, res, next) {
 req.logout(function(err){
  if (err){
    return next(err);
  }
  res.redirect("/")
 })
});



function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }else{
    res.redirect("/")
  }
}


module.exports = router;

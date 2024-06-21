var express = require('express');
var router = express.Router();
const userModule = require('./users');
const postModule = require('./post');
const post = require('./post');
const passport = require('passport');
const upload = require("./multer");

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModule.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/feed', function(req, res, next) {
  res.render('feed');
});

router.post('/upload', isLoggedIn ,upload.single("file") ,async function(req, res, next) {
  if(!req.file){
    res.status(400).send("no files is there")
  }
  const user = await userModule.findOne({username: req.session.passport.user});
 const postData = await postModule.create({
    image: req.file.filename,
    imageText: req.body.fileCaption,
    user: user._id,
  })
 user.Posts.push(postData._id);
 await user.save();
 res.redirect('/profile');
});

router.get('/login', function(req, res) {
  res.render('loginpage',{error: req.flash('error')});
});

router.get('/profile', isLoggedIn,async function(req, res, next) {
  let user = await userModule.findOne({
    username: req.session.passport.user,
  })
  .populate("Posts");
  res.render("profile",{user});
});

router.post('/register', function(req , res){
  const { username, fullname, email } = req.body;
  const userData = new userModule({ username, fullname, email });

 userModule.register(userData,req.body.password)
 .then(function(){
  passport.authenticate("local")(req , res, function(){
    res.redirect('/profile');
  })
 })
});

router.post('/login',passport.authenticate("local",{
  successRedirect: '/profile',
  failureRedirect: '/login',
  failureFlash: true,
}),function(req , res){});

router.get('/logout',  function (req, res, next)  {
  if (req.session) {
    // delete session object
    req.session.destroy(function (err) {
      if (err) {
        return next(err);
      } else {
        return res.redirect('/');
      }
    });
  }
});

function isLoggedIn(req,res,next){
  if(req.isAuthenticated())
    return next();

  res.redirect("/login");
};

module.exports = router;

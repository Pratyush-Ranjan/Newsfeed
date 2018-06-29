var express = require('express');
var router = express.Router();
var passport =require('passport');
var LocalStrategy =require('passport-local').Strategy
var New= require('../models/new');
var User= require('../models/user');

router.use(passport.initialize());

router.use(passport.session());

router.get('/api/news', function(req, res, next) {
  New.find(function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.post('/api/adduser', function(req, res, next) {
  var usernew= new User({
    uname: req.body.username,
    email: req.body.email,
    password: req.body.password
  });
  User.createuser(usernew,function(err,user){
    if(err) res.send(err);
  });
  console.log('chal');
  res.redirect('http://localhost:3000/#/post');
  console.log('na');
});

passport.serializeUser(function(user,done){
   done(null,user.id); 
});
passport.deserializeUser(function(id,done){
    User.getUserById(id,function(err,user){
        done(err,user);
    });
    
});

passport.use(new LocalStrategy(function(username,password,done){
    console.log("here"+username+password);
    User.findOne({ email: username },function(err,user){
        if(err) console.log(err);
        if(!user){
            console.log('Unknown User');
            return done(null,false,{error_msg:'Unknown User'});
        }
        User.comparePassword(password,user.password,function(err,isMatch){
            console.log(user.password);
            if(err) console.log(err);
            if(isMatch){
              console.log('success' + user);
                return done(null,user);
            }else{
                console.log('invalid Password');
                return done(null,false,{error_msg:'Invalid Password'});
            }
        });
    });
}));

router.post('/api/login', passport.authenticate('local') ,function(req, res,next) {
  console.log('aao raja'+ req.user.email);
  usernew=req.user;
  var usernew= new User({
    uname: req.user.username,
    email: req.user.email,
    password: req.user.password
  });
  console.log(usernew);
  res.send(usernew);
    });

router.get('/api/logout', function(req,res){
    req.logout();
    res.redirect('http://localhost:3000/#/');
});

router.post('/api/addnews', function(req, res, next) {
  New.create({
  	id: req.body.id,
  	title: req.body.title,
  	link: req.body.link,
  	upvotes: 0
  },function(err,docs){
  	if (err)
		res.send(err);
	else
	res.json(docs);
	});
});

router.post('/api/addcomments/:id', function(req, res, next) {
  New.update({
  	id: req.params.id },
  	{ $push: 
  		{comments: { $each: [{ author: req.body.author, body: req.body.bodypart, cmtupvotes: 0}]}
  			}
	},
  	function(err,docs){
  	if (err)
		res.send(err);
	else
	res.json(docs);
	});
});

router.post('/api/cmtup/:id', function(req, res, next) {
 New.updateOne({ 
 	id: req.params.id,
  	"comments.body": req.body.bodypart },
  	{$set: 
  		{"comments.$.cmtupvotes": ++ req.body.cmtupvotes}
  	}
  	,function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.post('/api/newscmt/:id/:up', function(req, res, next) {
  New.updateOne({ 
  	id: req.params.id },{$set: {upvotes: ++ req.params.up}},
  	function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

router.get('/api/news/:id', function(req, res, next) {
  New.findOne({ 
  	id: req.params.id },
  	function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
});

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'Global Baba News' });
});

module.exports = router;

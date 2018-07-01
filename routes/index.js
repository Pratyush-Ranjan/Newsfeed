var express = require('express');
var mongoose = require('mongoose')
var router = express.Router();
var passport =require('passport');
var LocalStrategy =require('passport-local').Strategy
var jwt = require('express-jwt');
var New= require('../models/new');
var User=require('../models/user');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
res.render('index', { title: 'Global Baba News' });
});


router.get('/api/news', function(req, res, next) {
  New.find(function(err,docs){
  	if (err)
		res.send(err);
	else
		res.json(docs);
	});
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
 
router.get('/register/check', function(req, res, next) {
  User.findOne({ username: req.body.rusername }, function (err, user) {
      if (err)
    res.send(err);
  else
    res.json(user);
    });
 });

router.post('/register', function(req, res, next){
  
  var user = new User();
  user.username=req.body.rusername;

  user.setPassword(req.body.rpassword)
  
  user.save(function (err){
    if(err){ return next(err); }
    return res.json({token: user.generateJWT()})
  });
});


passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { err_message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { err_message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));

router.post('/login', function(req, res, next){
console.log('calling passport)');
  passport.authenticate('local', function(err, user, info){
    if(err){ return next(err); }

    if(user){
      return res.json({token: user.generateJWT()});
    } else {
      return res.status(401).json(info);
    }
  })(req, res, next);
});

module.exports = router;

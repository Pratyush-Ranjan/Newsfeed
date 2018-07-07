var express = require('express');
var router = express.Router();
var passport = require('passport');
require('../config/pass')(passport);
var New= require('../models/new');
var User= require('../models/user');

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

router.post('/login', function(req, res, next){
console.log('calling passport)');
  passport.authenticate('local-login', function(err, user){
    if(err){ return next(err); }
req.logIn(user, function(err) {
      if (err) { return next(err); }
      return res.json(user);
       });
  })(req, res, next);
});

    // handle logout
    router.post("/logout", function(req, res) {
      req.logOut();
      res.send(200);
    })

    // loggedin
    router.get("/loggedin", function(req, res) {
      res.send(req.isAuthenticated() ? req.user : '0');
    });

router.post("/register", function(req, res, next) {
          var user = new User();
          user.username = req.body.rusername;
          user.password = user.generateHash(req.body.rpassword);
          user.save(function(err, user) {
            req.logIn(user, function(err) {
              if (err) { return next(err); }
              res.json(user);
            });
          });
  });

module.exports = router;

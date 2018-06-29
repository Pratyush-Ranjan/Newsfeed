var mongoose= require('mongoose');
var bcrypt = require('bcryptjs')
mongoose.connect('mongodb://localhost/globalbaba');
var Schema= mongoose.Schema;
var schema= new Schema ({
	uname: {type: String, required: true},
	email: {type: String, required: true},
	password: {type: String, required: true }
});
module.exports=mongoose.model('users',schema);
module.exports.comparePassword = function(candidatePassword ,hash,callback){
	console.log('raghuvaran here');
    bcrypt.compare(candidatePassword,hash,function(err,isMatch){
       if(err) return callback(err);
        callback(null,isMatch);
    });
}

module.exports.getUserByusername= function(username,callback){
	console.log('gethere');
    var query ={email :username};
    User.findOne(query,callback);
}

module.exports.getUserById= function(id,callback){
    User.findById(id,callback);
}
module.exports.createuser = function(newUser,callback){
	bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
        newUser.password = hash;
        newUser.save(callback);
    });
});
   
}
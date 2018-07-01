var mongoose= require('mongoose');
var Schema= mongoose.Schema;
var schema= new Schema ({
	id: { type: Number},
	title: {type: String, required: true},
	link: {type: String },
	upvotes: {type: Number, default: 0},
	comments: { type: [{
		author: { type: String, default: "user" },
		body: {type: String, required: true},
		cmtupvotes: {type: Number, default:0}
	}]}
});
module.exports=mongoose.model('news',schema);
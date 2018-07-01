var New= require('../models/new');
var mongoose= require('mongoose');
mongoose.connect('mongodb://localhost/globalbaba');
var news= [new New({
	id: 1,
	title : 'Google',
		link : 'https://www.google.co.in',
		upvotes : 2,
		comments: [
    {author: 'Joe', body: 'Cool post!', cmtupvotes: 0},
    {author: 'Bob', body: 'Great idea but everything is wrong!', cmtupvotes: 0}
    ]
}),
new New({
	id: 2,
	title : 'CBSE class 10th result declared',
		link : 'https://www.cbse.nic.in',
		upvotes: 11,
		comments: [
    {author: 'mangu', body: 'ab maut ka nanga naach hoga ', cmtupvotes: 12},
    {author: 'changu', body: 'science mat lena 10th pass walon', cmtupvotes: 21}
  ]
}),
new New({
	id: 3,
		title : 'Raid movie launch',
		link : '',
		upvotes : 1,
		comments: [
    {author: 'vimlesh', body: 'Awesome movie!', cmtupvotes: 2},
    {author: 'kamlesh', body: 'Based on true story', cmtupvotes: 4}
  ]
}),
new New({
	id: 4,
title : 'Youtube',
		link : 'https://www.youtube.com',
		upvotes : 3,
		comments: [
    {author: 'Joe', body: 'Cool post!', cmtupvotes: 0},
    {author: 'Bob', body: 'Great idea but everything is wrong!', cmtupvotes: 0}
    ]
}),
new New({
	id: 5,
    title : 'CSK lift ipl 2018 trophy',
		link : 'https://www.indiatoday.in/sports/story/chennai-super-kings-csk-are-the-winners-of-ipl-2018-1243284-2018-05-27',
		upvotes : 16,
		comments: [
    {author: 'Joe', body: 'Yipee!', cmtupvotes: 0},
    {author: 'Bob', body: 'Finally M.S.D proves his worth', cmtupvotes: 2}
  ]
})];
var done=0;
for(var i=0;i<news.length;i++)
{
	news[i].save(function(err,result){
		done++;
		if(done=== news.length)
			exit();
	});
}
function exit(){
	mongoose.disconnect();
}
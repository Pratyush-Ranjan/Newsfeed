var app=angular.module('news',['ngRoute']);
app.config(function($routeProvider){
$routeProvider
	.when("/",{
		templateUrl:"./views/user.ejs",
		controller: "newscontrol"
	})
	.when("/post",{
		templateUrl:"./views/post.ejs",
		controller: "newscontrol"
	})
	.when("/comment/:id",{
		templateUrl: "./views/comment.ejs",
		controller: "newscontrol"
	})
	.otherwise({
		redirectTo: "/"
	})
});
app.controller('newscontrol',['$scope','$routeParams','$http','$location',function($scope,$routeParams,$http,$location){
$scope.posts=[];
$scope.userData=['hmm'];
$scope.users=[];
$scope.er='';
$scope.n=0;
$scope.sign=function(){
	if($scope.n==0)
		return false;
	else 
		return true;
}

$scope.singup=function(){
if($scope.userspass===$scope.usersrpass)
{
	if($scope.userspass.length > 6)
	{
	$scope.er='';
	 $scope.userdata=({
	 	username: $scope.usersname,
    email: $scope.usersemail,
    password: $scope.userspass
  });
	 $scope.n=1;
$http.post('/api/adduser', $scope.userdata)
		.success(function(){
			$location.path('/post');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	}
	else
	{
$scope.er='Password is weak';
return ;
	}
}
else
{
	$scope.er='Password is not same';
return ;
}
};
$scope.signin = function(){
	$http({
        method:"post",
        url:'/api/login',
        data:{username:$scope.useremail,password:$scope.password},
    }).success(function(database) {
    	angular.copy(database,$scope.userData);
    	$scope.n=1;
    	$location.path('/post');
      })
      .error(function(data) {
			console.log('Error: ' + data);
		});
	};
$scope.logout= function(){
	$scope.n=0;
	$http.get('/api/logout')
		.success(function(){
			$location.path('/');
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	};
/* getting all data from mongo database*/
$http.get('/api/news')
		.success(function(data) {
			$scope.posts=data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
	
if($routeParams.id)
	{
		$scope.rp=$routeParams.id;
		/* getting comments of specific that comment */
		 $http.get('/api/news/'+ $scope.rp)
		.success(function(data) {
			$scope.post= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		/* increment of upvote of comment */
		$scope.incrementcmtupvotes = function(comment)
		 {
			$scope.cmt=({
   		 bodypart: comment.body,
   		 author: comment.author,
   		 cmtupvotes: comment.cmtupvotes
 		 });
			$http.post('/api/cmtup/'+$scope.rp, $scope.cmt)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get('/api/news/'+ $scope.rp)
		.success(function(data) {
			$scope.post = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		};
		/* adding new comment to any news */
	$scope.addComment = function(){
 		 if($scope.body === '') { return; }
 		 $scope.cnt=({
   		 bodypart: $scope.body,
   		 author: 'user',
   		 upvotes: 0
 		 });
 		 $http.post('/api/addcomments/'+$scope.rp,$scope.cnt)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get('/api/news/'+$scope.rp)
		.success(function(data) {
			$scope.post = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		 $scope.body = '';
	};
}
/* function to add news */	
	$scope.addpost = function(){
  if(!$scope.title || $scope.title === '') { return; }
  var maxid = _.max($scope.posts, function(entry)
                { return entry.id;})
             var nid = maxid.id + 1;
  $scope.postsy=({
  	id: nid,
    title: $scope.title,
    link: $scope.link,
    upvotes: 0
  });
  var data= $scope.postsy;
  $http.post('/api/addnews',$scope.postsy)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
		$http.get('/api/news')
		.success(function(data) {
			$scope.posts = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
  $scope.title = '';
  $scope.link = '';
};
/* function to increase upvote of news */
$scope.incrementupvotes = function(ind,nm) {
  $http.post('/api/newscmt/'+ind+'/'+nm)
		.success(function(data) {
			$scope.posty= data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
$http.get('/api/news')
		.success(function(data) {
			$scope.posts = data;
		})
		.error(function(data) {
			console.log('Error: ' + data);
		});
			
};

}]);
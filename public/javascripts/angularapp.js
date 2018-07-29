var app=angular.module('news',['ngRoute']);
app.config(function($routeProvider){
$routeProvider
	.when("/",{
		templateUrl:"./views/user.ejs",
		controller: "newscontrol",
		resolve : ['auth',
		function(auth) {
			auth.isloggedin();
		}]
	})
	.when("/post",{
		templateUrl:"./views/post.ejs",
		controller: "newscontrol"
	})
	.when("/comment/:id",{
		templateUrl: "./views/comment.ejs",
		controller: "newscontrol",
		resolve : ['auth',
		function(auth) {
			auth.checklogin();
		}]
	})
	.otherwise({
		redirectTo: "/"
	})
});
app.factory('auth', ['$http','$location', '$rootScope',
function($http, $location, $rootScope) {
	var auth = {};
auth.checklogin = function() {
	$http.get('/loggedin')
	.success(function(response)
 	{ 
 	if (response === '0') 
 	   { $location.path("/"); 
 		} 
 	else
 	{
 		$rootScope.currentUser = response;
 	}
 		});
 }; 
 auth.isloggedin = function() {
	$http.get('/loggedin')
	.success(function(response)
 	{ 
 	if (response !== '0') 
 	   {  $rootScope.currentUser = response;
 	   	  $location.path("/post"); 
 		} 
 		});
 }; 
	return auth;
}]);
app.controller('newscontrol',['$scope','$routeParams','$http','$location','$rootScope',function($scope,$routeParams,$http,$location,$rootScope){
$scope.posts=[];
$scope.user={};
$scope.er='';
$scope.register = function() {
		if($scope.user.rpassword===$scope.user.rrpassword)
		{
			if($scope.user.rpassword.length > 6)
			{
				$scope.er='';
				$http.post('/register', $scope.user)
				.error(function(error) {
				$scope.er = 'username already taken';
				})
        		.success(function(response) {
          		$rootScope.currentUser = response;
          		$location.path("/post");
       			 });
			} 
			else
				$scope.er='Password is weak';
		}
		else
			$scope.er='Password is not same';
	};
$scope.logIn = function() {
    $http.post('/login', $scope.user)
    .error(function(error) {
			$scope.errorlogin='Invalid credentials';
		})
      .success(function(response) {
        $rootScope.currentUser = response;
        $location.path("/post");
      });
  };
	$scope.logout = function() {
    $http.post("/logout")
      .success(function() {
        $rootScope.currentUser = null;
        $location.path("/");
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
   		 author: $rootScope.currentUser.username,
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

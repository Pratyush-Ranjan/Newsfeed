var app=angular.module('news',['ngRoute']);

app.config(function($routeProvider){
$routeProvider
	.when("/",{
		templateUrl:"./views/user.ejs",
		controller: "newscontrol",
		resolve : ['$location', 'auth',
		function($location, auth) {
			if (auth.isLoggedIn()) {
				$location.path('/post');
			}
		}]
	})
	.when("/post",{
		templateUrl:"./views/post.ejs",
		controller: "newscontrol",
		resolve : ['$location', 'auth',
		function($location, auth) {
			if (!auth.isLoggedIn()) {
				$location.path('/');
			}
		}]
	})
	.when("/comment/:id",{
		templateUrl: "./views/comment.ejs",
		controller: "newscontrol",
		resolve : ['$location', 'auth',
		function($location, auth) {
			if (!auth.isLoggedIn()) {
				$location.path('/');
			}
		}]
	})
	.otherwise({
		redirectTo: "/"
	})
});


app.factory('auth', ['$http', '$window','$location',
function($http, $window, $location) {
	var auth = {};

	auth.saveToken = function(token) {
		$window.localStorage['globalbaba-news-token'] = token;
	};

	auth.getToken = function() {
		return $window.localStorage['globalbaba-news-token'];
	}

	auth.isLoggedIn = function() {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function() {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.username;
		}
	};

	auth.register = function(user) {
		return $http.post('/register', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function(user) {
		return $http.post('/login', user).success(function(data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function() {
		$window.localStorage.removeItem('globalbaba-news-token');
		$location.path('/');
	};

	return auth;
}]);
app.controller('newscontrol',['$scope','$routeParams','$http','$location','auth',function($scope,$routeParams,$http,$location,auth){
$scope.posts=[];
$scope.er='';

$scope.user = {};
$scope.isLoggedIn = auth.isLoggedIn;
$scope.currentUser = auth.currentUser;

	$scope.register = function() {
		$scope.n=0;
		if($scope.user.rpassword===$scope.user.rrpassword)
		{
			if($scope.user.rpassword.length > 6)
			{
				$http.get('/register/check',$scope.user)
		.success(function(data) {
			$scope.er='Username already taken';
			$scope.n=1;
		});
		if($scope.n!=1)
			$scope.er='';
				auth.register($scope.user).error(function(error) {
				$scope.err = error;
				}).then(function() {
				$location.path('/post');
				});
				
			} 
			else
				$scope.er='Password is weak';
		}
		else
			$scope.er='Password is not same';
	};

	$scope.logIn = function() {
		auth.logIn($scope.user).error(function(error) {
			$scope.error = error;
		}).then(function() {
			$location.path('/post');
		});
	};

$scope.logOut= auth.logOut;

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
   		 author: auth.currentUser(),
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
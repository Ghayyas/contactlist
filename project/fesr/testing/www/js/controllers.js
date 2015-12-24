 angular.module('login.controllers', [])

.controller('LoginCtrl', function($scope, $rootScope, $state, $cordovaOauth, FirebaseConfig) {

	$scope.login = {};
	$scope.userLogin = function (email, password) {

		var ref = new Firebase(FirebaseConfig.root_url);
		ref.authWithPassword({
		  email    : email,
		  password : password
		}, function(error, authData) {
		  if (error) {
		  	if(error.code == "INVALID_PASSWORD")
		  	{
		  		$rootScope.login_message = 'invalid_password';
		  		$rootScope.$apply();
		  	}
		  	else if(error.code == "INVALID_USER")
		  	{
		  		$rootScope.login_message = 'invalid_user';
		  		$rootScope.$apply();
		  	}
		    console.log("Login Failed!", error);
		  } else {
		    $rootScope.authData = authData;
		    onAuthUser();
		    $state.go('tab.account');
		  }
		});
	};

	$scope.userRegister = function () {

		//simple redirect
		$state.go('register');
	}

	var onAuthUser = function () {

		// we would probably save a profile when we register new users on our site
		// we could also read the profile to see if it's null
		// here we will just simulate this with an isNewUser boolean
		var isNewUser = true;

		var ref = new Firebase(FirebaseConfig.root_url);
		ref.onAuth(function(authData) {
		  if (authData && isNewUser) {
		    // save the user's profile into Firebase so we can list users,
		    // use them in Security and Firebase Rules, and show profiles
		    ref.child("users").child(authData.uid).set({
		      provider: authData.provider,
		      name: getName(authData)
		    });
		  }
		});
		// find a suitable name based on the meta info given by each provider
		function getName(authData) {
		  switch(authData.provider) {
		     case 'password':
		       return authData.password.email.replace(/@.*/, '');
		     case 'twitter':
		       return  authData.twitter.displayName;
		     case 'facebook':
		       return authData.facebook.displayName;
		     case 'google':
		       return authData.google.displayName;
		  }
		}
	}

	$scope.googleLogin = function() {
        var ref = new Firebase(FirebaseConfig.root_url);
		ref.authWithOAuthPopup("google", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    $rootScope.authData = authData;
		    onAuthUser();
		    $state.go('tab.account');
		  }
		});
	}

	$scope.twitterLogin = function() {
        var ref = new Firebase(FirebaseConfig.root_url);
		ref.authWithOAuthPopup("twitter", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    $rootScope.authData = authData;
		    onAuthUser();
		    $state.go('tab.account');
		  }
		});
	}

	$scope.fbLogin = function ()
	{
		var ref = new Firebase(FirebaseConfig.root_url);
		ref.authWithOAuthPopup("facebook", function(error, authData) {
		  if (error) {
		    console.log("Login Failed!", error);
		  } else {
		    $rootScope.authData = authData;
		    onAuthUser();
		    $state.go('tab.account');
		  }
		});
	}

	$scope.fbAppLogin = function ()
	{
		var fbAppGetFriends = function (friendsData)
		{
			$rootScope.friendsData = friendsData;
			onAuthUser();
			$state.go('tab.account');

		}

		var fbAppLoginSuccess = function (userData) {

			var ref = new Firebase(FirebaseConfig.root_url);

			ref.authWithOAuthToken("facebook", userData.authResponse.accessToken, function(error, authData) {
			if (error) {
			  console.log("Login Failed!", error);
			} else {
			  $rootScope.authData = authData;
			  $rootScope.fbData = userData;
			  facebookConnectPlugin.api("/me/friends?fields=id,name,picture",["user_friends"],
			  	fbAppGetFriends,
			    function (error) { alert("" + error) }
			    );

			}
		});

	}

	facebookConnectPlugin.login(["public_profile", "email", "user_friends"],
	    fbAppLoginSuccess,
	    function (error) { alert("" + error) }
		);
	}
})

.controller('AccountCtrl', function($scope, $rootScope, $state, $firebaseObject, $cordovaStatusbar, FirebaseConfig) {

  $scope.unAuth = function ()
  {
  	var ref = new Firebase(FirebaseConfig.root_url);
  	ref.unauth();
  	$scope.privateData = null;
  	$rootScope.authData = null;
  	$state.go('login');
  }

  $scope.inviteFbFriend = function () {
  	facebookConnectPlugin.showDialog( { method: "send", name: "name", picture: "http://i.imgur.com/g3Qc1HN.png", link: "http://www.vice.com", caption: "caption of choice", description: "description of choice" },
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
  }

  $scope.postFbStatus = function () {
  	facebookConnectPlugin.showDialog( { method: "feed", name: "name", picture: "http://i.imgur.com/g3Qc1HN.png", link: "http://www.vice.com", caption: "caption of choice", description: "description of choice" },
        function (response) { alert(JSON.stringify(response)) },
        function (response) { alert(JSON.stringify(response)) });
  }


  	var ref = new Firebase(FirebaseConfig.welcome_message);
  	// download the data into a local object
    var syncObject = $firebaseObject(ref);
    // synchronize the object with a three-way data binding
    // click on `index.html` above to see it used in the DOM!
    syncObject.$bindTo($scope, "privateData");


})

.controller('DashCtrl', function($scope, $state) {




})

.controller('RegisterCtrl', function($scope, $state, FirebaseConfig) {

	$scope.register = {};

    $scope.register = function (email, password) {

    	var ref = new Firebase(FirebaseConfig.root_url);
		   ref.createUser({
		  email    : email,
		  password : password
		}, function(error, userData) {
		  if (error) {
		    console.log("Error creating user:", error);
		  } else {
		    console.log("Successfully created user account with uid:", userData.uid);
		  }
		});
    };

    $scope.returnToLogin = function () {

    	$state.go('login');
    }


})

.controller('homeCtrl',function($scope, $rootScope, $firebaseArray, FirebaseConfig){
  var post = new Firebase(FirebaseConfig.root_url).child('post');

     $rootScope.abc = "";
     var npost = new Firebase('https://flickering-torch-4034.firebaseio.com/post/' + $rootScope.abc);

  post.once("value", function(allMessagesSnapshot) {
       allMessagesSnapshot.forEach(function(messageSnapshot) {
         // Will be called with a messageSnapshot for each child under the /messages/ node
        window.key = messageSnapshot.key();  // e.g. "-JqpIO567aKezufthrn8"
         console.log(key);
       })
     });
     $rootScope.mainkey = "";
    // $scope.rev = reply.getAll();
     $scope.rev = $firebaseArray(post);
     var user = post.getAuth();


     $scope.work= "";
     $scope.status = {};
     var ab = $rootScope.abc;

     $scope.myFunc = function(index){
       $rootScope.abc = $scope.rev[index].keygen;
       $rootScope.mainkey= index;
       $scope.active = $firebaseArray(npost); //reply button option

     };
     $rootScope.xyz = false;
     $scope.pro = function () {
       $rootScope.xyz = true;
     };
     $scope.reply = {};//reply button option
     $scope.send = function () {//reply button option



      npost.push({              //reply button option
       // name: $scope.name,
         //img: $scope.image,
         raza: $scope.reply.aaa
       });
       $scope.reply.aaa = "";
     };
     $scope.defaultImage = 'https://thebenclark.files.wordpress.com/2014/03/facebook-default-no-profile-pic.jpg'; //this is the default picture of timeline/

     $scope.post = function(){
       if(user.provider == 'google'){
         //$scope.name = user.google.cachedUserProfile.name;
         $scope.image = user.google.cachedUserProfile.picture;
         $scope.name = user.google.cachedUserProfile.name;
       }
       if(user.provider == 'twitter'){
         $scope.image = user.twitter.cachedUserProfile.picture;
         $scope.name = user.twitter.cachedUserProfile.name;
       }
       if(user.provider == 'facebook'){
         $scope.image = user.facebook.cachedUserProfile.picture;
         $scope.name = user.facebook.cachedUserProfile.name;
       }
       if(user.provider == 'password'){
         $scope.name = "Anomouys";
         $scope.image = $scope.defaultImage;
       }
   $scope.rev.$add({
       ID :  user.uid,
       keygen: key,
       name: $scope.name,
       image: $scope.image,
       title: $scope.status.title,
       status: $scope.status.Box,
       timestamp: Firebase.ServerValue.TIMESTAMP
     });
       $scope.status.title = "";
       $scope.status.Box = "";
     }
});



app.factory('FirebaseConfig', function() {
	var root_url = 'https://crackling-heat-8067.firebaseio.com/';
  //https://crackling-heat-8067.firebaseio.com/
	  return {
	  		'root_url': root_url,
	  		'welcome_message': root_url+'/welcome_message'
	  	};
});

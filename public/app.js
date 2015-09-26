/**
 * Created by Ghayyas on 9/5/2015.
 */
     var app = angular.module('app',[]);
    app.controller('myCtrl',function ($scope, $http) {
   var ref = function () {
       $http.get('/contactlist').success(function (response) {
           console.log('i got request ');
           $scope.contactlist = response;
           $scope.contact = '';
       });
   };
       ref();
 $scope.addContact = function () {
     console.log($scope.contact);
     //$http.post('/contactlist', $scope.contact)
     $http.post('/contactlist',$scope.contact).success(function (response) {
         console.log(response);
   ref();
     });

 };
        $scope.remove = function(id) {
            console.log(id);
            $http.delete('/contactlist/'+id).success(function (response) {
                ref();
            })
        }
        $scope.edit = function(id) {
            console.log(id);
            $http.get('/contactlist/' + id).success(function(response) {
                $scope.contact = response;
            });
        };

        $scope.update = function() {
            console.log($scope.contact._id);
            $http.put('/contactlist/' + $scope.contact._id, $scope.contact).success(function(response) {
                ref();
            })
        };

        $scope.deselect = function() {
            $scope.contact = "";
        }
    });
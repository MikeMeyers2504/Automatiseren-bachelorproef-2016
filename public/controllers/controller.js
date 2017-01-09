var myApp = angular.module('myApp');
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");

  var refresh = function() {
    $http.get('/studenteninfo').success(function(response) {
      console.log("I got the data I requested");
      console.log(response);
      // $scope.studenteninfo = response;
      console.log(response);
      console.log(response[0].name);
      
      for (var i = 0; i <= response.length; i++) {
        if (response[i].name) {
          $scope.studenteninfo = response;
          console.log($scope.studenteninfo);
        }
      }

      // console.log(response);
      $scope.student = "";
    });
  };

  refresh();

  $scope.addData = function() {
    console.log($scope.student);
    $http.post('/studenteninfo', $scope.student).success(function(response) {
      console.log(response);
      refresh();
    });
  };

  $scope.remove = function(id) {
    console.log(id);
    $http.delete('/studenteninfo/' + id).success(function(response) {
      refresh();
    });
  };

  $scope.edit = function(id) {
    console.log(id);
    $http.get('/studenteninfo/' + id).success(function(response) {
      $scope.student = response;
    });
  };  

  $scope.update = function() {
    console.log($scope.student._id);
    $http.put('/studenteninfo/' + $scope.student._id, $scope.student).success(function(response) {
      refresh();
    })
  };

  $scope.deselect = function() {
    $scope.student = "";
  };

  $scope.Auth = function(){
      $http.get('/tokens').success(function(response) {
      console.log("I need an AuthToken ... Lets go get it");
      console.log(response);
      $scope.tokens = response;
      $scope.token = "";
    });
  };
}]);﻿

// name in alle functies zette >>>> check hoe hy da doe me zn id
// Remove en update sture de naam door ma verwachte de id dus flashe
// Add Data werkt gwn zoals ervoor ..... 
// die verwacht nix dus kan da die ook de naam doorsture ma da da ni boeit vr hem
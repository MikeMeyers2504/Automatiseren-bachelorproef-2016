var myApp = angular.module('myApp');
myApp.controller('AppCtrl', ['$scope', '$http', function($scope, $http) {
    console.log("Hello World from controller");


var refresh = function() {
  $http.get('/studenteninfo').success(function(response) {
    console.log("I got the data I requested");
    $scope.studenteninfo = response;
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
}

}]);﻿
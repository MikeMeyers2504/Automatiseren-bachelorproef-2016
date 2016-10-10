var app = angular.module('app', []);

app.controller('MainCtrl', function($http) {
    var vm = this;
    
    vm.fetchData = function(user){
        vm.loading = true;
        $http.get('https://api.github.com/users/' + user.name).then(function(res){
                console.log(res);
                vm.data = res;
                vm.loading = false;
        })
    }     
})
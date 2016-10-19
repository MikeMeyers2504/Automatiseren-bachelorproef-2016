var app = angular.module('app', []);

function Login(args) {
    this.login = args.login;
}

app.controller('MainCtrl', function($scope, $http) {
    var vm = this;
    console.log("Hello");
    
    vm.fetchData = function(user){
        vm.loading = true;
        $http.get('https://api.github.com/users/' + user.name).then(function(res){
                console.log(res);
                vm.name = res.data.name || "Not found";
                vm.login = res.data.login || "Not found";
                //vm.data = res;
                vm.loading = false;
        })
    }

    /*vm.ShowData = function(users){
        vm.loading = true;
        var i;
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members?access_token=03d9996fa8c3a2e4b23efaa89901beeaf2dfd912').then(function(res){
                var student = [];
                for (i = 0; i < res.data.length; i++) {
                	/*student.push({
                		login: res.data[i]
                	});*/
    				/*console.log([res.data[i]]);
    				//console.log(login);
    				vm.login = res.data[i].login || "Not found";
    				vm.loading = false;
				}
				return login;
        })
    }*/

    vm.ShowData = function(usersNames){
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members?access_token=03d9996fa8c3a2e4b23efaa89901beeaf2dfd912').then(function(res){
                var studentNames = [];
                for (i = 0; i < res.data.length; i++) {
                    studentNames.push({
                        login: res.data[i]
                    });
                    console.log([res.data[i]]);
                    vm.login = res.data[i].login || "Not found";
                }
                return login;
        })
    }
});

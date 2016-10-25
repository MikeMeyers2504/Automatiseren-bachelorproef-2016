var app = angular.module('myApp');

app.controller('MainCtrl', function($scope, $http) {
    var vm = this;
    
    vm.fetchData = function(user){
        vm.loading = true;
        $http.get('https://api.github.com/users/' + user.name).then(function(res){
                console.log(res);
                vm.username = res.data.name || "Not found";
                vm.login = res.data.login || "Not found";
                vm.loading = false;
        })
    }

    vm.ShowData = function(){
        var i;
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members?access_token=74d60864cddbcbaccee4243da98771213cf29b36&page=1&per_page=100&role=member').then(function(res){ 
                vm.studentNames = [];
                for (i = 0; i < res.data.length; i++) {
                    vm.studentNames.push(
                        res.data[i].login
                    );
                    vm.login = vm.studentNames || "Not found";
                }
                console.log(vm.studentNames);
        })
    }

    vm.ShowData();

    vm.GetRepos = function(userLogin){
        var found = false;
        vm.loading = true;
        $http.get('https://api.github.com/users/' + userLogin + '/repos').then(function(res){
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("2EALOVESDOGGEN")!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1
                        console.log(res.data[i].name);
                        console.log(res.data[i].id);
                        console.log(res.data[i].open_issues);
                        console.log(res.data[i].owner.login);
                        vm.sha = null;
                        vm.message = null;
                        vm.name = res.data[i].name;
                        vm.id = res.data[i].id;
                        vm.open_issues = res.data[i].open_issues;
                        vm.owner = res.data[i].owner.login;
                        found = true;
                    } 
                }
                if (found == false) {
                    vm.name = null;
                    vm.id = null;
                    vm.open_issues = null;
                    vm.owner = null;
                    vm.sha = null;
                    vm.message = null;
                    alert('No BAP repo found');
                    console.log(found);
                }
                vm.loading = false;
        })
    }

    vm.GetCommits = function(userLogin, repoName){
        var found = false;
        vm.loading = true;
        $http.get('https://api.github.com/repos/' + userLogin + "/" + repoName + '/commits').then(function(res){
                vm.commits = [];
                vm.messageNames = [];
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    vm.commits.push(
                        res.data[i].sha
                    );
                    vm.sha = vm.commits || "Not found";

                    vm.messageNames.push(
                        res.data[i].commit.message
                    );
                    vm.message = vm.messageNames || "Not found";
                    found = true;
                }
                vm.loading = false;
                console.log(vm.sha);
                console.log(vm.message);
        })
    }
});

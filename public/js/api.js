var app = angular.module('myApp');
var AuthToken = 
var AccessToken = 
var Login = "https://github.com/login/oauth/authorize"
var logged;

app.controller('MainCtrl', function($scope, $http) {
    var vm = this;
    
    vm.Login = function(){
        window.location.replace(Login + AuthToken);
        logged = true;
    }

    // if (logged != true) {
    //    vm.Login();
    // }

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
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members' + AccessToken + '&page=1&per_page=100&role=member').then(function(res){ 
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
        $http.get('https://api.github.com/users/' + userLogin + '/repos' + AuthToken).then(function(res){
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
        $http.get('https://api.github.com/repos/' + userLogin + "/" + repoName + '/commits' + AuthToken).then(function(res){
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
    
    vm.PostIssues = function(userLogin) {
        var IssueTitle;
        var IssueText;
        var config;
        IssueTitle = document.getElementById("issuetitle").value;
        IssueText = document.getElementById("issues").value;
        config = { headers: { 'Content-Type': 'application/json'}}

        if (IssueText != '' && IssueTitle != '') {
            $http.post('https://api.github.com/repos/'+ userLogin + '/Automatiseren-bachelorproef-2016/issues' + AuthToken, {'body': IssueText, 'title': IssueTitle}, config).then(function(res){
            console.log(res);
            document.getElementById("issues").value = "";
            document.getElementById("issuetitle").value = "";
            });
        }
    }

    vm.GetIssues = function(userLogin){
        var found = false;
        vm.loading = true;
        $http.get('https://api.github.com/repos/'+ userLogin + '/Automatiseren-bachelorproef-2016/issues' + AuthToken + '&state=open').then(function(res){
                vm.states = [];
                vm.numbers = [];
                vm.titles = [];
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    console.log(res.data[i].number);
                    console.log(res.data[i].title);

                    vm.titles.push(res.data[i].title); 
                    vm.title = vm.titles || 'NOT';

                    vm.numbers.push(res.data[i].number); 
                    vm.number = vm.numbers || 'NOT';
                }
        })
    }

    vm.thisIssue = function(number) {
    console.log(number);
    vm.following_url = number;
    }

    vm.CloseIssue = function(number, userLogin, repoName) {
       var config;
       var issueState = 'closed';
       config = { headers: { 'Content-Type': 'application/json'}}
       console.log(number);

        $http.post('https://api.github.com/repos/' + userLogin + '/Automatiseren-bachelorproef-2016/issues/' + number + AccessToken, {"state":issueState}, config).then(function(res){
        });
   }

});
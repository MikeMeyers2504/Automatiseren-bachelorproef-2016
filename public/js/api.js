var app = angular.module('myApp');
var AuthToken = 
var AccessToken = 
var Login = "https://github.com/login/oauth/authorize"
var logged;

function myFunction() {
    document.getElementById("hide1").style.visibility = 'visible';
    document.getElementById("hide2").style.visibility = 'visible';
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
        placement : 'top'
    });
});

var accessToken = "?access_token=...";

app.controller('MainCtrl', function($scope, $http, $sce) {
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
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members' + accessToken + '&page=1&per_page=100&role=member').then(function(res){ 

                vm.studentNames = [];
                vm.LoginNames = [];
                for (i = 0; i < res.data.length; i++) {
                    vm.studentNames.push(
                        {loginName: res.data[i].login, avatar: res.data[i].avatar_url}
                    );
                    vm.LoginNames.push(
                        res.data[i].login
                    );
                    vm.login = vm.studentNames || "Not found";
                    vm.LoginNames || "Not found";
                    vm.GetDates(res.data[i].login);
                }
                console.log(vm.studentNames);
                console.log(vm.LoginNames);
        })
    }

    vm.ShowData();

    vm.GetDates = function(userLogin){
        $http.get('https://api.github.com/repos/' + userLogin + '/2EALOVESDOGGEN/commits' + accessToken).then(function(res){
                console.log(res);
                vm.dates = [];
                for (var i =  0; i < res.data.length; i++) {
                    vm.dates.push(
                        res.data[i].commit.author.date
                    );
                    vm.date = vm.dates[0] || "Not found";
                }
                console.log(vm.dates);
                console.log(vm.date);
                var newdate = vm.date.slice(0,10);
                console.log(newdate);

                var q = new Date();
                var m = q.getMonth();
                var d = q.getDate();
                var y = q.getFullYear();

                var date = new Date(y,m,d);

                mydate = new Date(newdate);
                console.log(date);
                console.log(mydate)
                var c = parseInt((date - mydate) / (1000*60*60*24) + 1);

                var color;

                if (c < 7) {
                    var index = vm.LoginNames.indexOf(userLogin);
                    $('.jumbotron').find('.glyphicon').eq(index).css("color", "lightgreen");
                }
                else if (c < 14) {
                    var index = vm.LoginNames.indexOf(userLogin);
                    $('.jumbotron').find('.glyphicon').eq(index).css("color", "orange");
                }
                else {
                    var index = vm.LoginNames.indexOf(userLogin);
                    $('.jumbotron').find('.glyphicon').eq(index).css("color", "red");
                }
            })
        }

    /*vm.ShowActivity = function(){
        var i;
        $http.get('https://api.github.com/orgs/AP-Elektronica-ICT/members' + accessToken + '&page=1&per_page=100&role=member').then(function(res){ 
                vm.students = [];
                for (i = 0; i < res.data.length; i++) {
                    vm.students.push(
                        res.data[i].login
                    );
                    vm.GetDates(res.data[i].login);
                }
        })
    }

    vm.ShowActivity();*/

    vm.GetRepos = function(userLogin){
        var found = false;
        vm.loading = true;
        $http.get('https://api.github.com/users/' + userLogin + '/repos'+ accessToken).then(function(res){

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
                    vm.CONTENT = null;
                    document.getElementById("hide1").style.visibility = 'hidden';
                    document.getElementById("hide2").style.visibility = 'hidden';
                    alert('No BAP repo found');
                    console.log(found);
                }
                vm.loading = false;
        })
    }

    vm.GetCommits = function(userLogin, repoName){
        var found = false;
        vm.loading = true;

      $http.get('https://api.github.com/repos/' + userLogin + "/" + repoName + '/commits' + accessToken).then(function(res){

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

    vm.GoToTextarea = function(sha) {
        document.getElementById("comments").focus(); 
        console.log(sha);
        vm.starred_url = sha;
    }

    vm.PostComments = function(sha, userLogin, repoName) {
        var CommentInfo;
        var config;
        CommentInfo = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        console.log(sha);
        if (CommentInfo != '') {
            $http.post('https://api.github.com/repos/' + userLogin + "/" + repoName + '/commits/' + sha + '/comments' + accessToken, {'body': CommentInfo}, config).then(function(res){
            console.log(res);
            document.getElementById("comments").value = "";
              });
        }
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

    vm.GetScription = function(userLogin, repoName) {
        var found = false;
        var ChangeHeaders;
        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}}
        $http.get('https://api.github.com/repos/' + userLogin + '/' + repoName + '/contents' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("Projectplan")!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1
                        console.log(res.data[i].name);
                        console.log(res.data[i].path);
                        console.log(res.data[i].sha);
                        console.log(res.data[i].size);
                        vm.NAME = res.data[i].name;
                        vm.PATH = res.data[i].path;
                        vm.SHA = res.data[i].sha;
                        vm.SIZE = res.data[i].size;
                        found = true;
                        console.log(vm.NAME);
                    } 
                }
                if (found == false) {
                    vm.NAME = null;
                    vm.SHA = null;
                    vm.SIZE = null;
                    vm.PATH = null;
                    vm.CONTENT = null;
                    alert('No scription found');
                    console.log(found);
                } 
                else {
                    $http.get('https://api.github.com/repos/' + userLogin + '/' + repoName +'/git/blobs/' + vm.SHA + accessToken, ChangeHeaders).then(function(res){
                        console.log(res);
                        vm.CONTENT = res.data;

                        //dit is voor een stuk deel van de .md te verkrijgen
                        //je kan ook gewoon comments in de readme file steken en daarop dan parsen
                        var subStr = vm.CONTENT.substring(vm.CONTENT.indexOf("Groep 4")+13, vm.CONTENT.indexOf("### Teamleden")-1)
                        console.log(subStr);

                        Converter = new showdown.Converter();
                        ScriptionHTML = Converter.makeHtml(vm.CONTENT);
                        $scope.vm.CONTENT = $sce.trustAsHtml(ScriptionHTML);
                    })
                     }
        })
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

    vm.PostCommentScription = function(userLogin) {
        var date = new Date();
        var dateInNumbers = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear()
        console.log(dateInNumbers);
        var config;
        var IssueBody;
        IssueBody = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/'+ userLogin + '/Automatiseren-bachelorproef-2016/issues' + accessToken, {'body': IssueBody, 'title': "Scriptie feedback " + dateInNumbers}, config).then(function(res){
           console.log(res);
           document.getElementById("comments").value = "";
           });
        }
    }

    vm.GetTheLog = function(userLogin, repoName) {
        var found = false;
        var ChangeHeaders;
        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}}
        $http.get('https://api.github.com/repos/' + userLogin + '/' + repoName + '/contents' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("LOG")!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1
                        console.log(res.data[i].name);
                        console.log(res.data[i].sha);
                        vm.nameLog = res.data[i].name;
                        vm.shaLog = res.data[i].sha;
                        found = true;
                        console.log(vm.nameLog);
                    } 
                }
                if (found == false) {
                    vm.nameLog = null;
                    vm.shaLog = null;
                    vm.contentLog = null;
                    alert('No log file found!!!');
                    console.log(found);
                } 
                else {
                    $http.get('https://api.github.com/repos/' + userLogin + '/' + repoName +'/git/blobs/' + vm.shaLog + accessToken, ChangeHeaders).then(function(res){
                        console.log(res);
                        vm.contentLog = res.data;
                        $http.get('https://api.github.com/repos/' + userLogin + '/' + repoName + '/commits?path=LOG.md&' + accessToken).then(function(res){
                        console.log(res);
                        console.log(res.data[0].commit.author.date);
                        vm.LatestCommitDate = res.data[0].commit.author.date;
                        var LatestCommitDateWithout = vm.LatestCommitDate.substring(0,10);
                        console.log(LatestCommitDateWithout);
                        var year = LatestCommitDateWithout.slice(0, 4);
                        var month = LatestCommitDateWithout.slice(5, 7);
                        var day = LatestCommitDateWithout.slice(8, 10);
                        vm.exactDate = day + '/' + month + '/' + year;
                        console.log(vm.exactDate);

                        })

                        //dit is voor een stuk deel van de .md te verkrijgen
                        //je kan ook gewoon comments in de readme file steken en daarop dan parsen
                        /*var subStr = vm.contentLog.substring(vm.contentLog.indexOf("## Week"), vm.contentLog.indexOf("The End")-4)
                        console.log(subStr);*/

                        var subStr = vm.contentLog.substring(vm.contentLog.lastIndexOf("## Week"), vm.contentLog.indexOf("The End")-5)
                        console.log(subStr);

                        Converter = new showdown.Converter();
                        LogHTML = Converter.makeHtml(vm.contentLog);
                        $scope.vm.contentLog = $sce.trustAsHtml(LogHTML);
                    })
                }
        })
    }

    vm.showSelectedText = function() {
        vm.selectedText =  vm.getSelectionText();
    };

    vm.getSelectionText = function() {
      var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      return text;
    };

    /*vm.PostCommentScriptionHighlighted = function(userLogin) {
        var date = new Date();
        var dateInNumbers = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear()
        console.log(dateInNumbers);
        var config;
        var IssueBody;
        IssueBody = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/'+ userLogin + '/Automatiseren-bachelorproef-2016/issues' + accessToken, {'body': IssueBody, 'title': "Scriptie feedback " + dateInNumbers}, config).then(function(res){
           console.log(res);
           document.getElementById("comments").value = "";
           });
        }
    }*/

});

// de BAP repo's van de stages daarop zoeken op de naam 
// de naam van student eruit halen 
// nieuwe organisatie me test repo's aangemaakt
// promotor uit readme file halen en dan studenten filteren op basis van promotor en dan weergeven na de login (username van de promotor) 
// hoe halen we de echte namen van de leerkrachten hun github account want niet iedereen heeft name ingevuld
// git ignore of the keys
// client id en client secret bij organisatie werken niet 

/*bug:
- vanaf ik filter op naam zijn die bolletjes me hun kleuren weg
*/

/*
- lijn sha code 
- commentaar
- tekst 
- in body
*/

                        /*var today = new Date();
                        var dd = today.getDate();
                        var mm = today.getMonth()+1; //January is 0!
                        var yyyy = today.getFullYear();

                        /*if(dd<10) {
                            dd='0'+dd
                        } 

                        if(mm<10) {
                            mm='0'+mm
                        } 

                        today = dd+'/'+mm+'/'+yyyy;*/

                        /*var lol = "2016";
                        var bol = "2017";
                        var dateO = new Date(lol,11,01);
                        var dateB = new Date(lol,12,07);
                        console.log(today);
                        console.log(dateO);
                        console.log(dateB);

                        if(Date.parse(today) >= Date.parse(dateO) && Date.parse(today) <= Date.parse(dateB)){
                            alert("its between");
                        }else{
                            alert("its NOT between");
                        }    */

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

var app = angular.module('myApp');
var VolledigeNaam;
var Login = "https://github.com/login/oauth/authorize";

function myFunction() {
    document.getElementById("hide1").style.visibility = 'visible';
}

$(document).ready(function(){
    $('[data-toggle="tooltip"]').tooltip({
        placement : 'top'
    });
});

var accessToken = "?access_token=";

app.controller('MainCtrl', function($scope, $http, $sce) {
    var login;
    var shacode;
    var LoginCode;
    var currentURL;

    // Dit mag na dat ik de loading functie hieruit heb gehaald weg
    /*$scope.fetchData = function(user){
        $scope.loading = true;
        $http.get('https://api.github.com/users/' + user.name).then(function(res){
                console.log(res);
                $scope.username = res.data.name || "Not found";
                $scope.login = res.data.login || "Not found";
                $scope.loading = false;
        })
    }*/

    var AuthToken = "?client_id=";
    var ClientId = "?client_id=";
    $scope.Login = function(){
        window.location.replace(Login + ClientId);
        /*$http.get('https://github.com/login/oauth/authorize' + AuthToken).then(function(res){ 
            console.log(res);
        })*/
    }

    $scope.ShowData = function(){
        var i;
        $http.get('https://api.github.com/orgs/MyOrg1617/repos' + AuthToken).then(function(res){ 
                $scope.login = [];
                $scope.FullNamesStudents = [];
                for (i = 0; i < res.data.length; i++) {
                    var newRepo = res.data[i].name;
                    console.log(newRepo); //repo naam
                    if (res.data[i].name.indexOf("BAP1617") !== -1) {
                        nameStudent = res.data[i].name.substring(8);
                        newUser = {userName: nameStudent, site: res.data[i].html_url, FullnameSpace: nameStudent.replace(/([A-Z])/g, ' $1').trim()};
                        console.log(newUser); //name owner
                        $scope.GetDates(newUser);
                    };
                }
                currentURL = window.location.href;
                console.log(currentURL);
                //http://localhost:3000/?code=d41699c717253b94ac80
                LoginCode = currentURL.substring(28, currentURL.indexOf('=') + 21);
                console.log(LoginCode);
                //$scope.GetAccessToken();
                console.log($scope.login);
                console.log($scope.FullNamesStudents);
        })
    }

    $scope.ShowData();

    /*$scope.GetAccessToken = function(){
        console.log("LOL");
        $http.get('https://github.com/login/oauth/access_token' + AuthToken + '&code=' + LoginCode).then(function(res){ 
            console.log("LOLOLOLOLOL");
            console.log(res);
            accessToken = accessWord + res.access_token;
            console.log(accessToken);
        })
    }*/

    console.log(LoginCode);

    $scope.GetDates = function(userLogin){
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/commits' + AuthToken).then(function(res){
                console.log(res);
                $scope.dates = [];
                for (var i =  0; i < res.data.length; i++) {
                    $scope.dates.push(
                        res.data[i].commit.author.date
                    );
                    $scope.date = $scope.dates[0] || "Not found";
                }
                console.log($scope.dates);
                console.log($scope.date);
                var newdate = $scope.date.slice(0,10);
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
                userLogin.daysSinceLastCommit = c;

                $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/Info.md' + AuthToken).then(function(res){
                    console.log(res);
                    var shaInfo = res.data.sha;
                    console.log(shaInfo);
                    var Headers;
                    Headers = { headers: { 'Accept': 'application/vnd.github.3.raw'}}
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + shaInfo + AuthToken, Headers).then(function(res){
                        $scope.contentInfo = res.data;
                        userLogin.FullName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---naam -->")+19, $scope.contentInfo.indexOf("<!---gitnaam -->"));
                        userLogin.GitName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---gitnaam -->")+25, $scope.contentInfo.indexOf("<!---reponaam -->"));
                        userLogin.RepoName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---reponaam -->")+27, $scope.contentInfo.indexOf("<!---promotor -->"));
                        userLogin.BAPPromotor = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---promotor -->")+27, $scope.contentInfo.indexOf("<!---phone -->"));
                        userLogin.Phone = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---phone -->")+24, $scope.contentInfo.indexOf("<!---address -->"));
                        userLogin.Address = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---address -->")+25, $scope.contentInfo.indexOf("<!---company -->"));
                        userLogin.Company = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---company -->")+25, $scope.contentInfo.indexOf("<!---end -->"));
                        $http.get('https://api.github.com/users/' + userLogin.GitName + AuthToken).then(function(res){ 
                            userLogin.Avatar = res.data.avatar_url;
                        })
                    });
                });
                $scope.login.push(userLogin);
                console.log($scope.login);
            })
        }

    $scope.GetTheLog = function(userLogin) {
        var found = false;
        var ChangeHeaders;
        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}};
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/Logfiles' + accessToken).then(function(res){
                console.log(res.status)
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("LOG")!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1
                        $scope.nameLog = res.data[i].name;
                        $scope.shaLog = res.data[i].sha;
                        $scope.contentLog = null;
                        found = true;
                    } 
                }
                if (found == false) {
                    $scope.contentLog = null;
                    $scope.nameLog = null;
                    $scope.shaLog = null;
                    alert('No log file found!!!');
                    console.log(found);
                    $scope.LogParsedContent = null;
                }
                else {
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + $scope.shaLog + accessToken, ChangeHeaders).then(function(res){
                        console.log(res);
                        $scope.contentLog = res.data;
                        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/commits' + accessToken + '&path=Logfiles/LOG.md').then(function(res){
                            console.log(res);
                            console.log(res.data[0].commit.author.date);
                            $scope.LatestCommitDate = res.data[0].commit.author.date;
                            var LatestCommitDateWithout = $scope.LatestCommitDate.substring(0,10);
                            console.log(LatestCommitDateWithout);
                            var year = LatestCommitDateWithout.slice(0, 4);
                            var month = LatestCommitDateWithout.slice(5, 7);
                            var day = LatestCommitDateWithout.slice(8, 10);
                            $scope.exactDate = day + '/' + month + '/' + year;
                            console.log($scope.exactDate);
                        })
                        $scope.LogParsedContent = $scope.contentLog.substring($scope.contentLog.lastIndexOf("## Week"), $scope.contentLog.indexOf("The End")-5);
                        Converter = new showdown.Converter();
                        LogHTML = Converter.makeHtml($scope.LogParsedContent);
                        $scope.LogParsedContent = $sce.trustAsHtml(LogHTML);
                    });
                }
        })
    }

    $scope.GetRepos = function(userLogin){
        var found = false;
        $scope.loading = true;
        $http.get('https://api.github.com/orgs/MyOrg1617/repos' + accessToken).then(function(res){
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("BAP1617_" + userLogin.userName)!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1 //indexOf("do_ex1_")
                        console.log(res.data[i].name);
                        console.log(res.data[i].id);
                        console.log(res.data[i].open_issues);
                        $scope.sha = null;
                        $scope.message = null;
                        $scope.name = res.data[i].name;
                        $scope.open_issues = res.data[i].open_issues;
                        $scope.owner = userLogin.userName;
                        $scope.ownerWithSpace = userLogin.FullnameSpace;
                        found = true;
                    } 
                }
                if (found == false) {
                    $scope.name = null;
                    $scope.open_issues = null;
                    $scope.owner = null;
                    $scope.sha = null;
                    $scope.message = null;
                    $scope.ownerWithSpace = null;
                    //$scope.CONTENT = null;
                    document.getElementById("hide1").style.visibility = 'hidden';
                    alert('No BAP repo found');
                    console.log(found);
                }
                $scope.loading = false;
        })
    }

    $scope.commits = [];
    $scope.GetCommits = function(userLogin){
        var found = false;
        $scope.loading = true;
      $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/commits' + accessToken).then(function(res){
                $scope.messageNames = [];
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    $scope.commits.push(
                        res.data[i].sha
                    );
                    $scope.sha = $scope.commits || "Not found";

                    $scope.messageNames.push(
                        res.data[i].commit.message
                    );
                    $scope.message = $scope.messageNames || "Not found";
                    found = true;
                }
                $scope.loading = false;
                console.log($scope.sha);
                console.log($scope.message);
        })
    }

    $scope.GoToTextarea = function(index) {
        document.getElementById("comments").focus();  
        console.log(index);
        shacode  = $scope.commits[index];
        console.log(shacode);
        $scope.starred_url = shacode;
    }

    $scope.PostComments = function(shacode, userLogin) {
        var CommentInfo;
        var config;
        console.log(shacode);
        CommentInfo = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (CommentInfo != '') {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/commits/' + shacode + '/comments' + accessToken, {'body': CommentInfo}, config).then(function(res){
            console.log(res);
            document.getElementById("comments").value = "";
              });
        }
    }

    $scope.PostIssues = function(userLogin) {
        var IssueTitle;
        var IssueText;
        var config;
        IssueTitle = document.getElementById("issuetitle").value;
        IssueText = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}

        if (IssueText != '' && IssueTitle != '') {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': IssueText, 'title': IssueTitle}, config).then(function(res){
            console.log(res);
            document.getElementById("comments").value = "";
            document.getElementById("issuetitle").value = "";
            });
        }
    }

    $scope.GetScription = function(userLogin) {
        var found = false;
        var ChangeHeaders;
        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}}
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/scriptie' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("Scriptie")!== -1) { // Hij geeft de index waar de gezochte string begint, vind hij niks dan geeft hij -1
                        console.log(res.data[i].name);
                        console.log(res.data[i].path);
                        console.log(res.data[i].sha);
                        console.log(res.data[i].size);
                        $scope.NAME = res.data[i].name;
                        $scope.PATH = res.data[i].path;
                        $scope.SHA = res.data[i].sha;
                        $scope.SIZE = res.data[i].size;
                        $scope.ScriptieNameOwner = userLogin.userName;
                        found = true;
                        console.log($scope.NAME);
                    } 
                }
                if (found == false) {
                    $scope.NAME = null;
                    $scope.SHA = null;
                    $scope.SIZE = null;
                    $scope.PATH = null;
                    $scope.CONTENT = null;
                    $scope.ScriptieNameOwner = null;
                    alert('No scription found');
                    console.log(found);
                } 
                else {
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + $scope.SHA + accessToken, ChangeHeaders).then(function(res){
                        console.log(res);
                        $scope.CONTENT = res.data;
                        Converter = new showdown.Converter();
                        ScriptionHTML = Converter.makeHtml($scope.CONTENT);
                        $scope.CONTENT = $sce.trustAsHtml(ScriptionHTML);
                    })
                }
        })
    }

    $scope.GetIssues = function(userLogin){
        var found = false;
        $scope.loading = true;
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/issues' + accessToken + '&state=open').then(function(res){
                $scope.states = [];
                $scope.numbers = [];
                $scope.titles = [];
                $scope.IssuesNameOwner = userLogin.userName;
                console.log(res);
                for (var i =  0; i < res.data.length; i++) {
                    console.log(res.data[i].number);
                    console.log(res.data[i].title);

                    $scope.titles.push(res.data[i].title); 
                    $scope.title = $scope.titles || 'NOT';

                    $scope.numbers.push(res.data[i].number); 
                    $scope.number = $scope.numbers || 'NOT';
                }
        })
    }

    $scope.PostCommentScription = function(userLogin) {
        var date = new Date();
        var dateInNumbers = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear()
        console.log(dateInNumbers);
        var config;
        var IssueBody;
        IssueBody = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': IssueBody, 'title': "Scriptie feedback " + dateInNumbers}, config).then(function(res){
           console.log(res);
           document.getElementById("comments").value = "";
           });
        }
    }

    $scope.showSelectedText = function() {
        $scope.selectedText =  $scope.getSelectionText();
    };

    $scope.getSelectionText = function() {
      var text = "";
      if (window.getSelection) {
          text = window.getSelection().toString();
      } else if (document.selection && document.selection.type != "Control") {
          text = document.selection.createRange().text;
      }
      return text;
    };

    $scope.PostCommentScriptionHighlighted = function(userLogin) {
        console.log($scope.selectedText);
        var config;
        var IssueBody;
        IssueBody = document.getElementById("comments").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': "Comment: " + IssueBody + " / highlighted text: " + $scope.selectedText, 'title': "Scriptie feedback highlighted text"}, config).then(function(res){
           console.log(res);
           document.getElementById("comments").value = "";
           });
        }
    }

    $scope.thisIssue = function(number) {
    console.log(number);
    $scope.following_url = number;
    }

    $scope.CloseIssue = function(number, userLogin) {
       var config;
       var issueState = 'closed';
       config = { headers: { 'Content-Type': 'application/json'}}
       console.log(number);
       $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues/' + number + accessToken, {"state":issueState}, config).then(function(res){
            console.log(res);
       });
    }

    $scope.NotificationsOn = function(userLogin) {
        console.log("On");
        var config;
        config = { headers: { 'Content-Type': 'application/json'}}
        $http.put('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/subscription' + accessToken, {'subscribed': true, "ignored": false}, config).then(function(res){
            console.log(res);
        });
    }

    $scope.NotificationsOff = function(userLogin) {
        console.log("Off");
        var config;
        config = { headers: { 'Content-Type': 'application/json'}}
        $http.put('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/subscription' + accessToken, {'subscribed': false, "ignored": true}, config).then(function(res){
            console.log(res);
        });
    }

    /*$scope.submitEmail = function() {
        console.log("testje");
        $http.post('/email', $scope.mail).success(function(data, status){
            console.log("send!!!");
        });
    };*/

});

// promotor uit readme file halen en dan studenten filteren op basis van promotor en dan weergeven na de login (username van de promotor) 

// How to hide all of the keys?

//grafiek van iedereen waarvoor je promotor bent en dan de deadlines erin zetten en checken wie da al gedaan heeft en wie niet 

//voor onze login als leerkrachten maken we allebei effe een extra acount aan op login en dan gebruiken we die als leerkrachten 
// en dan een for voor na te checken welke studenten die als promotor hebben en dan enkel degene die overeenkomen laten zien


        // LAYOUTING
    //1° = wat er getoond wordt op het middeste scherm
    //2° = wat er getoond wordt op het rechtse scherm
//Druk op LOGIN: 2° toggle 
//Druk op OOGSKE: linkerscherm toggle 
//Druk op REPOSITORY: 1° toon alle commits, comment knoppen; 2° create issue
//Druk op ISSUES: 4 : 1° toon alle open issues, close knoppen; 2° create issue
//Druk op SCRIPTIE: 1° toon scriptie; 2° commentaar knop <-> highlighted commentaar
//Druk op INFO: 1° toon student info; 2° data tovoegen
//Druk op LOG: 1° toon log van de laatste week
//Druk op HELP: -> scherm met onderwerpen -> printscreens met "paint-edits"

        //HELP PAGE
    //Onderwerpen
    //FAQ
// We gaan onze app late zien aan de leerkrachten, en gaan alle vrage daze stellen opsschrijven
// We vrage wa ze niet begrijpe 
// en da zette we in een FAQ

        //LOOK HELP PAGINA
 /*TITEL HULP

 scriptie
 issues aanmake
 issues sluite
 etc.

 FAQ
 Vraag van de leekracht
 Vraag van de leekracht
 Vraag van de leekracht
 Vraag van de leekracht
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

/*
    Wat nog te doen:
    x- repo link M
    - layout K
    - gegevens studenten aanvullen in database via info.md K
    - login token fixen K
    - studenten per promotor filteren M
    - (since last login show the new commits)
    x- watching in orde brengen voor promotor M
    x- bollekes kleuren M
    - checken op bugs M
    - hulppagina 
    - (hide all the keys als er tijd over is)
    - (grafiek misschien als er tijd over is)
    x- 2 x promotor account github aanmaken + bij settings account naam: Tim Dams / Maarten Luyts MK
    x- textarea mag niet leeg zijn tijdens comments posten M
    - logged in as originele naam K
    x- originele naam weergeven M
    x- alles omzetten naar de andere organisatie M
*/

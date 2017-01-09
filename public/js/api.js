var ClientId ...

var app = angular.module('myApp');
var VolledigeNaam;
var Login = "https://github.com/login/oauth/authorize";
var Logout = "https://github.com/logout";

var accessToken;
var TokenExchanged = false;
var FullUserCode = null;
var UserCode = null;
var LoginCode;
var scopes = "&scope=admin:org user repo"; 

app.controller('MainCtrl', function($scope, $http, $sce) {
    var login;
    var shacode;
    var currentURL;
    var LoginName;
    $scope.loading = false;
    $scope.error = false;
    $scope.logged = false;
    $scope.widgetPromotor;

    $scope.Login = function(){
        window.location.replace(Login + ClientId + scopes);
    }
    
    $scope.Logout = function(){
        window.location.replace(Logout);
    }

    $scope.GetUrl = function(){
    	console.log("Retreiving URL");
    	currentURL = window.location.href;
        LoginCode = currentURL.substring(28, currentURL.indexOf('=') + 21);
    }

    $scope.GetUrl();

    $scope.GetToken = function(){
    	console.log("Going to get your token, please stand by");
        $scope.loading = true;

        $http.post('/TokenExchange', $scope.LoginCode).success(function(response){
        	console.log("I have gotten your token, it is a bit large though ...... that's what she said");
            FullUserCode = response.token;

            $scope.loading = false;
            $scope.FilterToken();
        });
    }

    $scope.FilterToken = function(){
    	console.log("Filtering your token, snip snip snip");
        UserCode = FullUserCode.substring(0, FullUserCode.indexOf('&'));
        accessToken = "?" + UserCode;

        $scope.GetUserName();
    }

    $scope.GetUserName = function(){
    	console.log("Spying on your profile ... ");
    	$scope.loading = true;

    	$http.get('https://api.github.com/user?' + FullUserCode).then(function(res){
            $scope.LoginName = res.data.name;
            console.log("I know your name " + $scope.LoginName);

            $scope.LoginName = res.data.name;
            $scope.loading = false;
            $scope.ShowData();
            $scope.widgetPromotor = {title: $scope.LoginName};
        });
    }

    $scope.ShowData = function(){
    	console.log("Showing all your requested data");
	    $scope.loading = true;

        var i;
        $http.get('https://api.github.com/orgs/MyOrg1617/repos' + accessToken).then(function(res){ 
                $scope.login = [];
                $scope.Filterlogin = [];

                $scope.FullNamesStudents = [];
                for (i = 0; i < res.data.length; i++) {
                    var newRepo = res.data[i].name;
                    if (res.data[i].name.indexOf("BAP1617") !== -1) {
                        nameStudent = res.data[i].name.substring(8);
                        newUser = {userName: nameStudent, site: res.data[i].html_url, FullnameSpace: nameStudent.replace(/([A-Z])/g, ' $1').trim()};

                        $scope.GetDates(newUser);
                    };
                }
                $scope.loading = false;
        })
    }

    $scope.GetDates = function(userLogin){
    	console.log("Going through Mike's NSFW function ... please stand by");
    	$scope.error = false;
        $scope.loading = true;

        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/commits' + accessToken).then(function(res){
                $scope.dates = [];
                for (var i =  0; i < res.data.length; i++) {
                    $scope.dates.push (
                        res.data[i].commit.author.date );
                    $scope.date = $scope.dates[0] || "Not found";
                }
                var newdate = $scope.date.slice(0,10);

                var q = new Date();
                var m = q.getMonth();
                var d = q.getDate();
                var y = q.getFullYear();

                var date = new Date(y,m,d);

                mydate = new Date(newdate);
                var c = parseInt((date - mydate) / (1000*60*60*24) + 1);
                userLogin.daysSinceLastCommit = c;

                $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/Info.md' + accessToken).then(function(res){
                    var shaInfo = res.data.sha;
                    var Headers;
                    Headers = { headers: { 'Accept': 'application/vnd.github.3.raw'}}
                    
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + shaInfo + accessToken, Headers).then(function(res){
                        $scope.contentInfo = res.data;
                        userLogin.FullName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---naam -->")+19, $scope.contentInfo.indexOf("<!---gitnaam -->"));
                        userLogin.GitName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---gitnaam -->")+25, $scope.contentInfo.indexOf("<!---reponaam -->"));
                        userLogin.RepoName = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---reponaam -->")+27, $scope.contentInfo.indexOf("<!---promotor -->"));
                        userLogin.BAPPromotor = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---promotor -->")+27, $scope.contentInfo.indexOf("<!---phone -->"));
                        userLogin.Phone = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---phone -->")+24, $scope.contentInfo.indexOf("<!---address -->"));
                        userLogin.Address = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---address -->")+25, $scope.contentInfo.indexOf("<!---company -->"));
                        userLogin.Company = $scope.contentInfo.substring($scope.contentInfo.indexOf("<!---company -->")+25, $scope.contentInfo.indexOf("<!---end -->"));
                        $http.get('https://api.github.com/users/' + userLogin.GitName + accessToken).then(function(res){ 
                            userLogin.Avatar = res.data.avatar_url;
                        })

                        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/commits' + accessToken + '&path=Logfiles/LOG.md').then(function(res){
                            $scope.LatestCommitDate = res.data[0].commit.author.date;
                            var LatestCommitDateWithout = $scope.LatestCommitDate.substring(0,10);
                            var year = LatestCommitDateWithout.slice(0, 4);
                            var month = LatestCommitDateWithout.slice(5, 7);
                            var day = LatestCommitDateWithout.slice(8, 10);
                            $scope.exactDate = day + '/' + month + '/' + year;
                            userLogin.CommitLogDate = $scope.exactDate;
                        })

                        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + accessToken).then(function(res){
                            userLogin.Open_issues = res.data.open_issues;
                        });
                        $scope.loading = false;

                    	$scope.login.push(userLogin);
                });
            });
        })
    }

    $scope.GetTheLog = function(userLogin) {
        $scope.error = false;
        $scope.loading = true;
        
        var found = false;
        var ChangeHeaders;
        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}};
        
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/Logfiles' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("LOG")!== -1) {
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
                    $scope.LogParsedContent = null;
                    $scope.loading = false;
                }
                else {
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + $scope.shaLog + accessToken, ChangeHeaders).then(function(res){
                        $scope.contentLog = res.data;
                        $scope.LogParsedContent = $scope.contentLog.substring($scope.contentLog.lastIndexOf("## Week"), $scope.contentLog.indexOf("The End")-5);
                        Converter = new showdown.Converter();
                        LogHTML = Converter.makeHtml($scope.LogParsedContent);
                        $scope.LogParsedContent = $sce.trustAsHtml(LogHTML);
                        $scope.loading = false;
                    });
                }
        })
    }

    $scope.GetRepos = function(userLogin){
        $scope.error = false;
        var found = false;
        $scope.loading = true;

        $http.get('https://api.github.com/orgs/MyOrg1617/repos' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("BAP1617_" + userLogin.userName)!== -1) {

                        $scope.name = res.data[i].name;
                        $scope.open_issues = res.data[i].open_issues;
                        $scope.owner = userLogin.userName;
                        $scope.ownerWithSpace = userLogin.FullnameSpace;
                        found = true;
                        $scope.GetCommits(userLogin.userName);
                        $scope.loading = false;
                    } 
                }

                if (found == false) {
                    $scope.name = null;
                    $scope.open_issues = null;
                    $scope.owner = null;

                    $scope.ownerWithSpace = null;
                    alert('No BAP repo found');
                    $scope.loading = false;
                }
        })
    }

    $scope.GetCommits = function(userLogin){
        $scope.error = false;
        var found = false;
        $scope.loading = true;

        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/commits' + accessToken).then(function(res){
                $scope.commits = [];
                $scope.messageNames = [];
                for (var i =  0; i < res.data.length; i++) {
                    $scope.commits.push(
                        res.data[i].sha
                    );
                    $scope.sha = $scope.commits || "Not found";

                    $scope.messageNames.push(
                        res.data[i].commit.message
                    );
                    $scope.message = $scope.messageNames || "Not found";
                }
                $scope.loading = false;
        })
    }

    $scope.GoToTextarea = function(index) {
        document.getElementById("commentCommit").focus();  
        $scope.shacode = $scope.commits[index];
    }

    $scope.PostComments = function(shacode, userLogin) {
    	$scope.error = false;
        $scope.loading = true;
        var CommentInfo;
        var config;

        CommentInfo = document.getElementById("commentCommit").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (CommentInfo != '' && shacode != undefined) {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/commits/' + shacode + '/comments' + accessToken, {'body': CommentInfo}, config).then(function(res){
                document.getElementById("commentCommit").value = "";
                $scope.loading = false;
                $scope.error = false;
            });
        }
        else {
            alert("Comment area is leeg!");
            $scope.loading = false;
            $scope.error = true;
        }
    }

    $scope.GetScription = function(userLogin) {
        $scope.error = false;
        var found = false;
        var ChangeHeaders;
        $scope.loading = true;

        ChangeHeaders = { headers: { 'Accept': 'application/vnd.github.3.raw'}}

        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/scriptie' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("Scriptie")!== -1) {

                        $scope.NAME = res.data[i].name;
                        $scope.PATH = res.data[i].path;
                        $scope.SHA = res.data[i].sha;
                        $scope.SIZE = res.data[i].size;
                        $scope.ScriptieNameOwner = userLogin.userName;
                        found = true;
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
                    $scope.loading = false;
                } 
                else {
                    $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + $scope.SHA + accessToken, ChangeHeaders).then(function(res){
                        $scope.CONTENT = res.data;
                        Converter = new showdown.Converter();
                        ScriptionHTML = Converter.makeHtml($scope.CONTENT);
                        $scope.CONTENT = $sce.trustAsHtml(ScriptionHTML);
                        $scope.loading = false;
                    })
                }
        })
    }

    $scope.PostCommentScription = function(userLogin) {
        $scope.error = false;
        var date = new Date();
        var dateInNumbers = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear()
        var config;
        var IssueBody;
        $scope.loading = true;
        IssueBody = document.getElementById("commentScriptie").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': IssueBody, 'title': "Scriptie feedback " + dateInNumbers}, config).then(function(res){
                document.getElementById("commentScriptie").value = "";
                $scope.loading = false;
           });
        }
        else {
            alert("Comment area is leeg!");
            $scope.loading = false;
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
        $scope.error = false;
        var config;
        var IssueBody;
        $scope.loading = true;
        IssueBody = document.getElementById("commentScriptie").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueBody != '') {
           $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': "Comment: " + IssueBody + " / highlighted text: " + $scope.selectedText, 'title': "Scriptie feedback highlighted text"}, config).then(function(res){
                document.getElementById("commentScriptie").value = "";
                $scope.loading = false;
           });
        }
        else {
            alert("Comment area is leeg!");
            $scope.loading = false;
        }
    }

    $scope.GetIssues = function(userLogin){
        $scope.error = false;
        $http.get('https://api.github.com/orgs/MyOrg1617/repos' + accessToken).then(function(res){
                for (var i =  0; i < res.data.length; i++) {
                    if (res.data[i].name.indexOf("BAP1617_" + userLogin.userName)!== -1) { 
                        $scope.eigenaar = userLogin.userName;
                    } 
                }
        })
        var found = false;
        $scope.loading = true;
        $http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/issues' + accessToken + '&state=open').then(function(res){
                if (userLogin.Open_issues != '0') {
                    $scope.states = [];
                    $scope.numbers = [];
                    $scope.titles = [];
                    $scope.IssuesNameOwner = userLogin.userName;
                    for (var i =  0; i < res.data.length; i++) {

                        $scope.titles.push(res.data[i].title); 
                        $scope.title = $scope.titles || 'NOT';

                        $scope.numbers.push(res.data[i].number); 
                        $scope.number = $scope.numbers || 'NOT';
                    }
                }
                else {
                    $scope.numbers = [];
                    $scope.titles = [];
                    $scope.number = [];
                    $scope.title = [];
                }
                $scope.loading = false;
        })
    }

    $scope.PostIssuesRepo = function(userLogin) {
        $scope.error = false;
        $scope.loading = true;
        var IssueTitle;
        var IssueText;
        var config;        

        IssueTitle = document.getElementById("issuetitleRepo").value;
        IssueText = document.getElementById("commentCommit").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueText != '' && IssueTitle != '') {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': IssueText, 'title': IssueTitle}, config).then(function(res){
            document.getElementById("commentCommit").value = "";
            document.getElementById("issuetitleRepo").value = "";
            $scope.loading = false;
        });
        }
        else {
            alert("Comment area of titel area is leeg!");
            $scope.loading = false;
        }
    }

    $scope.PostIssues = function(userLogin) {
    	$scope.error = false;
		$scope.loading = true;
		var IssueTitle;
        var IssueText;
        var config;

        IssueTitle = document.getElementById("issuetitleIssue").value;
        IssueText = document.getElementById("commentIssue").value;
        config = { headers: { 'Content-Type': 'application/json'}}
        if (IssueText != '' && IssueTitle != '') {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues' + accessToken, {'body': IssueText, 'title': IssueTitle}, config).then(function(res){
            document.getElementById("commentIssue").value = "";
            document.getElementById("issuetitleIssue").value = "";
            $scope.loading = false;
            });
        }
        else {
            alert("Comment area of titel area is leeg!");
            $scope.loading = false;
        }
    }

    $scope.thisIssue = function(number) {
        $scope.issueNumber = $scope.numbers[number];
    }

    $scope.CloseIssue = function(number, userLogin) {
        $scope.error = false;
        var config;
        var issueState = 'closed';
        config = { headers: { 'Content-Type': 'application/json'}}
        $scope.loading = true;
        if (number != undefined) {
            $http.post('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin + '/issues/' + number + accessToken, {"state":issueState}, config).then(function(res){
                $scope.loading = false;
                $scope.error = false;
            });
        }
        else{
            $scope.error = true;
            $scope.loading = false;
        }
    }

   $scope.NotificationsOn = function(userLogin) {
        $scope.error = false;
        console.log("On");
        var config;
        $scope.loading = true;
        config = { headers: { 'Content-Type': 'application/json'}}
        $http.put('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/subscription' + accessToken, {'subscribed': true, "ignored": false}, config).then(function(res){
            $scope.loading = false;
        });
    }

    $scope.NotificationsOff = function(userLogin) {
        $scope.error = false;
        console.log("Off");
        var config;
        $scope.loading = true;
        config = { headers: { 'Content-Type': 'application/json'}}
        $http.put('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/subscription' + accessToken, {'subscribed': false, "ignored": true}, config).then(function(res){
            $scope.loading = false;
        });
    }

    $scope.GetStudentInfo = function(userLogin) {
    	$http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/contents/Info.md' + accessToken).then(function(res){
    		$scope.ThisUser=[]
    		var shaInfo = res.data.sha;
    		var Headers;
    		Headers = { headers: { 'Accept': 'application/vnd.github.3.raw'}}

    		$http.get('https://api.github.com/repos/MyOrg1617/BAP1617_' + userLogin.userName + '/git/blobs/' + shaInfo + accessToken, Headers).then(function(response){
    		    $scope.ThisGuyData = response.data;
    		    userLogin.FullName = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---naam -->")+19, $scope.ThisGuyData.indexOf("<!---gitnaam -->"));
    		    userLogin.GitName = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---gitnaam -->")+25, $scope.ThisGuyData.indexOf("<!---reponaam -->"));
    		    userLogin.RepoName = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---reponaam -->")+27, $scope.ThisGuyData.indexOf("<!---promotor -->"));
    		    userLogin.BAPPromotor = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---promotor -->")+27, $scope.ThisGuyData.indexOf("<!---phone -->"));
    		    userLogin.Phone = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---phone -->")+24, $scope.ThisGuyData.indexOf("<!---address -->"));
    		    userLogin.Address = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---address -->")+25, $scope.ThisGuyData.indexOf("<!---company -->"));
    		    userLogin.Company = $scope.ThisGuyData.substring($scope.ThisGuyData.indexOf("<!---company -->")+25, $scope.ThisGuyData.indexOf("<!---end -->"));
    		    $scope.HisName = userLogin.FullName;
    		    $scope.widget = {title: $scope.HisName};
    		    refresh($scope.HisName);
        	});
        	$scope.ThisUser.push(userLogin);
    	});
    }

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ===================================================DATABASE===================================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

 var refresh = function(MyUser) {
    $http.get('/studenteninfo').success(function(response) {
      	console.log("I got the data I requested");
      	$scope.FilterThisGuy = [];
      	$scope.studenteninfo = response;
      
      	for (var i = 0; i <= $scope.studenteninfo.length; i++) {
        	if ($scope.studenteninfo[i].name == MyUser) {
        		$scope.FilterThisGuy.push($scope.studenteninfo[i]);
        	}
        	else{
        		$scope.student = "";
        	}
      	}
    });
  };

  $scope.addData = function(MyUser) {

    $http.post('/studenteninfo', $scope.student).success(function(response) {
      $scope.GetStudentInfo(MyUser);
    });
  };

  $scope.remove = function(id, MyUser) {
    $http.delete('/studenteninfo/' + id).success(function(response) {
      $scope.GetStudentInfo(MyUser);
    });
  };

  $scope.edit = function(id) {
    $http.get('/studenteninfo/' + id).success(function(response) {
      $scope.student = response;
    });
  };  

  $scope.update = function(MyUser) {
    $http.put('/studenteninfo/' + $scope.student._id, $scope.student).success(function(response) {
      $scope.GetStudentInfo(MyUser);
    })
  };

  $scope.deselect = function() {
    $scope.student = "";
  };

  $scope.Auth = function(){
      $http.get('/tokens').success(function(response) {
      console.log("I need an AuthToken ... Lets go get it");
      $scope.tokens = response;
      $scope.token = "";
    });
  };

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ==============================================================================================================
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

    if (LoginCode.length >= 10) {
    	$scope.GetToken();
        $scope.logged = true;
    }

    if (performance.navigation.type == 1 && LoginCode.length >= 15) {
  		console.info( "This page is reloaded" );
  		$scope.Login();
	} 
	else if (performance.navigation.type == 1) {
  		console.info( "This page is reloaded");
	}
	else {
  		console.info( "This page is not reloaded");
	}
});
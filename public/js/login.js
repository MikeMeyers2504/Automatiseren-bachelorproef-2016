var app = angular.module('myApp');
    
var githubOAuth = require('github-oauth')({
  githubClient: process.env['GITHUB_CLIENT'],
  githubSecret: process.env['GITHUB_SECRET'],
  baseURL: 'http://localhost',
  loginURI: '/login',
  callbackURI: '/callback',
  scope: 'user' // optional, default scope is set to user 
})
 
require('http').createServer(function(req, res) {
  if (req.url.match(/login/)) return githubOAuth.login(req, res)
  if (req.url.match(/callback/)) return githubOAuth.callback(req, res)
}).listen(3000)
 
githubOAuth.on('error', function(err) {
  console.error('there was a login error', err)
})
 
githubOAuth.on('token', function(token, serverResponse) {
  console.log('here is your shiny new github oauth token', token)
  serverResponse.end(JSON.stringify(token))
})
 
// now go to http://localhost/login 

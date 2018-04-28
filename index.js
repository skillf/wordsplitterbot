const awsContext = require('aws-lambda-mock-context');
const alexaVerifier = require('alexa-verifier');
const bodyParser = require('body-parser');
const express = require('express');
const https = require('https');
const http = require('http');
const alexa = require('./alexa');
const slack = require('./slack');

const E = process.env;
const X = express();

X.use(bodyParser.json());
X.use(bodyParser.urlencoded({extended: true}));
X.all('/dialogflow', (req, res) => {
  var inp = req.body.result.resolvedQuery;
  var out = inp.split('').join(' ');
  res.json({speech: out, source: 'dialogflow'});
  console.log(`DIALOGFLOW.INP: ${inp}`);
  console.log(`DIALOGFLOW.OUT: ${out}`);
});
X.all('/alexa', (req, res) => {
  var h = req.headers;
  alexaVerifier(h.signaturecertchainurl, h.signature, JSON.stringify(req.body), (err) => {
    if(err) return res.status(400).send();
    var ctx = awsContext();
    alexa.handler(req.body, ctx);
    ctx.Promise.then((ans) => res.json(ans));
  });
});
X.all('/slack', (req, res) => {
  if(req.body.token!==E.SLACK_TOKEN) res.status(400).send();
  else slack.handler(req, res);
});
X.all('/slack/install', slack.install);
X.all('/slack/oauth', slack.oauth);
X.use(express.static('public', {extensions:['html']}));

var server = http.createServer(X);
server.listen(E.PORT||80, () => {
  var addr = server.address();
  console.log(`SERVER: listening on channel ${addr.port}`);
});

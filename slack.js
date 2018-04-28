const WebClient = require('@slack/client').WebClient;
const persist = require('node-persist');
const request = require('request');
const fs = require('fs');

const E = process.env;
const API_URL = 'https://slack.com/api';
const HELP_MESSAGE = fs.readFileSync('public/help/slash.txt', 'utf8');
persist.initSync();

function handler(req, res) {
  var inp = req.body.text;
  if(/^\W*help\W*$/i.test(inp)) return res.send(HELP_MESSAGE);
  var out = inp.split('').join(' ');
  var channel = req.body.channel_id; res.send();
  var web = new WebClient(persist.getItemSync(req.body.team_id));
  web.chat.postMessage({channel, text: out, as_user: true});
  console.log(`SLACK.INP: ${inp}`);
  console.log(`SLACK.OUT: ${out}`);
};
function install(req, res) {
  res.redirect(`https://slack.com/oauth/authorize?client_id=${E.SLACK_CLIENT_ID}&scope=${E.SLACK_SCOPE}`);
};
function oauth(req, res) {
  if(!req.query.code) return;
  var data = {client_id: E.SLACK_CLIENT_ID, client_secret: E.SLACK_CLIENT_SECRET, code: req.query.code};
  request.post(API_URL+'/oauth.access', {form: data}, (err, ores, body) => {
    if(err || ores.statusCode!==200) return;
    var obody = JSON.parse(body);
    persist.setItemSync(obody.team_id, obody.access_token);
    console.log(`SLACK.INSTALL: ${obody.team_id}`);
    res.redirect('/slash?install_success=1');
  });
};
exports.handler = handler;
exports.install = install;
exports.oauth = oauth;

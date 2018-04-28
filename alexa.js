const Alexa = require('alexa-sdk');

const E = process.env;
const WELCOME_MESSAGE = [
  'Hi! Tell me something, and i will split it into characters.\nI will keep talking to you until you say "stop".',
  'Hello! Tell me a word, and i will spell it to you.\nSay "stop" when you want to stop talking to me.',
  'Good day! What ever you say will be split into characters.\nWhen you are done, just say "stop".',
  'Greetings! I can split whatever you say into characters.\nYou need to tell "stop", when you are done talking to me.',
];
const HELP_MESSAGE = [
  'Tell me something, and i will split it into characters.\nSay "stop" when you want to stop talking to me.',
  'I can split whatever you say into characters.\nWhen you are done, just say "stop".',
  'Tell me a word, and i will spell it to you.\nYou need to tell "stop", when you are done talking to me.',
  'What ever you say will be split into characters.\nI will keep talking to you until you say "stop".',
];

function LaunchRequest() {
  var i = Math.floor(WELCOME_MESSAGE.length*Math.random());
  console.log(`ALEXA.LaunchRequest`);
  this.emit(':ask', WELCOME_MESSAGE[i]);
};

function DefaultFallbackIntent() {
  var inp = this.event.request.intent.slots.text.value;
  var out = inp.split('').join(' ');
  console.log(`ALEXA.DefaultFallbackIntent: inp=${inp}`);
  console.log(`ALEXA.DefaultFallbackIntent: out=${out}`);
  this.emit(':ask', out);
};

function HelpIntent() {
  var i = Math.floor(HELP_MESSAGE.length*Math.random());
  console.log(`ALEXA.HelpIntent`);
  this.emit(':ask', HELP_MESSAGE[i]);
};

function CancelIntent() {
  console.log(`ALEXA.CancelIntent`);
  this.emit(':tell', 'Cancelled.');
};

function StopIntent() {
  console.log(`ALEXA.StopIntent`);
  this.emit(':tell', 'Bye!');
};

function Unhandled() {
  console.log(`ALEXA.Unhandled`);
  this.emit(':tell', 'Error!');
};

var handlers = {
  LaunchRequest, DefaultFallbackIntent,
  'AMAZON.HelpIntent': HelpIntent, 'AMAZON.CancelIntent': CancelIntent, 'AMAZON.StopIntent': StopIntent, Unhandled
};
exports.handler = function(e, ctx, fn) {
  const alexa = Alexa.handler(e, ctx, fn);
  alexa.appId = E.ALEXA_APP_ID;
  alexa.registerHandlers(handlers);
  alexa.execute();
};

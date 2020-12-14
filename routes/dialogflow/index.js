// subroute
const dialogflowApp = require('express').Router();

// webhook client for dialogflow
const { WebhookClient } = require("dialogflow-fulfillment");

// handlers
const {
	welcome,
  nameHandler,
	makeAppointment,
	timeSelect
} = require('./handlers');

dialogflowApp.get('/', (request, response) => {
  response.send('OK');
});

// webhook route
dialogflowApp.post('/', (request, response) => {
  const agent = new WebhookClient({ request, response });
  // uncommnet the below two lines to debug the request
  // console.log("Dialogflow Request headers: " + JSON.stringify(request.headers));
  // console.log("Dialogflow Request body: " + JSON.stringify(request.body));

  // Run the proper function handler based on the matched Dialogflow intent name
  let intentMap = new Map();
  intentMap.set('Default Welcome Intent', welcome);
  intentMap.set('Default Welcome Intent - take name', nameHandler);
  intentMap.set("Make Appointment", makeAppointment);
  intentMap.set("Make Appointment - select time", timeSelect);

  agent.handleRequest(intentMap);
});

module.exports = dialogflowApp;
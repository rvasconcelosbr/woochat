const gupshupApp = require("express").Router();

const dialogflowServiceAccount = require("./dialogflow-service-account.json");
const dialogflowSessionClient = require("./botlib/dialogflow_session_client.js");

const projectId = "woocommercechatbot-kufr";

const sessionClient = new dialogflowSessionClient(
  projectId,
  dialogflowServiceAccount
);

gupshupApp.post("/", async function(req, res) {
  const body = req.body;

  // if gupshup request is "text"
  if (body.payload.type === "text") {
    const text = body.payload.payload.text;
    const id = body.payload.sender.phone;

    console.log(`Request received from ${id} => ${text}`);

    const dialogflowResponse = (await sessionClient.detectIntent(
      text,
      id,
      body
    )).fulfillmentText;

    res.send(dialogflowResponse);
  } else {
    res.status(200);
  }
});

module.exports = gupshupApp;

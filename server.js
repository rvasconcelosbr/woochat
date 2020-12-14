// init project
const express = require("express");

// import the body parser for the fetching the post body
const bodyParser = require("body-parser");

// import routes
const dialogflowApp = require("./routes/dialogflow");
const gupshupApp = require("./routes/gupshup");
const wooApp = require("./routes/woocommerce");

// create express app
const app = express();

// Parse data from application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// CORS headers
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

app.get("/", (request, response) => {
  response.send(`Welcome to Dialogflow Webhook!!`);
});

// webview front-end route
app.use("/dialogflow/webhook", dialogflowApp);

// gupshup router
app.use("/gupshup/webhook", gupshupApp);

app.use("/wooApp/webhook", wooApp);

// start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`The app is running on port ${PORT}`);
});

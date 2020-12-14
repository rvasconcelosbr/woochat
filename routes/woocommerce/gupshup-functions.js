const axios = require("axios");

const apiKey = "120f62cb16f5496cc9a6e4713a32c45b";

function sendTextMessage(phone, message) {
  return axios({
    method: "post",
    url: "https://api.gupshup.io/sm/api/v1/msg",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      apiKey
    },
    params: {
      channel: "whatsapp",
      source: "5511942468325",
      destination: `55${phone}`,
      // destination: `918140331774`,
      message
    }
  });
}

module.exports = {
  sendTextMessage
};

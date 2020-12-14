const wooApp = require("express").Router();

const moment = require("moment-timezone");

// functions
const { sendTextMessage } = require("./gupshup-functions.js");

function sendGoogleForm(phone) {
  let message = `Conte-nos como foi a sua experiência! Por favor preencha nossa pesquisa de satisfação, clique no link abaixo:\n\n`;
  message += `https://docs.google.com/forms/d/e/1FAIpQLSeTG-iRsWH7OXS_uYoNS640K0KrBAxaT6bdyDNn_dKuuKnkGg/viewform?usp=send_form`;

  // setTimeout(() => {
  sendTextMessage(phone, message)
    .then(result => {
      if (result.data.status === "submitted") {
        console.log("Message Sent");
      } else {
        console.log("There is some error");
      }
    })
    .catch(error => {
      console.log(error);
    });
  // }, 120 * 60 * 1000);
}

wooApp.get("/", async (req, res) => {
  res.send("OK");
});

wooApp.get("/order-created", (req, res) => res.send("OK"));

wooApp.post("/order-created", async function(req, res) {
  const body = req.body;
  const phone = body.billing.phone.replace(/\(|\)| |-/g, "");

  console.log(phone);

  let message = `O seu pedido foi anotado! Para qualquer dúvida ou mudança entre em contato nos TELs: 01135866506 ou Celular 011988288091, veja os detalhes:\n\n`;
  message += `*Número do Pedido:* ${body.number}\n*Date:* ${body.date_created}\n*Email:* ${body.billing.email}\n\n`;

  let subtotal = 0;
  body.line_items.forEach(line => {
    const line_info = `${line.quantity} ${line.name} - ${line.price} x ${line.quantity} = ${line.total}\n`;
    message += line_info;
    subtotal += Number(line.subtotal);
  });

  message += `\n*Subtotal:* ${subtotal}\n*Entrega:* ${body.shipping_total}\n*Pagamento:* ${body.payment_method_title}\n`;
  message += `*Total:* ${body.total}\n\n`;

  message += `*Endereço de Entrega:* ${body.shipping.address_1}${
    body.shipping.address_2 !== "" ? ", " + body.shipping.address_2 : ""
  }, ${body.shipping.city}, ${body.shipping.state}, ${
    body.shipping.postcode
  }, ${body.shipping.country}`;

  await sendTextMessage(phone, message)
    .then(result => {
      if (result.data.status === "submitted") {
        console.log("Message Sent");
        res.send("Message Sent");
      } else {
        res.send("There is some error");
      }
    })
    .catch(error => {
      console.log(error);
      res.send("There is some error");
    });
});

wooApp.get("/order-updated", (req, res) => res.send("OK"));

wooApp.post("/order-updated", async function(req, res) {
  const body = req.body;
  const phone = body.billing.phone.replace(/\(|\)| |-/g, "");

  console.log(phone);

  let message = `Posição do Pedido: *${body.status}*\n\n`;
  message += `*Número do Pedido:* ${body.number}\n*Data:* ${body.date_created}\n*Email:* ${body.billing.email}\n\n`;

  let subtotal = 0;
  body.line_items.forEach(line => {
    const line_info = `${line.quantity} ${line.name} - ${line.price} x ${line.quantity} = ${line.total}\n`;
    message += line_info;
    subtotal += Number(line.subtotal);
  });

  message += `\n*Subtotal:* ${subtotal}\n*Entrega:* ${body.shipping_total}\n*Pagamento:* ${body.payment_method_title}\n`;
  message += `*Total:* ${body.total}\n\n`;

  message += `*Endereço de Entrega:* ${body.shipping.address_1}${
    body.shipping.address_2 !== "" ? ", " + body.shipping.address_2 : ""
  }, ${body.shipping.city}, ${body.shipping.state}, ${
    body.shipping.postcode
  }, ${body.shipping.country}`;

  await sendTextMessage(phone, message)
    .then(result => {
      if (result.data.status === "submitted") {
        console.log("Message Sent");
        if (body.status === "completed") {
          sendGoogleForm(phone);
        }
        res.send("Message Sent");
      } else {
        res.send("There is some error");
      }
    })
    .catch(error => {
      console.log(error);
      res.send("There is some error");
    });
});

wooApp.get("/order-cancelled", (req, res) => res.send("OK"));

wooApp.post("/order-cancelled", async function(req, res) {
  const body = req.body;
  const phone = body.billing.phone.replace(/\(|\)| |-/g, "");

  console.log(phone);

  let message = `Hummm! Algo de errado! o seu pedido foi cancelado - *${body.status}*\n\n`;
  message += `*Número do Pedido:* ${body.number}\n*Data:* ${body.date_created}\n*Email:* ${body.billing.email}\n\n`;

  let subtotal = 0;
  body.line_items.forEach(line => {
    const line_info = `${line.quantity} ${line.name} - ${line.price} x ${line.quantity} = ${line.total}\n`;
    message += line_info;
    subtotal += Number(line.subtotal);
  });

  message += `\n*Subtotal:* ${subtotal}\n*Entrega:* ${body.shipping_total}\n*Payment method:* ${body.payment_method_title}\n`;
  message += `*Total:* ${body.total}\n\n`;

  message += `*Endereço de Entrega:* ${body.shipping.address_1}${
    body.shipping.address_2 !== "" ? ", " + body.shipping.address_2 : ""
  }, ${body.shipping.city}, ${body.shipping.state}, ${
    body.shipping.postcode
  }, ${body.shipping.country}`;

  await sendTextMessage(phone, message)
    .then(result => {
      if (result.data.status === "submitted") {
        res.send("Message Sent");
      } else {
        res.send("There is some error");
      }
    })
    .catch(error => {
      console.log(error);
      res.send("There is some error");
    });
});

module.exports = wooApp;

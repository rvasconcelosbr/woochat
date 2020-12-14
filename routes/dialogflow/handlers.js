const { google } = require("googleapis");
// moment for time
const moment = require("moment-timezone");

const { addUserInfo, getUserInfo } = require("../dialogflow/db-functions");

// Enter your calendar ID below and service account JSON below
const calendarId = "vasconcelos@fastleads.com.br";
const serviceAccount = {
  type: "service_account",
  project_id: "vendedor-nppcrv",
  private_key_id: "1d905c80f1c8a14cd714f1a40f9dc8c2142090d1",
  private_key:
    "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDQA1HFK6udJYCo\niyBEh+Q3F+vLs0bGZDAaojI0lMHecljDvWOsxQmA5lwmoamoDUz1K9YjCrqcsHzO\nctBZcsmJInbprfdc2MX5rGpSzl94FfydhSJW1FlCHTI4IoJlck7G26wjWUWZrTPR\nz5PwXL+/wYLaw2F+Jvb5x+eqIjjbJhnSEEDWMagrsGJAVF1ow1YeMKHbuIWFg07Z\nuPxBzyNAg/LUHhIMuBRL81R9Nn7h+vagkhBz8PZugIpW9HzAZZ1QncQD0jiX1zJL\njmS+rBLkmx1wAop+/shJR1x3eG42a03TCTuN/qvEBW8mer/6jCnLHsVMjDxFMjmC\nZGsQ9CHvAgMBAAECggEARU791WkWHt/KjR4CK+Ntfo/pYK+E4wCp6I3nlY6FREWs\nXtgBWKU0Y+8dgD+4ZEa+QCiRio5+HExP4Yfu9QbisN87aOQuuhB+cpDowluCAuSs\njZ25Ed5iOT26KGsTMJMUPX0fT43ku24zCHMWM23r9AwZuiOEngCEpThe79jEQfxH\nZv+/1aMswFhzluPZ8h7vxDfIvccnXM2Vr8qpeBuTTThPHCoij4vuRmgur05jrZpX\nmD6RlHLT3a1es86avSGj3rlUao7LZNI7J7023KxY7dwBv0e3f4zrXM+yiKAb1a3P\n6epdtY473uIJeOjt7cJB8BhKie1e+yUJoijLkAovZQKBgQD1auxq+4y8VqMFhSkD\n1WL7YPQvPwzTrf1gcu1zDIazc73BD2qNStWWYPSUKFOBnnex9h2qTLkGntbKqERw\nTuKr/QMWQikqAEgR08u1x4Lqz0w7srXbnL1Lt7fak8c8dWuHHP9lQJCmMFtvfFXh\n7ZTXgIEtl4cg4aQU8dZlzHj5IwKBgQDY+3+83eW63+xhAxZ46DP8/BFMxJEjq++T\n3ktcKE91zIJVwQFmpLj/qGl8mukD7zn7fJ6qDjIfxBzYdTit8wW2W+hwYqUW05B2\nrUYdRGqGivdA2UiwIpVkg+DpR+0klEW0q/z1GFoyvv1Ct76R8gX5N9Z2MWVAndyf\nWqyoRdmOxQKBgEgbuotUje1op02f6oUt1X925UhchjBMFv6XxhzfuVRQ1Zg8J1qM\nemVM55AAqUiUfybS4bSABn1jfkjdV/6HryJJnPaVSfMFUieqy1gF3vmPHx8LS1PT\noer1eBfJA+lHtuhkJMZjSh0KaFNBfRp87BbFsy7qLtICemuNAym2AnVxAoGASG88\n51nUNRxHluMm/1nU8SFczRnZseTV57EPy0YRsKuC3wm9Y/ydXYtlG5nDK/MSkie5\n998hUIVxc7k+IKO+RnBMGih0IDikQ1n4zBBo111QyS9AGryQzqtPy9CdE9cDphq8\nKT3l7obfmQQp9CKtZ9MCHxbCTF3mprPoa4xV4lkCgYAkQ+27cslHt/F7583003HG\n9mEz7ORBbpDwjGNMew6xSYh/hW+o8a71N5q2qCgthizL66DVAqpeOUvStlnA+fdc\nsnFXd/eod3AY/KFEysT/hI8XIrEzl/PHcoqzwyxfNORfBgUiqCArzGTWasa/Qv8+\nOwP0nKzMsr5NWqQoOpejww==\n-----END PRIVATE KEY-----\n",
  client_email:
    "calendar-scheduler-chatbot@vendedor-nppcrv.iam.gserviceaccount.com",
  client_id: "102729917008721638691",
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
  client_x509_cert_url:
    "https://www.googleapis.com/robot/v1/metadata/x509/calendar-scheduler-chatbot%40vendedor-nppcrv.iam.gserviceaccount.com"
};

// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: "https://www.googleapis.com/auth/calendar"
});

const timeZone = "America/Buenos_Aires";
const timeZoneOffset = "-03:00";

// default moment timzone
moment.tz.setDefault(timeZone);

const calendar = google.calendar("v3");

function getSessionId(agent) {
  const sessionIdSplit = agent.request_.body.session.split("/");
  const sessionId = sessionIdSplit[sessionIdSplit.length - 1];
  return sessionId;
}

async function welcome(agent) {
  const sessionId = getSessionId(agent);

  let userInfo;
  await getUserInfo(sessionId).then(res => {
    userInfo = res;
  });

  if (userInfo && userInfo.name) {
    const name = userInfo.name;
    agent.add(
      `Oi ${name} Você gostaria de saber os valores dos serviços ou realizar um agendamento de banho ou tosa? Digite 1 para valores ou Digite 2 para agendar.`
    );
    agent.context.set({
      name: "MainMenuOptions",
      lifespan: 1
    });
    agent.context.set({
      name: "AskBuy",
      lifespan: 1
    });
    agent.context.set({
      name: "AskDate",
      lifespan: 1
    });
  } else {
    agent.add("Bem-vinda! Qual é o seu nome?");
    agent.context.set({
      name: "DefaultWelcomeIntent-followup",
      lifespan: 1
    });
    agent.context.set({
      name: "askname",
      lifespan: 1
    });
  }
}

async function nameHandler(agent) {
  const sessionId = getSessionId(agent);
  const { name } = agent.parameters;

  if (name) {
    await addUserInfo(sessionId, { name: name.name }).then(res => {
      agent.add(
        `Oi ${name.name} Você gostaria de saber os valores dos serviços ou realizar um agendamento de banho ou tosa? Digite 1 para valores ou Digite 2 para agendar.`
      );
    });
  } else {
    agent.add("Bem-vinda! Qual é o seu nome?");
    agent.context.set({
      name: "DefaultWelcomeIntent-followup",
      lifespan: 1
    });
    agent.context.set({
      name: "askname",
      lifespan: 1
    });
  }
}

function checkAvailableTimes(startTime) {
  let newStartTime = moment(startTime).hour(9);
  let dateTimeEnd = moment(startTime).hour(10);

  const lastTime = moment(startTime)
    .hour(17)
    .minutes(0)
    .seconds(0);

  const promises = [];

  for (let i = 0; dateTimeEnd.isSameOrBefore(lastTime); i++) {
    const promise = new Promise((resolve, reject) => {
      calendar.freebusy.query(
        {
          auth: serviceAccountAuth,
          resource: {
            items: [{ id: calendarId, busy: "Active" }],
            timeMin: newStartTime.toISOString(),
            timeMax: dateTimeEnd.toISOString()
          }
        },
        (err, calendarResponse) => {
          if (calendarResponse.data) {
            const calendarData = calendarResponse.data.calendars[calendarId];
            if (calendarData.busy.length === 0) {              
              resolve(moment(calendarResponse.data.timeMin).hour());
            } else {
              resolve(null);
            }
          }
        }
      );
    });

    newStartTime = newStartTime.hour(dateTimeEnd.hour());
    dateTimeEnd = dateTimeEnd.hour(newStartTime.hour() + 1);

    promises.push(promise);
  }

  return Promise.all(promises);
}

function makeAppointment(agent) {
  const startTime = moment(agent.parameters.date);
  const currentTime = moment();

  if (startTime.isSameOrAfter(currentTime, "day")) {
    return checkAvailableTimes(startTime)
      .then(res => {
        const timeStr = res
          .filter(elem => elem != null)
          .map(elem => elem + "h")
          .join(", ");

        agent.add(`Nós temos estes horários disponíveis: ${timeStr}`);
        agent.context.set({
          name: "asktime",
          lifespan: 1
        });
      })
      .catch(error => {
        console.log(error.message);
        agent.add(
          `Sinto muito, não há slots disponíveis. Por favor, tente uma data diferente.`
        );

        agent.context.set({
          name: "MainMenuOptions",
          lifespan: 1
        });
        agent.context.set({
          name: "AskDate",
          lifespan: 1
        });
      });
  } else {
    agent.add(
      `Parece uma data passada. Forneça uma data válida no formato dd/mm.`
    );

    agent.context.set({
      name: "MainMenuOptions",
      lifespan: 1
    });
    agent.context.set({
      name: "AskDate",
      lifespan: 1
    });
  }
}

function createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type) {
  return new Promise((resolve, reject) => {
    calendar.events.list(
      {
        auth: serviceAccountAuth,
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      },
      (err, calendarResponse) => {
        // Check if there is a event already on the Calendar
        if (err || calendarResponse.data.items.length > 0) {
          reject(
            err ||
              new Error(
                "O horário solicitado entra em conflito com outro compromisso."
              )
          );
        } else {
          // Create event for the requested time period
          calendar.events.insert(
            {
              auth: serviceAccountAuth,
              calendarId: calendarId,
              resource: {
                summary: `Agendado para ${appointment_type} Whatsapp Chatbot`,
                description: appointment_type,
                start: { dateTime: dateTimeStart },
                end: { dateTime: dateTimeEnd }
              }
            },
            (err, event) => {
              err ? reject(err) : resolve(event);
            }
          );
        }
      }
    );
  });
}

async function timeSelect(agent) {
  const appointment_type = agent.parameters.appointment_type;
  // Calculate appointment start and end datetimes (end = +1hr from start)
  const date = moment(agent.parameters.date).format("DD-MM-YYYY");
  const time = agent.parameters.time;

  const dateTimeStart = moment(`${date} ${time}:00:00`, "DD-MM-YYYY HH:mm:ss");
  const dateTimeEnd = moment(dateTimeStart).add(1, "hour");

  const timeSelected = agent.parameters.time;

  if (timeSelected >= 9 && timeSelected <= 16) {
    const appointmentTimeString = dateTimeStart.format("LLL");

    // Check the availibility of the time, and make an appointment if there is time on the calendar
    return createCalendarEvent(dateTimeStart, dateTimeEnd, appointment_type)
      .then(() => {
        agent.add(
          `Ótimo! O seu agendamento para o ${appointment_type} foi realizado com sucesso para o dia ${appointmentTimeString}`
        );
      })
      .catch(error => {
        console.log(error.message);
        agent.add(
          `Sinto muito, não há slots disponíveis para $ {appointmentTimeString}. Por favor, selecione um horário diferente.`
        );

        agent.context.set({
          name: "MakeAppointment-followup",
          lifespan: 1,
          parameters: {
            date: agent.parameters.date
          }
        });
        agent.context.set({
          name: "AskTime",
          lifespan: 1
        });
      });
  } else {
    agent.add(
      `Nosso expediente é das 9AM até às 5PM, por favor escolha um horário dentro deste período.`
    );

    agent.context.set({
      name: "MakeAppointment-followup",
      lifespan: 1,
      parameters: {
        date: agent.parameters.date
      }
    });
    agent.context.set({
      name: "AskTime",
      lifespan: 1
    });
  }
}

module.exports = {
  welcome,
  nameHandler,
  makeAppointment,
  timeSelect
};

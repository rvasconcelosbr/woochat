var admin = require("firebase-admin");

admin.initializeApp({
  credential: admin.credential.cert({
    type: "service_account",
    project_id: "vendedor-nppcrv",
    private_key_id: "8714a36b524882928e00366d96fbe25dfd9c6952",
    private_key:
      "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCoJe2cKUguzOPY\noDs94QF0ZXUso4aMT0fb1Sl6dBmjYG7IzY+3YF7SpT43qPwmqFC5bZHpbOtNEQCl\nU3yUi2Z9bs7po4rHmoz/azDYzY/SdHt/NagHrrm0wAMXaK28yzME+7UcgAwvacf5\nt0pdJRsFR8BL37MSbMO02UeiSKOOJVzYltPMj+l4eYmB5M0w9aafT1ZPv5nMbYRd\ntmNsMXLLPnIdCNaM7Wntcd19hwTeCbfOVwMrNHoa4Kt+TYPGTRe6Q87dbkKE9axW\nvbHOFfcdP9EcGaKdl8QAxyLrzppmUWp+d5IM/2lNQ3XBLElqvm5Ju5P18ASM360O\njSupg57/AgMBAAECggEACK14aebkKkIkVLwkLTPXpYr3ipe1LGLftFPNDFxB1yF1\nZi3cR7GUrdidnDVqLzvgJUmnI5Ly68BqYPMs3+T3zkEHMvM1M3WMPEGVvO09ibYS\n34REiSz2ZC0am70pENqzEIPwRf8XtzoFeiOAQMwBl9AATQoc4uEJEo66DdZ41lo4\nC15Dz/IxNCgnaRBXtiaLrVgoQLNlOgX/YtUU8tZZUK/rGQm1XxHit5U/tVJ8mYWO\n0XRKYZQhyHnrku7b6twN80YII6XBB7pxkzmZN8EgHtKfB50tf8zAS9U8aVonZKFD\njGySIa+ydYh13IVXhlqkX+uvZQ6Dc2+yZYYFxDwTJQKBgQDozYOwKO3Fy5Z+F5tX\nchEiGlBx+k4/vlv2iBG0cWO8ZYKJSGg/73xPJG9ged0uzPKLr6nBCu7yxfQpktrE\nMBSnEeSzOea8Be8oKzMfGSVXTVmonLlTOdU0f9a7ScAYRZJN4Qbu2KcS111ovN/L\nvK+sLD7pbfGVa5hWL3lks/HbmwKBgQC45ylAqdO7HpXytfV8KtV+Tv1vD6T0ETsK\nJRVkPad23VVjt+rMOJoOme6ywyJ0tvfi3M3+m1tje9n/SbbH4jdrhhJ6MEw4dcFZ\nd6+g0luZESBjcXIqJr8ic51xAxZ2aYL8pYEycW2bye865k9JvbAW1YNHIWbJTqG2\n7pZir9g6bQKBgDjPljhR9JxVL1d7+UugqW+yDjmSRLAnixehYviuxxD9kJph0hbw\nIVzK3mcjtgcqunG+H2Xdfiw+hHP0w3Am75NJuY7HLXhq1k7uI96N61/fn2aXQF5/\n+XiDTeqMd9U0fRyGMoPs2PCvH7tkhBSa6h/Q+FVMoCy/ggBeO3iItRfLAoGAMItQ\nA1AS7I+NIpmvB5hfULgARYY/8mwLqhAuW5DsRIK7hmCk3lUF7UtwpbIhe68FyaPa\n2TuEdMvxYdrCiBvWHP6oHzhK6o/P4WNQ0tInhjo+3JzOMk7V43+jGCaNYS02XIo/\nLzUkZ8BOdJI+wsdwUa5gtu4IBFYGkvZ0uRgdlskCgYEArligT8CNlX1xdjZKD6++\nJgN49L4Grm0AKciG8neezacpOzNFAc5BVtKLo/flM3EaJ3rCfifmMg6+nmXZ7nL4\njsJ0caJVIcPXrXr8Vwqf+py/PW5G2xP3KFpX5QgxTejEoBAlw2s2ZDbVeS9gZRMn\n3hU6sWqwXONnGwWKQXlALjc=\n-----END PRIVATE KEY-----\n",
    client_email:
      "firebase-adminsdk-u3q79@vendedor-nppcrv.iam.gserviceaccount.com",
    client_id: "100316177078652763259",
    auth_uri: "https://accounts.google.com/o/oauth2/auth",
    token_uri: "https://oauth2.googleapis.com/token",
    auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
    client_x509_cert_url:
      "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-u3q79%40vendedor-nppcrv.iam.gserviceaccount.com"
  }),
  databaseURL: "https://vendedor-nppcrv.firebaseio.com"
});

const usersRef = admin
  .database()
  .ref("/")
  .child("users");

async function addUserInfo(userId, userInfo) {
  return await usersRef
    .child(userId)
    .set(userInfo)
    .then(res => true)
    .catch(err => false);
}

async function getUserInfo(userId) {
  return await usersRef
    .child(userId)
    .once("value")
    .then(res => res.val())
    .catch(err => undefined);
}

module.exports = {
  addUserInfo,
  getUserInfo
};

var admin = require("firebase-admin");

var serviceAccount = require("../smarthubkey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports=admin
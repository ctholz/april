const app = require('../app');
const client = require('../twilioClient');

console.log("Starting...\n");

// Send test message to the admin
//var msg = process.argv.slice(2).join(' ');
//client.sendSMS("+17134126344", msg || "TEST");


// Receive test message
var msg = "I will be a great programmer."
client.receiveSMS(1234)
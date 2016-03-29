var config = require('./config/config')();
var client = require('twilio')(config.twilio.account_sid, config.twilio.auth_token);

module.exports.sendSMS = function(to, message) {
  client.messages.create({
    body: message,
    to: to,
    from: config.twilio.number
    // mediaUrl: 'http://www.yourserver.com/someimage.png'
  }, function(err, data) {
    if (err) {
      console.error('Could not notify administrator');
      console.error(err);
    } else {
      console.log('Message sent: \n',data,'\n');
    }
  });
};


module.exports.receiveSMS = function(message_sid, from_number, to_number, body) {
  from_number = from_number || "+17134126344";
  to_number = to_number || "+17134126344";
  body = body || "DEFAULT";

  console.log("Received.")
};
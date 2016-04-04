/* Cron - calls Goal Routine, requires method name as CLI parameter
 * ----------------------------------------------------------------
 *
 */

var request = require('request');
var root_url = (process.env.NODE_ENV) ? 'https://ohbehave.herokuapp.com' : 'http://localhost:3000';

if (process.argv.length < 3)
	return console.error("\n[ Error ]... Need to input the goal routine path.\n");

var req_path = '/routines/goal/' + process.argv[2];

console.log("\n[ Requesting ]... " + root_url + req_path + '\n');

request(root_url + req_path, function(err, res, body) {
	if (err)
		console.error("[ Error ]... ",err);
	else {
		console.log("Code: [ " + res.statusCode + " ] \nBody: ", body, "\n");
	}
});

/* Cron - calls Goal Routine, requires method name as CLI parameter
 * ----------------------------------------------------------------
 *
 */

var request = require('request');

const config = require('../../../config/config')();
const root_url = config.root_url;

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

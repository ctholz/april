/* Cron - calls Mantra routine
 * ----------------------------------------------------------------
 * Input: method to call, not required
 */

var request = require('request');

const config = require('../../../config/config')();
const root_url = config.root_url;

var req_path = '/routines/mantra/';

// Check if input method, otherwise default to none
if (process.argv.length > 2)
	req_path += process.argv[2];

console.log("\n[ Requesting ]... " + root_url + req_path + '\n');

request(root_url + req_path, function(err, res, body) {
	if (err)
		console.error("[ Error ]... ",err);
	else {
		console.log("Code: [ " + res.statusCode + " ] \nBody: ", body, "\n");
	}
});

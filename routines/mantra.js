/* /routines/mantra
 * ----------------
 * Basic daily affirmation routine
 */

'use strict'

const twilio_client = require('../twilioClient');
const db = require('../data/db');
// const parse = require('co-body');
const config = require('../config/config')();


module.exports = {

	remind: function *() {

		var mantra = yield db.Note.find({ tag: 'mantra' }).sort({ _id: -1 }).limit(1);
		
		// TODO - what to do if you don't have a mantra set
		if (mantra.length == 0)
			return;

		mantra = mantra[0];

		twilio_client.sendSMS(config.twilio.admin, "#mantra " + mantra.body);
		this.status = 200;
	},

	prompt: function *() {

	},

	set: function *() {

	}
}
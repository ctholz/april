/*
    Goal Routine
    ------------
    API: 
       open
       create
       remind
       close
       update
*/
'use strict'

const twilio_client = require('../twilioClient');
const db = require('../data/db');
const parse = require('co-body');
const config = require('../config/config')();

module.exports = {

	open: function *() {

		twilio_client.sendSMS(config.twilio.admin, "What is the ONE Thing you could be doing today such that everything else will become easier or unecessary?")

		try {
			// Fetch current routineState
			const routineState = yield db.RoutineState.findOne()
			// TODO - what if routineState is missing?

			// Update routineState to next step
			yield routineState.update({ callback: '/routines/goal/create' })
		}
		catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}
	},

	create: function *() {
		try {
			var res = yield parse(this);

			var goal = yield db.Goal.create({ body: res['Body'], complete: false });

			console.log("Goal created: ",goal,"\n\n");

			const routineState = yield db.RoutineState.findOne();

			yield routineState.update({ routine: 'default', callback: '/routine/default' })

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}
	},

	remind: function *() {
		try {
			// TODO - find TODAY's goal 
			var today = new Date();
			today.setHours(0);
			var goal = yield db.Goal.find({ created_at: { "$gte": today }}).sort('-created_at');
			
			var message = (goal.length == 0) ? "GOAL NOT FOUND" : goal[0].body;

			return twilio_client.sendSMS("+17134126344", "Goal Reminder: " + message);

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}

	},

	close: function *() {
		try {
			var today = new Date();
			today.setHours(0);
			
			var goal = yield db.Goal.find({ created_at: { "$gte": today }}).sort('-created_at');
			var message = (goal.length == 0) ? "GOAL NOT FOUND" : goal[0].body;

			twilio.client.sendSMS(config.twilio.admin, "Today's goal was: '" + message + "' How'd you do?");

			const routineState = yield db.RoutineState.findOne();
			yield routineState.update({ routine: 'goal', callback: '/routines/goal/update' });

			return;

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}
	},

	update: function *() {

		try {

		} catch(err) {

		}

	}
}
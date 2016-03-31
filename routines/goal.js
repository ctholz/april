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

			var goal = yield db.Goal.find({ created_at: { "$gte": get_today_delineator() }}).sort('-created_at');
			
			var message = (goal.length == 0) ? "GOAL NOT FOUND" : goal[0].body;

			twilio_client.sendSMS("+17134126344", "Goal Reminder: " + message);

			this.status = 200;

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}

	},

	close: function *() {
		try {

			var goal = yield db.Goal.find({ created_at: { "$gte": get_today_delineator() }}).sort('-created_at');
			var message = (goal.length == 0) ? "GOAL NOT FOUND" : goal[0].body;

			twilio_client.sendSMS(config.twilio.admin, "Today's goal was: '" + message + "' Did you complete it?");

			const routineState = yield db.RoutineState.findOne();
			yield routineState.update({ routine: 'goal', callback: '/routines/goal/update' });

			this.status = 200;
			return;

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}
	},

	update: function *() {

		// V1: assumed response format: "Y, it was a good day."
		const delineator = ", ";

		try {
			var goal = yield db.Goal.find({ created_at: { "$gte": get_today_delineator() }}).sort('-created_at');
			if (goal.length == 0) {
				return console.error("[ Error ]... No goal for today found.");
			} else {
				goal = goal[0];
			}

			var res = yield parse(this);

			// Simple validation
			if (res['Body'].split(delineator).length < 2) {
				twilio_client.sendSMS(config.twilio.admin, "No delineator found. Response should look like: 'Y, your notes here.'");
				this.status = 400;
				return;
			}

			// Parse input
			var completed = res['Body'].split(delineator)[0].toLowerCase().startsWith('y');
			var notes = res['Body'].split(delineator)[1];

			// Update goal document
			yield goal.update({ completed: completed, notes: notes });

			// Reset routine state
			yield db.RoutineState.findOneAndUpdate({ routine: 'default', callback: '/routine/default' })

			console.log("@/routines/goal/update | Goal: {completed: " + completed + ", notes: " + notes + "}");

			this.status = 200;
			return;

		} catch(err) {
			console.error("[ Error ]... @" + this.path + " - ",err)
		}
	}
}


function get_today_delineator() {
	var today = new Date();
	today.setHours(0);
	return today;
};
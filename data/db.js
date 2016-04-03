
/* Database Initializer */
'use strict';

var mongoose = require("mongoose");
var uristring = process.env.MONGOLAB_URI || 'mongodb://localhost/development';

// Connect Mongo
mongoose.connect(uristring, function(err, res) {
	if (err)
		console.error("ERROR connecting to Mongo: ",uristring," - ",err);
	else
		console.log("Successfully connected to Mongo.");
});


/* Define Model: Note */
var noteSchema = new mongoose.Schema({
	created_at: { type: Date, default: Date.now },
	body: String,
	tag: String,
	media: [String]
});

/* Define Model: Goal */
var goalSchema = new mongoose.Schema({
	created_at: { type: Date, default: Date.now },
	body: String,
	completed: Boolean,
	notes: String
});

/* Define model: RoutineState */
	// NOTE: global, not long term
var routineStateSchema = new mongoose.Schema({
	callback: { type: String, default: '/routine/default'},
	routine: { type: String, default: 'default' },
	updated_at: { type: Date, default: Date.now }
});

/* Instantiate Models */
var Note = mongoose.model('Note', noteSchema);
var Goal = mongoose.model('Goal', goalSchema);
var RoutineState = mongoose.model('RoutineState', routineStateSchema);

// TODO - model validation

/* Export Models */
module.exports = {
	'Goal': Goal,
	'Note': Note,
	'RoutineState': RoutineState
};


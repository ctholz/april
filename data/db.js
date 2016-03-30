
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


/* Define Model: note */
var noteSchema = new mongoose.Schema({
	created_at: { type: Date, default: Date.now },
	body: String
});

/* Define Model: goal */
var goalSchema = new mongoose.Schema({
	created_at: { type: Date, default: Date.now },
	body: String,
	completed: Boolean,
	notes: String
});

/* Instantiate Models */
var Note = mongoose.model('Note', noteSchema);
var Goal = mongoose.model('Goal', goalSchema);


// TODO - model validation

/* Export Models */
module.exports = {
	'Goal': Goal,
	'Note': Note
};


'use strict';
const views = require('co-views');
const parse = require('co-body');
const db = require('../data/db');

/* Routing Boilerplate */
const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});


module.exports.home = function *home(ctx) {
  
  // Fetch notes
  var notes = yield db.Note.find({archived: {$ne: true}}).sort({ _id: -1 })
  
  // Fetch today's goal
  var goal = yield db.Goal.find({ "completed": { "$exists": false } }).sort('-created_at');
  goal = (goal.length == 0) ? null : goal[0]

  // Fetch tags, uniqify using Set
  var tags = new Set();
  if (notes) notes.forEach(function(note) { if (note.tag) tags.add(note.tag) });
  tags = Array.from(tags);

  // Render
  this.body = yield render('list', {
    'notes': notes,
    'goal': goal,
    'tags': tags
  });
};

module.exports.list = function *list() {
  this.body = yield db.Note.find(function(err, notes) {
    if (err)
      console.error("Error fetching NOTES - ",err);
  })
};

module.exports.fetch = function *fetch(id) {

  // TODO - validation/error handling here

  var ctx = this;

  this.body = yield db.Note.findById(id, function(err, note) {
    if (err) 
      ctx.throw(500, 'error retriving ' + id + '.');
    if (!note)
      ctx.throw(404, 'note with id = ' + id + ' not found.');
  });

  // const message = messages[id];
  // if (!message) {
  //   this.throw(404, 'message with id = ' + id + ' was not found');
  // }
  // this.body = yield message;
};

/* ENDPOINT: delete note */
module.exports.delete = function *(id) {
  try {
      yield db.Note.findByIdAndRemove(id);
      this.redirect('/');
  } catch (err) {
    console.error("[ Error ]... @" + this.path + " removing Note id = " + id + " - " + err);
  }
};

/* ENDPOINT: create note */
module.exports.create = function *create() {

  var res = yield parse(this);

  // Check if media in body
  var media = [];
  if ('NumMedia' in res && parseInt(res['NumMedia']) > 0) {
    for (var i = 0; i < parseInt(res['NumMedia']); i++) {
      media.push(res['MediaUrl' + i])
    }
  };

  // Parse tag, if any, from note
    // Regex *should* match #tag body
  var tag_regex = /^#(\S+)\s(.*)/;
  
  var fields = function(match) {
    return {
      tag: (match) ? match[1] : null,
      body: (match) ? match[2] : res['Body'],
      media: media,
      archived: false
    }
  }(res['Body'].match(tag_regex));

  yield db.Note.create(fields, function(err, note) {
    if (err) console.error("Error creating new note: ",err);
    else console.log("New NOTE created: ", note);
  });

  this.redirect('/');
};


/* JSON endpoint for archiving a note */
module.exports.archive = function *archive(id) {
  try {
      yield db.Note.findByIdAndUpdate(id, { archived: true })
      this.status = 200;
  } catch (err) {
    console.error("[ Error ]... @" + this.path + " archiving Note id = " + id + " - " + err);
  }

};



/* This came stock with the scaffolding... 
 * not sure what it is used for
 */
const asyncOperation = () => callback =>
  setTimeout(
    () => callback(null, 'this was loaded asynchronously and it took 2 seconds to complete'),
    2000);

const returnsPromise = () =>
  new Promise((resolve, reject) =>
    setTimeout(() => resolve('promise resolved after 2 seconds'), 2000));

module.exports.delay = function *delay() {
  this.body = yield asyncOperation();
};

module.exports.promise = function *promise() {
  this.body = yield returnsPromise();
};

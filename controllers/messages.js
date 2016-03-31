'use strict';
const views = require('co-views');
const parse = require('co-body');
const db = require('../data/db');

/* Routing Boilerplate */
const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});


module.exports.home = function *home(ctx) {
  var notes = yield db.Note.find()
  var today = new Date();
  today.setHours(0);
  var goal = yield db.Goal.find({ created_at: { "$gte": today }}).sort('-created_at');

  // TODO - clean up the process of fetching today's goal
  this.body = yield render('list', { 'notes': notes, 'goal': (goal.length == 0) ? null : goal[0] });
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

  console.log("Res: ",res)

  // For Twilio compatibility
  var body = ('Body' in res) ? res['Body'] : res.message;

  yield db.Note.create({ body: body }, function(err, note) {
    if (err) console.error("Error creating new note: ",err);
    else console.log("New NOTE created: ", note);
  });

  this.redirect('/');

  // const message = yield parse(this);
  // const id = messages.push(message) - 1;
  // message.id = id;
  // this.redirect('/');
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

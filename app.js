'use strict';
const messages = require('./controllers/messages');
const responses = require('./controllers/responses');
const routines = require('./routines');
const compress = require('koa-compress');
const logger = require('koa-logger');
const serve = require('koa-static');
const route = require('koa-route');
const koa = require('koa');
const path = require('path');
const app = module.exports = koa();

// CH 
const config = require('./config/config')();
const twilioNotifications = require('./middleware/twilioNotifications')
// const db = require('./data/db');

// Logger
app.use(logger());

// Twilio
//app.use(twilioNotifications.notifyOnError);

app.use(route.get('/', messages.home));
app.use(route.get('/messages', messages.list));
app.use(route.get('/messages/:id', messages.fetch));
app.use(route.delete('/messages/:id', messages.delete));
app.use(route.post('/messages', messages.create));
app.use(route.get('/async', messages.delay));
app.use(route.get('/promise', messages.promise));

// CH - Routes
app.use(route.post('/process', responses.process));

app.use(route.all('/routines/goal/open', routines.goal.open));
app.use(route.all('/routines/goal/create', routines.goal.create));
app.use(route.all('/routines/goal/remind', routines.goal.remind)); // Really should be GET only
app.use(route.all('/routines/goal/close', routines.goal.close));
app.use(route.all('/routines/goal/update', routines.goal.update));
app.use(route.all('/routines/goal/', routines.goal.open)); // Default route in case callback set improperly

app.use(route.get('/routines/mantra', routines.mantra.remind)); // Default route

// Serve static files
app.use(serve(path.join(__dirname, 'public')));


// Compress
app.use(compress());

// Logging
app.use(function *() {
	console.log("[ Routing ]... '" + this.path + "'");
});

if (!module.parent) {
   app.listen(config.env.port);
}

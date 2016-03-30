'use strict';
const messages = require('./controllers/messages');
const responses = require('./controllers/responses');

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
app.use(route.post('/messages', messages.create));
app.use(route.get('/async', messages.delay));
app.use(route.get('/promise', messages.promise));

// CH - Routes
app.use(route.post('/process', responses.process));

// Serve static files
app.use(serve(path.join(__dirname, 'public')));


// Compress
app.use(compress());

if (!module.parent) {
   app.listen(config.env.port);
}

/* -- Response Controller --
 * Handles POST's from Twilio SMS Responses
 * 
 *
 */


'use strict';
const views = require('co-views');
const parse = require('co-body');
const twilioClient = require('../twilioClient');
const db = require('../data/db');

const render = views(__dirname + '/../views', {
  map: { html: 'swig' }
});


module.exports.process = function *process() {

  /* IF REDIRECTING, make sure to set status to 307 */

  try {
     const routineState = yield db.RoutineState.findOne();
     console.log("@responses/process, routineState = ",routineState);

     if (!routineState || routineState.routine == 'default') {
      this.status = 307;
      return this.redirect('/messages');

     } else {

      if (routineState.routine == 'goal') {
        this.status = 307;
        return this.redirect(routineState.callback);
       } else {
          return console.error("Error: routineState doesn't match - ",routineState);
       }
     }
  }
  catch(err) {
    console.error("Error finding routineState - ",err);
    return ctx.throw(500)
  }

  // Construct TWIML response
  // var response = new twilioClient.TwimlResponse();
  // console.log('\n\n Exited the generator...',routineState,'\n\n');
};



/** Copied from original boilerplate... still no idea what these do **/

// const asyncOperation = () => callback =>
//   setTimeout(
//     () => callback(null, 'this was loaded asynchronously and it took 2 seconds to complete'),
//     2000);

// const returnsPromise = () =>
//   new Promise((resolve, reject) =>
//     setTimeout(() => resolve('promise resolved after 2 seconds'), 2000));

// module.exports.delay = function *delay() {
//   this.body = yield asyncOperation();
// };

// module.exports.promise = function *promise() {
//   this.body = yield returnsPromise();
// };

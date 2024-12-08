/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

// const {onRequest} = require("firebase-functions/v2/https");
// const logger = require("firebase-functions/logger");

// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

const ticket_purchases = require('./ticket_purchases');
const add_events = require('./admin/add_events');
const delete_events = require('./admin/delete_events');
const update_events = require('./admin/update_events');

exports.purchaseTicket = ticket_purchases.purchaseTicket;
exports.addEvent = add_events.addEvent;
exports.deleteEvent = delete_events.deleteEvent;
exports.updateEvent = update_events.updateEvent;
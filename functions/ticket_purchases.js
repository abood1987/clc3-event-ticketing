const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.purchaseTicket = functions.https.onCall(async (data, context) => {
  // Check if the user is authenticated
  if (!context.auth) {
    throw new functions.https.HttpsError('unauthenticated', 'The function must be called while authenticated.');
  }

  const { eventId, numberOfTickets } = data;
  if (!eventId || numberOfTickets <= 0) {
    throw new functions.https.HttpsError('invalid-argument', 'The function must be called with event ID and a positive number of tickets.');
  }

  const eventRef = admin.firestore().collection('Events').doc(eventId);
  try {
    await admin.firestore().runTransaction(async (transaction) => {
      const eventDoc = await transaction.get(eventRef);
      if (!eventDoc.exists) {
        throw new functions.https.HttpsError('not-found', 'Event not found');
      }
      const event = eventDoc.data();
      if (event.ticketsRemaining < numberOfTickets) {
        throw new functions.https.HttpsError('resource-exhausted', 'Not enough tickets available');
      }

      transaction.update(eventRef, {
        ticketsRemaining: event.ticketsRemaining - numberOfTickets
      });

      const transactionRef = admin.firestore().collection('Transactions').doc();
      transaction.set(transactionRef, {
        eventId,
        userId: context.auth.uid,
        numberOfTickets,
        transactionDate: admin.firestore.FieldValue.serverTimestamp()
      });
    });
    return { result: 'Ticket purchase successful' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

const functions = require('firebase-functions');

exports.deleteEvent = functions.https.onCall((data, context) => {
    // Check if the user is authenticated and has an admin role
    if (!context.auth || context.auth.token.admin !== true) {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can delete events.');
    }
  
    const eventId = data.eventId;
    if (!eventId) {
      throw new functions.https.HttpsError('invalid-argument', 'Event ID must be provided.');
    }
  
    return admin.firestore().collection('Events').doc(eventId).delete()
      .then(() => {
        return { result: `Event with ID: ${eventId} successfully deleted.` };
      })
      .catch(error => {
        throw new functions.https.HttpsError('internal', error.message);
      });
  });
  
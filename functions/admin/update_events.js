const functions = require('firebase-functions');

exports.updateEvent = functions.https.onCall((data, context) => {
    // Verify the user is authenticated and has an admin role
    if (!context.auth || context.auth.token.admin !== true) {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can update events.');
    }
  
    const eventId = data.eventId;
    if (!eventId) {
      throw new functions.https.HttpsError('invalid-argument', 'Event ID must be provided.');
    }
  
    // Prepare the data to be updated; ensure not to overwrite ticketsRemaining unintentionally
    const updateData = {};
    if (data.name) updateData.name = data.name;
    if (data.date) updateData.date = data.date;
    if (data.time) updateData.time = data.time;
    if (data.location) updateData.location = data.location;
    if (data.price) updateData.price = data.price;
    if (data.totalTickets) {
      updateData.totalTickets = data.totalTickets;
      updateData.ticketsRemaining = data.totalTickets; // Reset ticketsRemaining when totalTickets is changed
    }
  
    return admin.firestore().collection('Events').doc(eventId).update(updateData)
      .then(() => {
        return { result: `Event with ID: ${eventId} successfully updated.` };
      })
      .catch(error => {
        throw new functions.https.HttpsError('internal', error.message);
      });
  });
  
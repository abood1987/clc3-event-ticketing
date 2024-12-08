const functions = require('firebase-functions');

exports.addEvent = functions.https.onCall((data, context) => {
    // Check if the user is authenticated and an admin
    if (!context.auth || context.auth.token.admin !== true) {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can add events.');
    }
  
    const newEventData = {
      name: data.name,
      date: data.date,
      time: data.time,
      location: data.location,
      price: data.price,
      totalTickets: data.totalTickets,
      ticketsRemaining: data.totalTickets // Initially, ticketsRemaining equals totalTickets
    };
  
    return admin.firestore().collection('Events').add(newEventData)
      .then(docRef => {
        return { result: `Event created with ID: ${docRef.id}` };
      })
      .catch(error => {
        throw new functions.https.HttpsError('internal', error.message);
      });
  });
  
const functions = require('firebase-functions');

exports.addEvent = functions.https.onCall((data, context) => {
    // Check if the user is authenticated and an admin
    if (!context.auth || context.auth.token.admin !== true) {
      throw new functions.https.HttpsError('permission-denied', 'Only admins can add events.');
    }
  
    const newEventData = {
      name: data.name,
      datetime: data.datetime,
      location: data.location,
      price: data.price,
      totalTickets: data.totalTickets,
      ticketsRemaining: data.totalTickets // Initially, ticketsRemaining equals totalTickets
    };

    // Validate the datetime format (optional, based on your specific needs)
    if (!newEventData.datetime || new Date(newEventData.datetime).toString() === "Invalid Date") {
      throw new functions.https.HttpsError('invalid-argument', 'Invalid datetime format provided.');
    }
  
    return admin.firestore().collection('Events').add(newEventData)
      .then(docRef => {
        return { result: `Event created with ID: ${docRef.id}` };
      })
      .catch(error => {
        throw new functions.https.HttpsError('internal', error.message);
      });
  });
  
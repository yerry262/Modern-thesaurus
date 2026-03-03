const admin = require('firebase-admin');

let db;

function initFirebase() {
  if (admin.apps.length > 0) {
    db = admin.app().firestore();
    return db;
  }

  const projectId = process.env.FIREBASE_PROJECT_ID;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY
    ? process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
    : undefined;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;

  if (!projectId || !privateKey || !clientEmail) {
    console.warn('Firebase credentials not fully configured. Using mock data mode.');
    return null;
  }

  admin.initializeApp({
    credential: admin.credential.cert({
      projectId,
      privateKey,
      clientEmail,
    }),
  });

  db = admin.firestore();
  return db;
}

function getDb() {
  if (!db) {
    return initFirebase();
  }
  return db;
}

module.exports = { initFirebase, getDb };

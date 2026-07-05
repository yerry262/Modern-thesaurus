const admin = require('firebase-admin');

let db;
let initialized = false;

function initFirebase() {
  initialized = true;

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
    // Once initialization has been attempted, don't re-run initFirebase()
    // (which would re-log the mock-mode warning on every request). In mock
    // mode db stays undefined, so return null after the one-time attempt.
    if (initialized) {
      return null;
    }
    return initFirebase();
  }
  return db;
}

module.exports = { initFirebase, getDb };

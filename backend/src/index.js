require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { initFirebase } = require('./firebase');
const entriesRouter = require('./routes/entries');

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Firebase
initFirebase();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/entries', entriesRouter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Modern Thesaurus API running on port ${PORT}`);
});

module.exports = app;

const express = require('express');
const router = express.Router();
const { getDb } = require('../firebase');

// In-memory mock store for when Firebase is not configured
const mockEntries = [];
let mockIdCounter = 1;

function useMock() {
  return !getDb();
}

const DAY_IN_MS = 24 * 60 * 60 * 1000;
const WEEK_IN_MS = 7 * DAY_IN_MS;

// GET /api/entries?period=day|week
router.get('/', async (req, res) => {
  try {
    const period = req.query.period || 'day';
    const now = Date.now();
    const cutoff = now - (period === 'week' ? WEEK_IN_MS : DAY_IN_MS);

    if (useMock()) {
      const filtered = mockEntries
        .filter((e) => e.createdAt >= cutoff)
        .sort((a, b) => b.upvotes - a.upvotes);
      return res.json(filtered);
    }

    const db = getDb();
    const snapshot = await db
      .collection('entries')
      .where('createdAt', '>=', cutoff)
      .orderBy('createdAt', 'desc')
      .get();

    const entries = [];
    snapshot.forEach((doc) => {
      entries.push({ id: doc.id, ...doc.data() });
    });

    entries.sort((a, b) => b.upvotes - a.upvotes);
    res.json(entries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch entries' });
  }
});

// GET /api/entries/search?q=term  (must be before /:id routes)
router.get('/search', async (req, res) => {
  try {
    const q = (req.query.q || '').toLowerCase().trim();
    if (!q) return res.json([]);

    if (useMock()) {
      const results = mockEntries.filter(
        (e) =>
          e.word.toLowerCase().includes(q) ||
          e.definition.toLowerCase().includes(q)
      );
      return res.json(results);
    }

    const db = getDb();
    const snapshot = await db.collection('entries').get();
    const results = [];
    snapshot.forEach((doc) => {
      const data = doc.data();
      if (
        data.word.toLowerCase().includes(q) ||
        data.definition.toLowerCase().includes(q)
      ) {
        results.push({ id: doc.id, ...data });
      }
    });
    res.json(results);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to search entries' });
  }
});

// POST /api/entries
router.post('/', async (req, res) => {
  try {
    const { word, definition, example, author } = req.body;
    if (!word || !definition) {
      return res.status(400).json({ error: 'word and definition are required' });
    }

    const entry = {
      word: word.trim(),
      definition: definition.trim(),
      example: example ? example.trim() : '',
      author: author ? author.trim() : 'Anonymous',
      upvotes: 0,
      downvotes: 0,
      commentCount: 0,
      createdAt: Date.now(),
    };

    if (useMock()) {
      const newEntry = { id: String(mockIdCounter++), ...entry };
      mockEntries.unshift(newEntry);
      return res.status(201).json(newEntry);
    }

    const db = getDb();
    const docRef = await db.collection('entries').add(entry);
    res.status(201).json({ id: docRef.id, ...entry });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to create entry' });
  }
});

// POST /api/entries/:id/vote
router.post('/:id/vote', async (req, res) => {
  try {
    const { id } = req.params;
    const { type } = req.body;
    if (type !== 'up' && type !== 'down') {
      return res.status(400).json({ error: 'type must be "up" or "down"' });
    }

    if (useMock()) {
      const entry = mockEntries.find((e) => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      if (type === 'up') entry.upvotes += 1;
      else entry.downvotes += 1;
      return res.json(entry);
    }

    const db = getDb();
    const docRef = db.collection('entries').doc(id);
    const doc = await docRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Entry not found' });

    const field = type === 'up' ? 'upvotes' : 'downvotes';
    await docRef.update({ [field]: (doc.data()[field] || 0) + 1 });
    const updated = await docRef.get();
    res.json({ id: updated.id, ...updated.data() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to vote' });
  }
});

// GET /api/entries/:id/comments
router.get('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;

    if (useMock()) {
      const entry = mockEntries.find((e) => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      return res.json(entry.comments || []);
    }

    const db = getDb();
    const snapshot = await db
      .collection('entries')
      .doc(id)
      .collection('comments')
      .orderBy('createdAt', 'asc')
      .get();

    const comments = [];
    snapshot.forEach((doc) => comments.push({ id: doc.id, ...doc.data() }));
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to fetch comments' });
  }
});

// POST /api/entries/:id/comments
router.post('/:id/comments', async (req, res) => {
  try {
    const { id } = req.params;
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ error: 'text is required' });

    const comment = {
      text: text.trim(),
      author: author ? author.trim() : 'Anonymous',
      createdAt: Date.now(),
    };

    if (useMock()) {
      const entry = mockEntries.find((e) => e.id === id);
      if (!entry) return res.status(404).json({ error: 'Entry not found' });
      if (!entry.comments) entry.comments = [];
      const newComment = { id: String(Date.now()), ...comment };
      entry.comments.push(newComment);
      entry.commentCount = entry.comments.length;
      return res.status(201).json(newComment);
    }

    const db = getDb();
    const entryRef = db.collection('entries').doc(id);
    const doc = await entryRef.get();
    if (!doc.exists) return res.status(404).json({ error: 'Entry not found' });

    const commentRef = await entryRef.collection('comments').add(comment);
    await entryRef.update({ commentCount: (doc.data().commentCount || 0) + 1 });
    res.status(201).json({ id: commentRef.id, ...comment });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

module.exports = router;

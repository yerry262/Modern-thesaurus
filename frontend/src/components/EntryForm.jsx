import React, { useState } from 'react';
import { createEntry } from '../api';

function EntryForm({ onEntryCreated, onClose }) {
  const [word, setWord] = useState('');
  const [definition, setDefinition] = useState('');
  const [example, setExample] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!word.trim() || !definition.trim()) {
      setError('Word and definition are required.');
      return;
    }
    setSubmitting(true);
    setError('');
    try {
      const entry = await createEntry({
        word: word.trim(),
        definition: definition.trim(),
        example: example.trim(),
        author: author.trim() || 'Anonymous',
      });
      onEntryCreated(entry);
      setWord('');
      setDefinition('');
      setExample('');
      setAuthor('');
      onClose();
    } catch (e) {
      setError('Failed to create entry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Add New Word</h2>
          <button className="modal-close" onClick={onClose} aria-label="Close">
            ✕
          </button>
        </div>

        {error && <p className="error-msg">{error}</p>}

        <form className="entry-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="word">Word *</label>
            <input
              id="word"
              type="text"
              placeholder="e.g. salty"
              value={word}
              onChange={(e) => setWord(e.target.value)}
              disabled={submitting}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="definition">Definition *</label>
            <textarea
              id="definition"
              placeholder="What does it mean?"
              value={definition}
              onChange={(e) => setDefinition(e.target.value)}
              disabled={submitting}
              rows={3}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="example">Example</label>
            <input
              id="example"
              type="text"
              placeholder="Use it in a sentence…"
              value={example}
              onChange={(e) => setExample(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="author">Your Name</label>
            <input
              id="author"
              type="text"
              placeholder="Anonymous"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              {submitting ? 'Submitting…' : 'Submit'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EntryForm;

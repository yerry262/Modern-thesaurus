import React, { useState, useEffect, useCallback } from 'react';
import { addComment, getComments } from '../api';

function CommentSection({ entryId, initialCount }) {
  const [comments, setComments] = useState(null);
  const [loading, setLoading] = useState(false);
  const [text, setText] = useState('');
  const [author, setAuthor] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const loadComments = useCallback(async () => {
    if (comments !== null) return;
    setLoading(true);
    try {
      const data = await getComments(entryId);
      setComments(data);
    } catch (e) {
      setError('Failed to load comments.');
    } finally {
      setLoading(false);
    }
  }, [entryId, comments]);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;
    setSubmitting(true);
    setError('');
    try {
      const newComment = await addComment(entryId, {
        text: text.trim(),
        author: author.trim() || 'Anonymous',
      });
      setComments((prev) => [...(prev || []), newComment]);
      setText('');
      setAuthor('');
    } catch (e) {
      setError('Failed to add comment.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="comment-section">
      <h4 className="comment-title">
        Comments {comments !== null ? `(${comments.length})` : `(${initialCount || 0})`}
      </h4>

      {error && <p className="error-msg">{error}</p>}

      {loading && <p className="loading-text">Loading comments…</p>}

      {comments && comments.length === 0 && (
        <p className="no-comments">No comments yet. Be the first!</p>
      )}

      {comments && comments.length > 0 && (
        <ul className="comment-list">
          {comments.map((c) => (
            <li key={c.id} className="comment-item">
              <span className="comment-author">{c.author}</span>
              <span className="comment-text">{c.text}</span>
            </li>
          ))}
        </ul>
      )}

      <form className="comment-form" onSubmit={handleSubmit}>
        <input
          className="comment-input"
          type="text"
          placeholder="Your name (optional)"
          value={author}
          onChange={(e) => setAuthor(e.target.value)}
          disabled={submitting}
        />
        <div className="comment-row">
          <input
            className="comment-input comment-text-input"
            type="text"
            placeholder="Add a comment…"
            value={text}
            onChange={(e) => setText(e.target.value)}
            disabled={submitting}
            required
          />
          <button className="btn btn-primary comment-submit" type="submit" disabled={submitting}>
            {submitting ? '…' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default CommentSection;

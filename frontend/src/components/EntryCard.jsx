import React, { useState } from 'react';
import { voteEntry } from '../api';
import CommentSection from './CommentSection';

function EntryCard({ entry, onVote }) {
  const [expanded, setExpanded] = useState(false);
  const [voting, setVoting] = useState(false);
  const [localEntry, setLocalEntry] = useState(entry);

  // Keep local entry in sync when parent updates
  React.useEffect(() => {
    setLocalEntry(entry);
  }, [entry]);

  const handleVote = async (type, e) => {
    e.stopPropagation();
    if (voting) return;
    setVoting(true);
    try {
      const updated = await voteEntry(localEntry.id, type);
      setLocalEntry(updated);
      if (onVote) onVote(updated);
    } catch (err) {
      console.error('Vote failed:', err);
    } finally {
      setVoting(false);
    }
  };

  const toggleExpand = () => setExpanded((prev) => !prev);

  const timeAgo = (ts) => {
    const diff = Date.now() - ts;
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'just now';
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  return (
    <article className="entry-card" onClick={toggleExpand}>
      <div className="entry-header">
        <h2 className="entry-word">{localEntry.word}</h2>
        <span className="entry-time">{timeAgo(localEntry.createdAt)}</span>
      </div>

      <p className="entry-definition">{localEntry.definition}</p>

      {localEntry.example && (
        <p className="entry-example">
          <em>"{localEntry.example}"</em>
        </p>
      )}

      <div className="entry-footer">
        <span className="entry-author">by {localEntry.author}</span>

        <div className="entry-actions" onClick={(e) => e.stopPropagation()}>
          <button
            className={`vote-btn upvote${voting ? ' disabled' : ''}`}
            onClick={(e) => handleVote('up', e)}
            disabled={voting}
            aria-label="Upvote"
          >
            ▲ {localEntry.upvotes}
          </button>
          <button
            className={`vote-btn downvote${voting ? ' disabled' : ''}`}
            onClick={(e) => handleVote('down', e)}
            disabled={voting}
            aria-label="Downvote"
          >
            ▼ {localEntry.downvotes}
          </button>
          <button
            className="comment-btn"
            onClick={(e) => { e.stopPropagation(); toggleExpand(); }}
            aria-label="Comments"
          >
            💬 {localEntry.commentCount || 0}
          </button>
        </div>
      </div>

      {expanded && (
        <div onClick={(e) => e.stopPropagation()}>
          <CommentSection
            entryId={localEntry.id}
            initialCount={localEntry.commentCount}
          />
        </div>
      )}
    </article>
  );
}

export default EntryCard;

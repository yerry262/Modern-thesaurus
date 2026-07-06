import React, { useState, useEffect, useCallback } from 'react';
import { getEntries } from './api';
import EntryCard from './components/EntryCard';
import EntryForm from './components/EntryForm';
import SearchBar from './components/SearchBar';
import './App.css';

function App() {
  const [period, setPeriod] = useState('day');
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchEntries = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const data = await getEntries(period);
      setEntries(data);
    } catch (e) {
      setError('Failed to load entries. Make sure the backend is running.');
    } finally {
      setLoading(false);
    }
  }, [period]);

  useEffect(() => {
    fetchEntries();
  }, [fetchEntries]);

  const handleEntryCreated = (newEntry) => {
    setEntries((prev) => [newEntry, ...prev]);
  };

  const handleVoteUpdate = (updated) => {
    setEntries((prev) =>
      prev.map((e) => (e.id === updated.id ? updated : e))
    );
  };

  const handleSearchResults = (results, query) => {
    setSearchResults(results);
    setSearchQuery(query);
  };

  const handleSearchClear = () => {
    setSearchResults(null);
    setSearchQuery('');
  };

  const displayEntries = searchResults !== null ? searchResults : entries;

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-inner">
          <div className="brand">
            <span className="brand-icon">📖</span>
            <h1 className="brand-name">Modern Thesaurus</h1>
          </div>
          <button className="btn btn-primary add-btn" onClick={() => setShowForm(true)}>
            + Add Word
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="main-content">
        {/* Search Bar */}
        <SearchBar onResults={handleSearchResults} onClear={handleSearchClear} />

        {/* Period Toggle */}
        {searchResults === null && (
          <div className="period-toggle">
            <button
              className={`toggle-btn${period === 'day' ? ' active' : ''}`}
              onClick={() => setPeriod('day')}
            >
              Today
            </button>
            <button
              className={`toggle-btn${period === 'week' ? ' active' : ''}`}
              onClick={() => setPeriod('week')}
            >
              This Week
            </button>
          </div>
        )}

        {/* Search results header */}
        {searchResults !== null && (
          <div className="search-header">
            <p className="search-info">
              {searchResults.length} result{searchResults.length !== 1 ? 's' : ''} for &ldquo;{searchQuery}&rdquo;
            </p>
          </div>
        )}

        {/* Entries */}
        {loading && (
          <div className="loading-container">
            <div className="spinner" />
            <p>Loading entries…</p>
          </div>
        )}

        {error && !loading && (
          <div className="error-container">
            <p className="error-msg">{error}</p>
            <button className="btn btn-primary" onClick={fetchEntries}>
              Retry
            </button>
          </div>
        )}

        {!loading && !error && displayEntries.length === 0 && (
          <div className="empty-state">
            <p className="empty-icon">🔤</p>
            <p>
              {searchResults !== null
                ? 'No words found for your search.'
                : 'No entries yet. Be the first to add a word!'}
            </p>
            {searchResults === null && (
              <button className="btn btn-primary" onClick={() => setShowForm(true)}>
                Add a Word
              </button>
            )}
          </div>
        )}

        {!loading && !error && displayEntries.length > 0 && (
          <div className="entries-list">
            {displayEntries.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                onVote={handleVoteUpdate}
              />
            ))}
          </div>
        )}
      </main>

      {/* Add Word Modal */}
      {showForm && (
        <EntryForm
          onEntryCreated={handleEntryCreated}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  );
}

export default App;

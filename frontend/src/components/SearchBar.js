import React, { useState, useCallback } from 'react';
import { searchEntries } from '../api';

function SearchBar({ onResults, onClear }) {
  const [query, setQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const debounceRef = React.useRef(null);

  const handleChange = useCallback(
    (e) => {
      const val = e.target.value;
      setQuery(val);

      if (debounceRef.current) clearTimeout(debounceRef.current);

      if (!val.trim()) {
        onClear();
        return;
      }

      debounceRef.current = setTimeout(async () => {
        setSearching(true);
        try {
          const results = await searchEntries(val.trim());
          onResults(results, val.trim());
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          setSearching(false);
        }
      }, 400);
    },
    [onResults, onClear]
  );

  const handleClear = () => {
    setQuery('');
    onClear();
  };

  return (
    <div className="search-bar">
      <div className="search-input-wrapper">
        <span className="search-icon">🔍</span>
        <input
          className="search-input"
          type="text"
          placeholder="Search words…"
          value={query}
          onChange={handleChange}
          aria-label="Search words"
        />
        {query && (
          <button className="search-clear" onClick={handleClear} aria-label="Clear search">
            ✕
          </button>
        )}
      </div>
      {searching && <span className="search-spinner">Searching…</span>}
    </div>
  );
}

export default SearchBar;

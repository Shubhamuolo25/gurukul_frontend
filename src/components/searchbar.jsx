import './searchbar.css';
import { useState, useRef, useCallback, useEffect } from 'react';

function Searchbar({ placeholder, onResults, value, onChange, onSearchStart, onSearchEnd }) {
  const [query, setQuery] = useState(value || '');
  const debounceTimeout = useRef(null);

  // Keep query in sync with value prop
  useEffect(() => {
    setQuery(value || '');
  }, [value]);

  // Exposed search function (can be called for pagination)
  const handleSearch = useCallback(
    async (searchTerm, page = 1, limit = 10) => {
      const trimmedQuery = searchTerm.trim();
      setQuery(trimmedQuery);
      if (onChange) onChange(trimmedQuery);
      if (onResults) onResults({ query: trimmedQuery, page });
    },
    [onResults, onChange]
  );

  /* Debounced input handler */
  const handleInputChange = e => {
    const val = e.target.value;
    setQuery(val);
    if (onChange) onChange(val);
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);
    debounceTimeout.current = setTimeout(() => {
      handleSearch(val, 1, 10);
    }, 500);
  };

  // No-op submit handler to prevent default form submit behavior
  const handleSubmit = e => {
    e.preventDefault(); // Prevent form submit
    return false;       // Do nothing on button click
  };

  // Expose to parent
  Searchbar.doSearch = handleSearch;

  return (
    <form className="searchbar-box" onSubmit={handleSubmit}>
      <img src="con.svg" alt="Search Icon" className="searchbar-icon" />
      <input
        type="text"
        value={query}
        onChange={handleInputChange}
        placeholder={placeholder || 'Search by Name, or Email id'}
        id="searchbar-input"
        autoFocus
      />
      <button type="submit" className="searchbar-button" disabled>
        Search
      </button>
    </form>
  );
}

export default Searchbar;

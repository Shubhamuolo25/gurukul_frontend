import { useState, useEffect } from 'react';
import Cards from './cards';
import Pagination from './pagination';
import LoadingState from './loadingState';
import { onceAsync } from '../libs/commonFunction';
import { getUsers, searchUsers } from '../libs/apiHandler';
import Searchbar from './searchbar';

function PaginatedCards() {
  const itemsPerPage = 10;
  const [allItems, setAllItems] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState({ success: true, message: '' });
  const [loading, setLoading] = useState(true);

  /* search state */
  const [searchActive, setSearchActive] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  // Add a state to store the last searched string
  const [searchValue, setSearchValue] = useState("");

  /* delete confirmation state */
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  /* Fetch default users (paged) */
  const fetchData = onceAsync(async () => {
    setLoading(true);
    try {
      const res = await getUsers(currentPage, itemsPerPage);
      setAllItems(res.data.users);
      setTotalItems(res.data.total);
      setError({ success: true, message: '' });
    } catch (err) {
      setAllItems([]);
      setTotalItems(0);
      setError({
        success: false,
        message: 'Failed to load data. Please try again later.'
      });
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (!searchActive) {
      fetchData();
    } else if (searchQuery) {
      setLoading(true);
      searchUsers(searchQuery, currentPage, itemsPerPage)
        .then(res => {
          setAllItems(res.data.users || []);
          setTotalItems(res.data.total || 0);
          setError({ success: true, message: '' });
          setSearchValue(searchQuery); // Store and display the searched string in the searchbar
        })
        .catch(() => {
          setAllItems([]);
          setTotalItems(0);
          setError({
            success: false,
            message: 'Failed to load search results.'
          });
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line
  }, [currentPage, itemsPerPage, searchActive, searchQuery]);

  /* Handle results coming back from <Searchbar /> */
  const handleSearchResults = data => {
    /* === ARRAY RESPONSE =================================================== */
    if (Array.isArray(data)) {
      setAllItems(data);
      setTotalItems(data.length);
      setSearchActive(data.length > 0);
      setSearchQuery('');
      setError({ success: data.length > 0, message: data.length ? '' : 'No results found.' });
      setCurrentPage(1);
      return;
    }

    /* === OBJECT RESPONSE =================================================== */
    if (data && typeof data === 'object') {
      const users = Array.isArray(data.users) ? data.users : [];
      const queryString = data.query ?? '';

      setAllItems(users);
      setTotalItems(
        data.total !== undefined ? data.total : users.length
      );

      /* 🔑  keep search mode active whenever a query string exists */
      setSearchActive(Boolean(queryString));
      setSearchQuery(queryString); // <-- This will keep the searchbar filled

      setError({
        success: users.length > 0,
        message: users.length ? '' : 'No results found.'
      });

      setCurrentPage(data.page || 1);
      return;
    }
  };

  // New: handle delete request from Cards
  const handleDeleteRequest = (_id) => {
    setDeleteId(_id);
    setShowConfirm(true);
  };

  // New: handle confirm delete in parent
  const handleConfirmDelete = async () => {
    if (!deleteId) return;
    try {
      // Call the API to delete
      const { deleteUserById } = await import('../libs/apiHandler');
      await deleteUserById(deleteId);
      // Wait a short time to allow Elasticsearch to sync
      await new Promise(resolve => setTimeout(resolve, 400));
    } catch (err) {
      // Optionally show error
    }
    setShowConfirm(false);
    setDeleteId(null);
    // Refresh data
    if (searchActive && searchQuery) {
      setCurrentPage(1); // Always reset to first page after delete in search
      setLoading(true);
      try {
        const res = await searchUsers(searchQuery, 1, itemsPerPage);
        setAllItems(res.data.users || []);
        setTotalItems(res.data.total || 0);
        setError({ success: true, message: '' });
      } catch {
        setAllItems([]);
        setTotalItems(0);
        setError({
          success: false,
          message: 'Failed to load search results.'
        });
      } finally {
        setLoading(false);
      }
    } else {
      fetchData();
    }
  };

  const handleCancelDelete = () => {
    setShowConfirm(false);
    setDeleteId(null);
  };

  const totalPages = Math.ceil(totalItems / itemsPerPage);

  if (loading) return <LoadingState />;

  return (
    <div className="paginated-content">
      <Searchbar 
        onResults={handleSearchResults}
        value={searchValue}
        onChange={setSearchValue}
      />
      {!error.success && !loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: 'calc(100vh - 252px)',
            fontSize: '1.2rem',
            fontWeight: 'bold',
            color: '#c00',
            textAlign: 'center'
          }}
        >
          {error.message || 'Something Went Wrong.'}
        </div>
      ) : (
        <div>
          <Cards
            data={allItems}
            error={!error.success && !loading}
            onDeleteRequest={handleDeleteRequest}
          />
          {totalItems > itemsPerPage && (
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={setCurrentPage}
            />
          )}
        </div>
      )}
      {showConfirm && (
        <div className="delete-confirm-overlay">
          <div className="delete-confirm-modal">
            <div className="delete-confirm-message">Are you sure you want to delete the user?</div>
            <div className="delete-confirm-actions">
              <button type="button" className="btnConfirmDelete" onClick={handleConfirmDelete} autoFocus>Yes</button>
              <button type="button" className="btnCancelDelete" onClick={handleCancelDelete}>No</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default PaginatedCards;

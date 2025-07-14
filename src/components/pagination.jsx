import React from 'react';
import './pagination.css';

function Pagination({ totalPages = 1, currentPage = 1, onPageChange }) {
  const handlePageClick = (page) => {
    if (page !== 'dots' && page !== currentPage) {
      onPageChange(page); // Trigger parent to change page and re-fetch data
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const handlePrev = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  let pageNumbers = [];

  if (totalPages <= 5) {
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  } else if (currentPage <= 2) {
    pageNumbers = [1, 2, 3, 'dots', totalPages];
  } else if (currentPage >= totalPages - 1) {
    pageNumbers = [1, 'dots', totalPages - 2, totalPages - 1, totalPages];
  } else {
    pageNumbers = [
      1,
      'dots',
      currentPage - 1,
      currentPage,
      currentPage + 1,
      'dots',
      totalPages,
    ];
  }

  return (
    <div className="pagination">
      <button onClick={handlePrev} disabled={currentPage === 1}>
        <img 
          src={process.env.PUBLIC_URL + '/previous.svg'} 
          alt="Previous" 
          style={{ width: 10, height: 10, left: '38%', right: '38%', top: '32%', bottom: '32%' }} 
        />
      </button>
      {pageNumbers.map((page, idx) =>
        page === 'dots' ? (
          <span key={`dots-${idx}`} className="dots">...</span>
        ) : (
          <button
            key={page}
            className={`page-btn ${currentPage === page ? 'active' : ''}`}
            onClick={() => handlePageClick(page)}
            disabled={currentPage === page}
          >
            {page}
          </button>
        )
      )}
      <button onClick={handleNext} disabled={currentPage === totalPages}>
        <img 
          src={process.env.PUBLIC_URL + '/next.svg'} 
          alt="Next" 
          style={{ width: 10, height: 10, left: '38%', right: '38%', top: '32%', bottom: '32%' }} 
        />
      </button>
    </div>
  );
}

export default Pagination;

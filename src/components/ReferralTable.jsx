import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';

const ReferralTable = ({ referrals }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 10;
  const navigate = useNavigate();

  // Reset to first page when data changes
  useMemo(() => {
    setCurrentPage(1);
  }, [referrals]);

  const totalPages = Math.ceil(referrals.length / rowsPerPage);
  const startIndex = (currentPage - 1) * rowsPerPage;
  const endIndex = startIndex + rowsPerPage;
  const currentRows = referrals.slice(startIndex, endIndex);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (isoString) => {
    if (!isoString) return '';
    return isoString.replace(/-/g, '/');
  };

  const handleRowClick = (id) => {
    navigate(`/referral/${id}`);
  };

  return (
    <div className="table-container">
      <table className="referral-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Service</th>
            <th>Date</th>
            <th>Profit</th>
          </tr>
        </thead>
        <tbody>
          {currentRows.length === 0 ? (
            <tr>
              <td colSpan="4" className="empty-state">No matching entries</td>
            </tr>
          ) : (
            currentRows.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row.id)} className="clickable-row">
                <td>{row.name}</td>
                <td>{row.serviceName}</td>
                <td>{formatDate(row.date)}</td>
                <td>{formatCurrency(row.profit)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {referrals.length > 0 && (
        <div className="pagination-footer">
          <div className="pagination-info">
            Showing {startIndex + 1}–{Math.min(endIndex, referrals.length)} of {referrals.length} entries
          </div>
          <div className="pagination-controls">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="btn btn-page"
            >
              Previous
            </button>
            
            {Array.from({ length: totalPages }).map((_, idx) => {
              const pageNumber = idx + 1;
              return (
                <button
                  key={pageNumber}
                  className={`btn btn-page ${currentPage === pageNumber ? 'active' : ''}`}
                  onClick={() => setCurrentPage(pageNumber)}
                >
                  {pageNumber}
                </button>
              );
            })}

            <button
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(p => p + 1)}
              className="btn btn-page"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReferralTable;

import { useState, useEffect } from 'react';
import Cookies from 'js-cookie';
import { fetchReferrals } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ReferralTable from '../components/ReferralTable';

const Dashboard = () => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('desc');

  const token = Cookies.get('jwt_token');

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const result = await fetchReferrals(token, search, sort);
        setData(result);
      } catch (err) {
        setError(err.message || 'Failed to load dashboard data');
      } finally {
        setIsLoading(false);
      }
    };

    // Simple debounce for search
    const timer = setTimeout(() => {
      loadData();
    }, 300);

    return () => clearTimeout(timer);
  }, [token, search, sort]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="layout">
      <Navbar />
      <main className="dashboard-content">
        <header className="dashboard-header">
          <h1>Referral Dashboard</h1>
          <p>Track your referrals, earnings, and partner activity in one place.</p>
        </header>

        {error && (
          <div className="error-alert" role="alert">
            {error}
          </div>
        )}

        {isLoading && !data && (
          <div className="loading-state">Loading dashboard data...</div>
        )}

        {data && (
          <>
            <section className="overview-section" role="region" aria-label="Overview metrics">
              <h2>Overview</h2>
              <div className="metrics-grid">
                {data.metrics?.map((metric) => (
                  <div key={metric.id || metric.label} className="metric-card">
                    <span className="metric-label">{metric.label}</span>
                    <span className="metric-value">{metric.value}</span>
                  </div>
                ))}
              </div>
            </section>

            <div className="dashboard-grid-2">
              <section className="service-summary-section" aria-label="Service summary">
                <h2>Service summary</h2>
                <div className="summary-details">
                  <div className="summary-row">
                    <span className="summary-label">Service</span>
                    <span className="summary-value">{data.serviceSummary?.service}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Your Referrals</span>
                    <span className="summary-value">{data.serviceSummary?.yourReferrals}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Active Referrals</span>
                    <span className="summary-value">{data.serviceSummary?.activeReferrals}</span>
                  </div>
                  <div className="summary-row">
                    <span className="summary-label">Total Ref. Earnings</span>
                    <span className="summary-value">{data.serviceSummary?.totalRefEarnings}</span>
                  </div>
                </div>
              </section>

              <section className="share-section" aria-label="Share referral">
                <h2>Refer friends and earn more</h2>
                <div className="share-controls">
                  <div className="share-group">
                    <label>Your Referral Link</label>
                    <div className="input-with-button">
                      <input type="text" readOnly value={data.referral?.link || ''} />
                      <button className="btn btn-secondary" onClick={() => handleCopy(data.referral?.link)}>Copy</button>
                    </div>
                  </div>
                  <div className="share-group">
                    <label>Your Referral Code</label>
                    <div className="input-with-button">
                      <input type="text" readOnly value={data.referral?.code || ''} />
                      <button className="btn btn-secondary" onClick={() => handleCopy(data.referral?.code)}>Copy</button>
                    </div>
                  </div>
                </div>
              </section>
            </div>

            <section className="table-section">
              <header className="table-header">
                <h2>All referrals</h2>
                <div className="table-controls">
                  <input
                    type="search"
                    placeholder="Name or service…"
                    aria-label="Search referrals"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="search-input"
                  />
                  <label className="sort-label">
                    <span>Sort by date:</span>
                    <select value={sort} onChange={(e) => setSort(e.target.value)} className="sort-select">
                      <option value="desc">Newest first</option>
                      <option value="asc">Oldest first</option>
                    </select>
                  </label>
                </div>
              </header>
              
              <div className="table-loading-wrapper">
                 {isLoading && <div className="table-overlay">Updating...</div>}
                 <ReferralTable referrals={data.referrals || []} />
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;

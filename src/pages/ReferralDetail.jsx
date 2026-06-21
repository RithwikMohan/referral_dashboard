import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { fetchReferralById } from '../utils/api';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import NotFound from './NotFound';

const ReferralDetail = () => {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const token = Cookies.get('jwt_token');

  useEffect(() => {
    const loadReferral = async () => {
      try {
        const result = await fetchReferralById(token, id);
        // The API returns the specific row or we find it inside if nested
        // Data usually is the row itself based on documentation
        setData(result);
      } catch (err) {
        setError(err.message || 'Referral not found');
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadReferral();
    }
  }, [id, token]);

  if (isLoading) {
    return (
      <div className="layout">
        <Navbar />
        <main className="detail-content loading-state">
          <p>Loading referral details...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="layout">
        <Navbar />
        <main className="detail-content">
          <h1>Referral not found</h1>
          <p>{error}</p>
          <Link to="/" className="back-link">← Back to dashboard</Link>
        </main>
        <Footer />
      </div>
    );
  }

  // Handle data being either the row itself or inside a referrals array
  // Wait, the doc says "data field is often the row itself — an object with id, name, serviceName, date, and profit"
  const row = Array.isArray(data.referrals) ? data.referrals[0] : data;

  if (!row) {
    return (
      <div className="layout">
        <Navbar />
        <main className="detail-content">
          <h1>Referral not found</h1>
          <Link to="/" className="back-link">← Back to dashboard</Link>
        </main>
        <Footer />
      </div>
    );
  }

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

  return (
    <div className="layout">
      <Navbar />
      <main className="detail-content">
        <Link to="/" className="back-link" aria-label="Back to dashboard">
          ← Back to dashboard
        </Link>
        <h1>Referral Details</h1>
        
        <div className="detail-card">
          <h2 className="partner-name">{row.name}</h2>
          
          <dl className="detail-list">
            <div className="detail-row">
              <dt>Referral ID</dt>
              <dd>{row.id}</dd>
            </div>
            <div className="detail-row">
              <dt>Service Name</dt>
              <dd>{row.serviceName}</dd>
            </div>
            <div className="detail-row">
              <dt>Date</dt>
              <dd>{formatDate(row.date)}</dd>
            </div>
            <div className="detail-row">
              <dt>Profit</dt>
              <dd className="profit-value">{formatCurrency(row.profit)}</dd>
            </div>
          </dl>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ReferralDetail;

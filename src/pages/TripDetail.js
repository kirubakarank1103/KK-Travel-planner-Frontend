import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../api';
import './TripDetail.css';

const TripDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [trip, setTrip] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get(`/trips/${id}`)
      .then(({ data }) => setTrip(data))
      .catch(() => navigate('/trips'))
      .finally(() => setLoading(false));
  }, [id, navigate]);

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div className="spinner"></div>
    </div>
  );

  if (!trip) return null;

  const getStatus = () => {
    const now = new Date();
    if (new Date(trip.startDate) > now) return { label: 'Upcoming', cls: 'badge-gold' };
    if (new Date(trip.endDate) < now) return { label: 'Completed', cls: 'badge-green' };
    return { label: 'Ongoing', cls: 'badge-red' };
  };

  const status = getStatus();
  const days = Math.ceil((new Date(trip.endDate) - new Date(trip.startDate)) / (1000 * 60 * 60 * 24));

  const handleDelete = async () => {
    if (!window.confirm('Delete this trip permanently?')) return;
    await API.delete(`/trips/${id}`);
    navigate('/trips');
  };

  return (
    <div className="trip-detail-page">
      {/* Hero */}
      <div className="detail-hero">
        <img
          src={`https://source.unsplash.com/1400x500/?${encodeURIComponent(trip.destination)},travel,landscape`}
          alt={trip.destination}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=1400&q=70'; }}
        />
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-content animate-fadeInUp">
          <span className={`badge ${status.cls}`}>{status.label}</span>
          <h1>{trip.title}</h1>
          <p>📍 {trip.destination}</p>
        </div>
      </div>

      <div className="page-wrapper detail-body">
        {/* Info Cards */}
        <div className="detail-info-grid animate-fadeInUp">
          {[
            { icon: '📅', label: 'Start Date', value: new Date(trip.startDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) },
            { icon: '🏁', label: 'End Date', value: new Date(trip.endDate).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' }) },
            { icon: '🕐', label: 'Duration', value: `${days} Day${days !== 1 ? 's' : ''}` },
            { icon: '💰', label: 'Budget', value: trip.budget ? `₹${Number(trip.budget).toLocaleString()}` : 'Not set' },
            { icon: '🏷️', label: 'Category', value: trip.category ? trip.category.charAt(0).toUpperCase() + trip.category.slice(1) : 'Leisure' },
          ].map((info, i) => (
            <div className="card detail-info-card" key={i}>
              <div className="info-icon">{info.icon}</div>
              <div className="info-label">{info.label}</div>
              <div className="info-value">{info.value}</div>
            </div>
          ))}
        </div>

        {/* Description */}
        {trip.description && (
          <div className="card detail-desc animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
            <h3>Trip Notes</h3>
            <div className="gold-divider"></div>
            <p>{trip.description}</p>
          </div>
        )}

        {/* Actions */}
        <div className="detail-actions animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
          <Link to="/trips"><button className="btn-outline">← Back to Trips</button></Link>
          <Link to={`/trips/edit/${id}`}><button className="btn-gold">Edit Trip</button></Link>
          <button className="btn-delete-full" onClick={handleDelete}>Delete Trip</button>
        </div>
      </div>
    </div>
  );
};

export default TripDetail;
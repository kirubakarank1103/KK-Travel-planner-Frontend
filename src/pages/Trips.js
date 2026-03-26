import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import './Trips.css';

const Trips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const { data } = await API.get('/trips');
        setTrips(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  const getStatus = (trip) => {
    const now = new Date();
    if (new Date(trip.startDate) > now) return 'upcoming';
    if (new Date(trip.endDate) < now) return 'completed';
    return 'ongoing';
  };

  const filtered = trips.filter(t => {
    const s = getStatus(t);
    const matchFilter = filter === 'all' || s === filter;
    const matchSearch = t.title.toLowerCase().includes(search.toLowerCase()) ||
      t.destination.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this trip?')) return;
    try {
      await API.delete(`/trips/${id}`);
      setTrips(trips.filter(t => t._id !== id));
    } catch (err) {
      alert('Failed to delete');
    }
  };

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="page-wrapper trips-page">
      <div className="trips-header animate-fadeInUp">
        <div>
          <span className="section-tag">MY TRIPS</span>
          <h1>Travel Journal</h1>
          <div className="gold-divider"></div>
        </div>
        <Link to="/trips/new"><button className="btn-gold">+ New Trip</button></Link>
      </div>

      {/* Filter & Search */}
      <div className="trips-controls animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        <div className="search-wrap">
          <input
            type="text"
            placeholder="🔍  Search trips..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="search-input"
          />
        </div>
        <div className="filter-tabs">
          {['all', 'upcoming', 'ongoing', 'completed'].map(f => (
            <button
              key={f}
              className={`filter-tab ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      {filtered.length === 0 ? (
        <div className="card empty-state" style={{ textAlign: 'center', padding: '60px' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🗺️</div>
          <h3 style={{ marginBottom: '10px' }}>No trips found</h3>
          <p style={{ color: 'var(--gray)' }}>
            {trips.length === 0 ? 'Start planning your first adventure!' : 'Try changing the filter or search term.'}
          </p>
          {trips.length === 0 && (
            <Link to="/trips/new"><button className="btn-gold" style={{ marginTop: '20px' }}>Create Trip</button></Link>
          )}
        </div>
      ) : (
        <div className="trips-grid">
          {filtered.map((trip, i) => {
            const status = getStatus(trip);
            const statusMap = { upcoming: 'badge-gold', completed: 'badge-green', ongoing: 'badge-red' };
            return (
              <div className="card trip-card" key={trip._id} style={{ animationDelay: `${i * 0.08}s`, animation: 'fadeInUp 0.6s ease forwards' }}>
                <div className="trip-card-img">
                  <img
                    src={`https://source.unsplash.com/500x250/?${encodeURIComponent(trip.destination)},travel,landscape`}
                    alt={trip.destination}
                    onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=500&q=60'; }}
                  />
                  <span className={`badge ${statusMap[status]} trip-status-badge`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                </div>
                <div className="trip-card-body">
                  <h3 className="trip-card-title">{trip.title}</h3>
                  <p className="trip-card-dest">📍 {trip.destination}</p>
                  <p className="trip-card-dates">
                    {new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                    {' — '}
                    {new Date(trip.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                  {trip.budget && <p className="trip-card-budget">💰 Budget: ₹{Number(trip.budget).toLocaleString()}</p>}
                  {trip.description && <p className="trip-card-desc">{trip.description.substring(0, 80)}{trip.description.length > 80 ? '...' : ''}</p>}
                  <div className="trip-card-actions">
                    <Link to={`/trips/${trip._id}`}><button className="btn-outline" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>View</button></Link>
                    <Link to={`/trips/edit/${trip._id}`}><button className="btn-gold" style={{ padding: '8px 18px', fontSize: '0.8rem' }}>Edit</button></Link>
                    <button className="btn-delete" onClick={() => handleDelete(trip._id)}>✕</button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Trips;
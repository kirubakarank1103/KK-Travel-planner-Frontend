import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../api';
import { useAuth } from '../context/AuthContext';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const upcoming = trips.filter(t => new Date(t.startDate) > new Date());
  const past = trips.filter(t => new Date(t.endDate) < new Date());
  const ongoing = trips.filter(t => new Date(t.startDate) <= new Date() && new Date(t.endDate) >= new Date());

  if (loading) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div className="spinner"></div>
      <p style={{ color: 'var(--gray)', marginTop: '20px' }}>Loading your trips...</p>
    </div>
  );

  return (
    <div className="page-wrapper dashboard">
      {/* Header */}
      <div className="dash-header animate-fadeInUp">
        <div>
          <span className="section-tag">DASHBOARD</span>
          <h1>Welcome, {user?.name?.split(' ')[0]} ✦</h1>
          <div className="gold-divider"></div>
          <p style={{ color: 'var(--gray)' }}>Your travel command center</p>
        </div>
        <Link to="/trips/new"><button className="btn-gold">+ New Trip</button></Link>
      </div>

      {/* Stats */}
      <div className="dash-stats animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {[
          { label: 'Total Trips', value: trips.length, icon: '✈️' },
          { label: 'Upcoming', value: upcoming.length, icon: '📅' },
          { label: 'Ongoing', value: ongoing.length, icon: '🌍' },
          { label: 'Completed', value: past.length, icon: '✅' },
        ].map((s, i) => (
          <div className="card dash-stat-card" key={i}>
            <div className="stat-icon">{s.icon}</div>
            <div className="stat-num">{s.value}</div>
            <div className="stat-lbl">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Recent Trips */}
      <div className="dash-section animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        <div className="dash-section-header">
          <h2>Recent Trips</h2>
          <Link to="/trips" style={{ color: 'var(--gold)', fontSize: '0.85rem', textDecoration: 'none' }}>View All →</Link>
        </div>

        {trips.length === 0 ? (
          <div className="card empty-state">
            <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🌎</div>
            <h3>No trips yet</h3>
            <p>Start planning your first adventure!</p>
            <Link to="/trips/new">
              <button className="btn-gold" style={{ marginTop: '20px' }}>Create Trip</button>
            </Link>
          </div>
        ) : (
          <div className="recent-grid">
            {trips.slice(0, 3).map((trip, i) => (
              <TripMiniCard key={trip._id} trip={trip} delay={i * 0.1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

const TripMiniCard = ({ trip, delay }) => {
  const getStatus = () => {
    const now = new Date();
    if (new Date(trip.startDate) > now) return { label: 'Upcoming', cls: 'badge-gold' };
    if (new Date(trip.endDate) < now) return { label: 'Completed', cls: 'badge-green' };
    return { label: 'Ongoing', cls: 'badge-red' };
  };
  const status = getStatus();

  return (
    <Link to={`/trips/${trip._id}`} style={{ textDecoration: 'none' }}>
      <div className="card trip-mini-card" style={{ animationDelay: `${delay}s` }}>
        <div className="trip-mini-img">
          <img
            src={`https://source.unsplash.com/400x200/?${encodeURIComponent(trip.destination)},travel`}
            alt={trip.destination}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=60'; }}
          />
        </div>
        <div className="trip-mini-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <h3 className="trip-mini-title">{trip.title}</h3>
            <span className={`badge ${status.cls}`}>{status.label}</span>
          </div>
          <p className="trip-mini-dest">📍 {trip.destination}</p>
          <p className="trip-mini-dates">
            {new Date(trip.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            {' – '}
            {new Date(trip.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default Dashboard;
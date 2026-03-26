import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../api';

const Profile = () => {
  const { user, logout } = useAuth();
  const [trips, setTrips] = useState([]);
const [, setLoading] = useState(true);
  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const res = await api.get('/trips');
        setTrips(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <div style={{ minHeight: '100vh', background: '#0a0a0a', color: '#fff', padding: '100px 20px 40px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>

        {/* Profile Card */}
        <div style={{ background: '#1a1a1a', borderRadius: '16px', padding: '40px', marginBottom: '30px', textAlign: 'center', border: '1px solid #333' }}>
          <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#c9a84c', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', fontSize: '32px', fontWeight: 'bold' }}>
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <h2 style={{ color: '#c9a84c', marginBottom: '8px' }}>{user?.name}</h2>
          <p style={{ color: '#888' }}>{user?.email}</p>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '30px' }}>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #333' }}>
            <h3 style={{ color: '#c9a84c', fontSize: '32px', margin: '0 0 8px' }}>{trips.length}</h3>
            <p style={{ color: '#888', margin: 0 }}>Total Trips</p>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #333' }}>
            <h3 style={{ color: '#c9a84c', fontSize: '32px', margin: '0 0 8px' }}>
              {trips.filter(t => new Date(t.startDate) > new Date()).length}
            </h3>
            <p style={{ color: '#888', margin: 0 }}>Upcoming</p>
          </div>
          <div style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', textAlign: 'center', border: '1px solid #333' }}>
            <h3 style={{ color: '#c9a84c', fontSize: '32px', margin: '0 0 8px' }}>
              {trips.filter(t => new Date(t.endDate) < new Date()).length}
            </h3>
            <p style={{ color: '#888', margin: 0 }}>Completed</p>
          </div>
        </div>

        {/* Logout Button */}
        <button
          onClick={logout}
          style={{ width: '100%', padding: '16px', background: 'transparent', border: '2px solid #c9a84c', color: '#c9a84c', borderRadius: '8px', fontSize: '16px', cursor: 'pointer', fontWeight: 'bold' }}>
          LOGOUT
        </button>

      </div>
    </div>
  );
};

export default Profile;
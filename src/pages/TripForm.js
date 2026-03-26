import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import API from '../api';
import './TripForm.css';

const TripForm = () => {
  const { id } = useParams();
  const isEdit = Boolean(id);
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', destination: '', startDate: '', endDate: '', budget: '', description: '', category: 'leisure',
  });
  const [loading, setLoading] = useState(false);
  const [fetchLoad, setFetchLoad] = useState(isEdit);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (isEdit) {
      API.get(`/trips/${id}`)
        .then(({ data }) => {
          setForm({
            title: data.title || '',
            destination: data.destination || '',
            startDate: data.startDate?.substring(0, 10) || '',
            endDate: data.endDate?.substring(0, 10) || '',
            budget: data.budget || '',
            description: data.description || '',
            category: data.category || 'leisure',
          });
        })
        .catch(() => setError('Failed to load trip'))
        .finally(() => setFetchLoad(false));
    }
  }, [id, isEdit]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); setSuccess('');
    if (new Date(form.startDate) > new Date(form.endDate)) {
      return setError('Start date must be before end date');
    }
    setLoading(true);
    try {
      if (isEdit) {
        await API.put(`/trips/${id}`, form);
        setSuccess('Trip updated successfully!');
        setTimeout(() => navigate('/trips'), 1200);
      } else {
        await API.post('/trips', form);
        setSuccess('Trip created successfully!');
        setTimeout(() => navigate('/trips'), 1200);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  if (fetchLoad) return (
    <div className="page-wrapper" style={{ textAlign: 'center', paddingTop: '100px' }}>
      <div className="spinner"></div>
    </div>
  );

  return (
    <div className="page-wrapper trip-form-page">
      <div className="trip-form-container animate-fadeInUp">
        <div className="trip-form-header">
          <span className="section-tag">{isEdit ? 'EDIT TRIP' : 'NEW TRIP'}</span>
          <h1>{isEdit ? 'Update Your Trip' : 'Plan New Adventure'}</h1>
          <div className="gold-divider"></div>
        </div>

        <div className="trip-form-layout">
          <form className="trip-form" onSubmit={handleSubmit}>
            {error && <div className="alert alert-error">{error}</div>}
            {success && <div className="alert alert-success">✓ {success}</div>}

            <div className="form-row">
              <div className="input-group">
                <label>Trip Title *</label>
                <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Golden Europe Tour" required />
              </div>
              <div className="input-group">
                <label>Destination *</label>
                <input name="destination" value={form.destination} onChange={handleChange} placeholder="e.g. Paris, France" required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Start Date *</label>
                <input name="startDate" type="date" value={form.startDate} onChange={handleChange} required />
              </div>
              <div className="input-group">
                <label>End Date *</label>
                <input name="endDate" type="date" value={form.endDate} onChange={handleChange} required />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Budget (₹)</label>
                <input name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="e.g. 50000" min="0" />
              </div>
              <div className="input-group">
                <label>Category</label>
                <select name="category" value={form.category} onChange={handleChange}>
                  <option value="leisure">Leisure</option>
                  <option value="business">Business</option>
                  <option value="adventure">Adventure</option>
                  <option value="cultural">Cultural</option>
                  <option value="beach">Beach</option>
                  <option value="honeymoon">Honeymoon</option>
                  <option value="family">Family</option>
                </select>
              </div>
            </div>

            <div className="input-group">
              <label>Description</label>
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Add notes, itinerary details, or anything about this trip..." />
            </div>

            <div className="form-actions">
              <button type="button" className="btn-outline" onClick={() => navigate('/trips')}>Cancel</button>
              <button type="submit" className="btn-gold" disabled={loading}>
                {loading ? 'Saving...' : isEdit ? 'Update Trip' : 'Create Trip →'}
              </button>
            </div>
          </form>

          {/* Preview */}
          <div className="trip-preview">
            <h3 style={{ marginBottom: '15px', color: 'var(--gold)' }}>Preview</h3>
            <div className="preview-img-wrap">
              {form.destination ? (
                <img
                  src={`https://source.unsplash.com/400x220/?${encodeURIComponent(form.destination)},travel`}
                  alt="preview"
                  onError={e => { e.target.src = 'https://images.unsplash.com/photo-1488085061387-422e29b40080?w=400&q=60'; }}
                />
              ) : (
                <div className="preview-placeholder">📸 Enter destination to see preview</div>
              )}
            </div>
            {form.title && <h4 className="preview-title">{form.title}</h4>}
            {form.destination && <p className="preview-dest">📍 {form.destination}</p>}
            {form.startDate && form.endDate && (
              <p className="preview-dates">
                {new Date(form.startDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                {' – '}
                {new Date(form.endDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
              </p>
            )}
            {form.budget && <p className="preview-budget">💰 ₹{Number(form.budget).toLocaleString()}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TripForm;
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getContactSubmission, updateContactSubmission } from '../../services/adminApi';

/**
 * Admin Contact Detail Page
 * Full submission view with notes and status management
 */
const AdminContactDetailPage = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [submission, setSubmission] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadSubmission();
  }, [submissionId]);

  const loadSubmission = async () => {
    try {
      setLoading(true);
      const data = await getContactSubmission(submissionId);
      setSubmission(data);
      setNotes(data.internal_notes || '');
      setStatus(data.status);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateContactSubmission(submissionId, {
        internal_notes: notes,
        status: status,
      });
      // Reload to confirm
      await loadSubmission();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="admin-loading">Loading...</div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="admin-error">{error}</div>
      </AdminLayout>
    );
  }

  if (!submission) {
    return (
      <AdminLayout>
        <div className="admin-error">Submission not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <button onClick={() => navigate('/admin/contact')} className="admin-back-btn">
            Back to List
          </button>
          <h1 className="admin-page-title">Contact Detail</h1>
          <p className="admin-page-intro">ID: {submission.submission_id}</p>
        </div>

        {/* Submission Details */}
        <div className="admin-detail-section">
          <h2 className="admin-section-title">Submission Details</h2>
          <div className="admin-detail-meta">
            <div className="admin-detail-row">
              <span className="admin-detail-label">Submitted</span>
              <span className="admin-detail-value">{formatDate(submission.timestamp)}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Name</span>
              <span className="admin-detail-value">{submission.name}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Reason</span>
              <span className="admin-detail-value">{submission.reason}</span>
            </div>
            {submission.city && (
              <div className="admin-detail-row">
                <span className="admin-detail-label">City</span>
                <span className="admin-detail-value">{submission.city}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contact Information */}
        {(submission.email || submission.phone) && (
          <div className="admin-detail-section">
            <h2 className="admin-section-title">Contact Information</h2>
            <div className="admin-detail-meta">
              {submission.preferred_contact && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Preferred Contact</span>
                  <span className="admin-detail-value">{submission.preferred_contact}</span>
                </div>
              )}
              {submission.email && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Email</span>
                  <span className="admin-detail-value">{submission.email}</span>
                </div>
              )}
              {submission.phone && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Phone</span>
                  <span className="admin-detail-value">{submission.phone}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Admin Controls */}
        <div className="admin-detail-section admin-controls-section">
          <h2 className="admin-section-title">Internal Notes & Status</h2>
          
          <div className="admin-control-group">
            <label className="admin-control-label">Status</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="admin-control-select"
            >
              <option value="new">New</option>
              <option value="reviewed">Reviewed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="admin-control-group">
            <label className="admin-control-label">Internal Notes</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="admin-control-textarea"
              placeholder="Add internal observations, follow-up notes, or actions taken..."
              rows={6}
            />
          </div>

          <button
            onClick={handleSave}
            className="admin-save-btn"
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminContactDetailPage;

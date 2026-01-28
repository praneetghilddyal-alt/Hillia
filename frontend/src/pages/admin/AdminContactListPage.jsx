import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getContactSubmissions } from '../../services/adminApi';

/**
 * Admin Contact List Page
 * Name + reason + optional contact - chronological
 */
const AdminContactListPage = () => {
  const navigate = useNavigate();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    loadSubmissions();
  }, [statusFilter]);

  const loadSubmissions = async () => {
    try {
      setLoading(true);
      const data = await getContactSubmissions(statusFilter || null);
      setSubmissions(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusLabel = (status) => {
    const labels = {
      new: 'New',
      reviewed: 'Reviewed',
      archived: 'Archived',
    };
    return labels[status] || status;
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Contact Submissions</h1>
          <p className="admin-page-intro">Direct inquiries. Manual review.</p>
        </div>

        <div className="admin-filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All Status</option>
            <option value="new">New</option>
            <option value="reviewed">Reviewed</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={loadSubmissions} className="admin-refresh-btn">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : submissions.length === 0 ? (
          <div className="admin-empty">No submissions found.</div>
        ) : (
          <div className="admin-list">
            {submissions.map((submission) => (
              <div
                key={submission.submission_id}
                className="admin-list-item"
                onClick={() => navigate(`/admin/contact/${submission.submission_id}`)}
              >
                <div className="admin-list-item-main">
                  <span className="admin-list-item-name">{submission.name}</span>
                  <span className="admin-list-item-date">{formatDate(submission.timestamp)}</span>
                </div>
                <div className="admin-list-item-reason">{submission.reason}</div>
                <div className="admin-list-item-meta">
                  <span className={`admin-status admin-status-${submission.status}`}>
                    {getStatusLabel(submission.status)}
                  </span>
                  {submission.email && <span className="admin-tag">Email</span>}
                  {submission.phone && <span className="admin-tag">Phone</span>}
                  {submission.internal_notes && <span className="admin-tag">Has Notes</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminContactListPage;

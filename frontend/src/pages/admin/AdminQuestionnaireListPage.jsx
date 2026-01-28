import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getQuestionnaireResponses } from '../../services/adminApi';

/**
 * Admin Questionnaire List Page
 * Chronological list view - reading files, not managing leads
 */
const AdminQuestionnaireListPage = () => {
  const navigate = useNavigate();
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const loadResponses = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getQuestionnaireResponses(statusFilter || null);
      setResponses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

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
      unreviewed: 'Unreviewed',
      reviewed: 'Reviewed',
      archived: 'Archived',
    };
    return labels[status] || status;
  };

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Questionnaire Responses</h1>
          <p className="admin-page-intro">Chronological record. Manual review.</p>
        </div>

        <div className="admin-filter-bar">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All Status</option>
            <option value="unreviewed">Unreviewed</option>
            <option value="reviewed">Reviewed</option>
            <option value="archived">Archived</option>
          </select>
          <button onClick={loadResponses} className="admin-refresh-btn">
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="admin-loading">Loading...</div>
        ) : error ? (
          <div className="admin-error">{error}</div>
        ) : responses.length === 0 ? (
          <div className="admin-empty">No responses found.</div>
        ) : (
          <div className="admin-list">
            {responses.map((response) => (
              <div
                key={response.response_id}
                className="admin-list-item"
                onClick={() => navigate(`/admin/questionnaire/${response.response_id}`)}
              >
                <div className="admin-list-item-main">
                  <span className="admin-list-item-id">{response.response_id.slice(0, 8)}...</span>
                  <span className="admin-list-item-date">{formatDate(response.timestamp)}</span>
                </div>
                <div className="admin-list-item-meta">
                  <span className={`admin-status admin-status-${response.status}`}>
                    {getStatusLabel(response.status)}
                  </span>
                  {response.wants_contact && (
                    <span className="admin-tag">Contact Consent</span>
                  )}
                  {response.internal_notes && (
                    <span className="admin-tag">Has Notes</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminQuestionnaireListPage;

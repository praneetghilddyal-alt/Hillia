import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getQuestionnaireResponses, updateQuestionnaireResponse } from '../../services/adminApi';

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
  const [watchedFilter, setWatchedFilter] = useState('');

  const loadResponses = useCallback(async () => {
    try {
      setLoading(true);
      const watchedValue = watchedFilter === 'watched' ? true : watchedFilter === 'unwatched' ? false : null;
      const data = await getQuestionnaireResponses(statusFilter || null, watchedValue);
      setResponses(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, watchedFilter]);

  useEffect(() => {
    loadResponses();
  }, [loadResponses]);

  const toggleWatch = async (e, responseId, currentWatched) => {
    e.stopPropagation();
    try {
      await updateQuestionnaireResponse(responseId, { watched: !currentWatched });
      setResponses(responses.map(r => 
        r.response_id === responseId ? { ...r, watched: !currentWatched } : r
      ));
    } catch (err) {
      setError(err.message);
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
          <select
            value={watchedFilter}
            onChange={(e) => setWatchedFilter(e.target.value)}
            className="admin-filter-select"
          >
            <option value="">All</option>
            <option value="watched">Watching</option>
            <option value="unwatched">Not Watching</option>
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
                className={`admin-list-item ${response.watched ? 'admin-list-item-watched' : ''}`}
                onClick={() => navigate(`/admin/questionnaire/${response.response_id}`)}
              >
                <div className="admin-list-item-main">
                  <div className="admin-list-item-left">
                    <button
                      className={`admin-watch-btn ${response.watched ? 'admin-watch-btn-active' : ''}`}
                      onClick={(e) => toggleWatch(e, response.response_id, response.watched)}
                      title={response.watched ? 'Remove from watch list' : 'Add to watch list'}
                    >
                      {response.watched ? '●' : '○'}
                    </button>
                    <span className="admin-list-item-id">{response.response_id.slice(0, 8)}...</span>
                  </div>
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

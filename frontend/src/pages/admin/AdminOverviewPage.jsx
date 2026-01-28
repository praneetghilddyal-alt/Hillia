import React, { useState, useEffect } from 'react';
import AdminLayout from '../../components/admin/AdminLayout';
import { getAdminStats } from '../../services/adminApi';

/**
 * Admin Overview Page
 * Aggregated distributions - counts and percentages only
 * No charts, no dashboards - text-first
 */
const AdminOverviewPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const data = await getAdminStats();
      setStats(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
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

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <h1 className="admin-page-title">Overview</h1>
          <p className="admin-page-intro">Aggregated distributions. Quiet observation.</p>
        </div>

        <div className="admin-stats-section">
          <h2 className="admin-section-title">Questionnaire Responses</h2>
          <div className="admin-stats-table">
            <div className="admin-stats-row admin-stats-total">
              <span className="admin-stats-label">Total Submissions</span>
              <span className="admin-stats-value">{stats.questionnaire.total}</span>
            </div>
            <div className="admin-stats-divider" />
            <div className="admin-stats-row">
              <span className="admin-stats-label">Unreviewed</span>
              <span className="admin-stats-value">
                {stats.questionnaire.by_status.unreviewed.count}
                <span className="admin-stats-pct">({stats.questionnaire.by_status.unreviewed.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-row">
              <span className="admin-stats-label">Reviewed</span>
              <span className="admin-stats-value">
                {stats.questionnaire.by_status.reviewed.count}
                <span className="admin-stats-pct">({stats.questionnaire.by_status.reviewed.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-row">
              <span className="admin-stats-label">Archived</span>
              <span className="admin-stats-value">
                {stats.questionnaire.by_status.archived.count}
                <span className="admin-stats-pct">({stats.questionnaire.by_status.archived.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-divider" />
            <div className="admin-stats-row">
              <span className="admin-stats-label">Consented to Contact</span>
              <span className="admin-stats-value">
                {stats.questionnaire.contact_consent.yes.count}
                <span className="admin-stats-pct">({stats.questionnaire.contact_consent.yes.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-row">
              <span className="admin-stats-label">Anonymous</span>
              <span className="admin-stats-value">
                {stats.questionnaire.contact_consent.no.count}
                <span className="admin-stats-pct">({stats.questionnaire.contact_consent.no.percentage}%)</span>
              </span>
            </div>
          </div>
        </div>

        <div className="admin-stats-section">
          <h2 className="admin-section-title">Contact Submissions</h2>
          <div className="admin-stats-table">
            <div className="admin-stats-row admin-stats-total">
              <span className="admin-stats-label">Total Submissions</span>
              <span className="admin-stats-value">{stats.contact.total}</span>
            </div>
            <div className="admin-stats-divider" />
            <div className="admin-stats-row">
              <span className="admin-stats-label">New</span>
              <span className="admin-stats-value">
                {stats.contact.by_status.new.count}
                <span className="admin-stats-pct">({stats.contact.by_status.new.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-row">
              <span className="admin-stats-label">Reviewed</span>
              <span className="admin-stats-value">
                {stats.contact.by_status.reviewed.count}
                <span className="admin-stats-pct">({stats.contact.by_status.reviewed.percentage}%)</span>
              </span>
            </div>
            <div className="admin-stats-row">
              <span className="admin-stats-label">Archived</span>
              <span className="admin-stats-value">
                {stats.contact.by_status.archived.count}
                <span className="admin-stats-pct">({stats.contact.by_status.archived.percentage}%)</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminOverviewPage;

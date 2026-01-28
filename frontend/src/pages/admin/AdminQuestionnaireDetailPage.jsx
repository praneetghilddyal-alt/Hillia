import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../../components/admin/AdminLayout';
import { getQuestionnaireResponse, updateQuestionnaireResponse } from '../../services/adminApi';
import { questionnaireContent } from '../../data/mock';

/**
 * Admin Questionnaire Detail Page
 * Full response view with notes and status management
 */
const AdminQuestionnaireDetailPage = () => {
  const { responseId } = useParams();
  const navigate = useNavigate();
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    loadResponse();
  }, [responseId]);

  const loadResponse = async () => {
    try {
      setLoading(true);
      const data = await getQuestionnaireResponse(responseId);
      setResponse(data);
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
      await updateQuestionnaireResponse(responseId, {
        internal_notes: notes,
        status: status,
      });
      // Reload to confirm
      await loadResponse();
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

  const getQuestionText = (questionId) => {
    for (const section of questionnaireContent.sections) {
      for (const question of section.questions) {
        if (question.id === questionId) {
          return question.question;
        }
      }
    }
    return questionId;
  };

  const formatAnswer = (answer) => {
    if (Array.isArray(answer)) {
      return answer.join(', ');
    }
    if (typeof answer === 'object' && answer !== null) {
      return Object.entries(answer)
        .map(([key, value]) => `${key}: ${value}`)
        .join(' | ');
    }
    return String(answer);
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

  if (!response) {
    return (
      <AdminLayout>
        <div className="admin-error">Response not found</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="admin-page">
        <div className="admin-page-header">
          <button onClick={() => navigate('/admin/questionnaire')} className="admin-back-btn">
            Back to List
          </button>
          <h1 className="admin-page-title">Response Detail</h1>
          <p className="admin-page-intro">ID: {response.response_id}</p>
        </div>

        {/* Meta Information */}
        <div className="admin-detail-section">
          <h2 className="admin-section-title">Submission Meta</h2>
          <div className="admin-detail-meta">
            <div className="admin-detail-row">
              <span className="admin-detail-label">Submitted</span>
              <span className="admin-detail-value">{formatDate(response.timestamp)}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Session ID</span>
              <span className="admin-detail-value admin-mono">{response.session_id}</span>
            </div>
            <div className="admin-detail-row">
              <span className="admin-detail-label">Contact Consent</span>
              <span className="admin-detail-value">{response.wants_contact ? 'Yes' : 'No'}</span>
            </div>
          </div>
        </div>

        {/* Contact Information (if provided) */}
        {response.wants_contact && response.contact_info && (
          <div className="admin-detail-section">
            <h2 className="admin-section-title">Contact Information</h2>
            <div className="admin-detail-meta">
              {response.contact_info.email && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Email</span>
                  <span className="admin-detail-value">{response.contact_info.email}</span>
                </div>
              )}
              {response.contact_info.phone && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Phone</span>
                  <span className="admin-detail-value">{response.contact_info.phone}</span>
                </div>
              )}
              {response.contact_info.preferred && (
                <div className="admin-detail-row">
                  <span className="admin-detail-label">Preferred Contact</span>
                  <span className="admin-detail-value">{response.contact_info.preferred}</span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Responses by Section */}
        <div className="admin-detail-section">
          <h2 className="admin-section-title">Questionnaire Responses</h2>
          {Object.entries(response.sections || {}).map(([sectionId, sectionData]) => (
            <div key={sectionId} className="admin-response-section">
              <h3 className="admin-response-section-title">{sectionId}</h3>
              {Object.entries(sectionData).map(([questionId, answer]) => (
                <div key={questionId} className="admin-response-item">
                  <div className="admin-response-question">{getQuestionText(questionId)}</div>
                  <div className="admin-response-answer">{formatAnswer(answer)}</div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Free Text Responses */}
        {Object.keys(response.free_text || {}).length > 0 && (
          <div className="admin-detail-section">
            <h2 className="admin-section-title">Free Text Responses</h2>
            {Object.entries(response.free_text).map(([questionId, text]) => (
              <div key={questionId} className="admin-response-item">
                <div className="admin-response-question">{getQuestionText(questionId)}</div>
                <div className="admin-response-answer admin-response-freetext">{text}</div>
              </div>
            ))}
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
              <option value="unreviewed">Unreviewed</option>
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
              placeholder="Add internal observations, impressions, or follow-up notes..."
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

export default AdminQuestionnaireDetailPage;

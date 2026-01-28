/**
 * HILLIA API Service
 * Governance backend integration
 */

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

/**
 * Generate or retrieve session ID
 */
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('hillia_session_id');
  if (!sessionId) {
    sessionId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    sessionStorage.setItem('hillia_session_id', sessionId);
  }
  return sessionId;
};

/**
 * Submit questionnaire response
 */
export const submitQuestionnaire = async (data) => {
  try {
    const response = await fetch(`${API}/questionnaire`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        session_id: getSessionId(),
        consent: true,
        sections: data.sections || {},
        free_text: data.free_text || {},
        contact_info: data.contact_info || null,
        wants_contact: data.wants_contact || false,
      }),
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Questionnaire submission error:', error);
    // Return mock response for offline/error scenarios
    return {
      response_id: `local-${Date.now()}`,
      timestamp: new Date().toISOString(),
      status: 'received',
    };
  }
};

/**
 * Submit contact form
 */
export const submitContact = async (data) => {
  try {
    const response = await fetch(`${API}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: data.name,
        city: data.city,
        reason: data.reason,
        consent: true,
      }),
    });

    if (!response.ok) {
      throw new Error('Submission failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Contact submission error:', error);
    // Return mock response for offline/error scenarios
    return {
      submission_id: `local-${Date.now()}`,
      timestamp: new Date().toISOString(),
    };
  }
};

/**
 * Track analytics event (consent-based)
 */
export const trackEvent = async (eventType, eventData = {}, consent = true) => {
  if (!consent) return { status: 'skipped' };

  try {
    const params = new URLSearchParams({
      event_type: eventType,
      session_id: getSessionId(),
      consent: consent.toString(),
    });

    const response = await fetch(`${API}/analytics/event?${params}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    if (!response.ok) {
      return { status: 'error' };
    }

    return await response.json();
  } catch (error) {
    // Silent fail for analytics
    return { status: 'error' };
  }
};

// Event types
export const EVENTS = {
  HOMEPAGE_ENTRY: 'homepage_entry',
  INVITATION_OPENED: 'invitation_opened',
  QUESTIONNAIRE_STARTED: 'questionnaire_started',
  QUESTIONNAIRE_COMPLETED: 'questionnaire_completed',
  QUESTIONNAIRE_DROPOFF: 'questionnaire_dropoff',
  CONTACT_SUBMITTED: 'contact_submitted',
};

# HILLIA Backend Contracts

## Overview
Governance backend (not growth backend) - stores, observes, and interprets alignment signals.

## Base URL
- Production: `${REACT_APP_BACKEND_URL}/api`

## Public Endpoints

### POST /api/questionnaire
Submit questionnaire response.

**Request:**
```json
{
  "session_id": "string",
  "consent": true,
  "sections": { "section_id": { "question_id": "answer" } },
  "free_text": { "question_id": "text_response" },
  "contact_info": { "name": "", "email": "", "mobile": "" } | null,
  "wants_contact": boolean
}
```

**Response:**
```json
{
  "response_id": "uuid",
  "timestamp": "ISO8601",
  "status": "received"
}
```

### POST /api/contact
Submit contact form.

**Request:**
```json
{
  "name": "string",
  "city": "string",
  "reason": "string",
  "consent": true
}
```

**Response:**
```json
{
  "submission_id": "uuid",
  "timestamp": "ISO8601"
}
```

### POST /api/analytics/event
Track analytics event (consent-based).

**Query Params:** `event_type`, `session_id`, `consent`

**Event Types:**
- `homepage_entry`
- `invitation_opened`
- `questionnaire_started`
- `questionnaire_completed`
- `questionnaire_dropoff`
- `contact_submitted`

## Admin Endpoints (Basic Auth Required)

### GET /api/admin/questionnaire
List questionnaire responses.

### GET /api/admin/questionnaire/{response_id}
Get single response.

### PATCH /api/admin/questionnaire/{response_id}
Update status, internal notes, internal score.

### DELETE /api/admin/questionnaire/{response_id}
Hard delete (GDPR compliance).

### GET /api/admin/contact
List contact submissions.

### PATCH /api/admin/contact/{submission_id}
Update status, internal notes.

### DELETE /api/admin/contact/{submission_id}
Hard delete.

## Data Models

### QuestionnaireResponse
- Internal scores (community_fit, lifestyle_alignment, decision_maturity) - NEVER exposed to users
- Status: unreviewed | reviewed | archived

### ContactSubmission
- Status: new | reviewed | archived

## Security
- SSL mandatory
- Rate limiting on forms
- Admin auth via HTTP Basic
- Session IDs hashed before storage

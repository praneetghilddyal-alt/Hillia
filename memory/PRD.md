# HILLIA - Product Requirements Document

## Overview
HILLIA is an invitation-only branded villa community platform for Uttarakhand, India. The design philosophy is "luxury minimalist," "restrained," and "institutional." Discomfort and friction are intentional design features.

## Target Users
- **Primary**: Discerning individuals seeking a thoughtful, long-term residential community in the Uttarakhand hills
- **Admin**: Small, whitelisted team for manual review of submissions (Owner/Reviewer roles)

## Core Pages (Public)
| Page | Purpose | Status |
|------|---------|--------|
| Homepage (`/`) | Threshold experience - invitation card as sole entry point | ✅ Complete |
| Philosophy (`/philosophy`) | Community values and approach | ✅ Complete |
| Approach (`/approach`) | How engagement process works | ✅ Complete |
| Community (`/community`) | Expectations: privacy, silence, stewardship, long-term thinking | ✅ Complete |
| Questionnaire (`/questionnaire`) | Multi-step community fit assessment | ✅ Complete |
| Partners (`/partners`) | Aligned partners by category | ✅ Complete |
| Contact (`/contact`) | Conditional contact form | ✅ Complete |
| Founding Circle (`/founding-circle`) | Private charter content | ✅ Complete |
| Privacy (`/privacy`) | Data handling policy | ✅ Complete |

## Admin Interface - Reading Room (New)
| Page | Purpose | Status |
|------|---------|--------|
| Login (`/admin/login`) | Password-based auth with rate limiting | ✅ Complete |
| Overview (`/admin`) | Aggregated distributions (counts + percentages) | ✅ Complete |
| Questionnaire List (`/admin/questionnaire`) | Chronological response list with filtering | ✅ Complete |
| Questionnaire Detail (`/admin/questionnaire/:id`) | Full response + notes + status | ✅ Complete |
| Contact List (`/admin/contact`) | Chronological contact list | ✅ Complete |
| Contact Detail (`/admin/contact/:id`) | Full submission + notes + status | ✅ Complete |

## Tech Stack
- **Frontend**: React, React Router, Axios
- **Backend**: FastAPI, Pydantic, Motor (async MongoDB)
- **Database**: MongoDB
- **Styling**: Custom CSS with design system (warm neutrals, Cormorant Garamond + Inter)

## API Endpoints
### Public
- `GET /api/` - Health check
- `POST /api/questionnaire` - Submit questionnaire
- `POST /api/contact` - Submit contact form
- `POST /api/analytics/event` - Track analytics event

### Admin (Protected)
- `POST /api/admin/auth/verify` - Verify credentials
- `GET /api/admin/stats` - Aggregated statistics
- `GET /api/admin/questionnaire` - List responses
- `GET /api/admin/questionnaire/:id` - Single response
- `PATCH /api/admin/questionnaire/:id` - Update status/notes
- `DELETE /api/admin/questionnaire/:id` - Hard delete (GDPR)
- `GET /api/admin/contact` - List submissions
- `GET /api/admin/contact/:id` - Single submission  
- `PATCH /api/admin/contact/:id` - Update status/notes
- `DELETE /api/admin/contact/:id` - Hard delete (GDPR)

## Admin Credentials
- Username: `hillia_admin`
- Password: `HilliaAdmin2024`
- Auth: HTTP Basic + SHA256 password hash
- Rate Limiting: 5 failed attempts = 5 minute lockout

## Database Collections
- `questionnaire_responses` - Questionnaire submissions with internal notes/scores
- `contact_submissions` - Contact form submissions with internal notes
- `analytics_events` - Consent-based event tracking

## Design Principles
1. **Restraint over friendliness** - No excessive warmth or engagement patterns
2. **Manual over automated** - Human review, not algorithms
3. **Governance over growth** - Alignment precedes scale
4. **Text-first** - No charts, dashboards, or visual complexity in admin

## Completed Features (January 2025)
- [x] Full public site with all pages
- [x] Multi-step questionnaire with localStorage persistence
- [x] Contact form with conditional fields
- [x] Backend API with MongoDB integration
- [x] Admin Interface v1 (Reading Room)
  - [x] Password-based auth with rate limiting
  - [x] Overview with aggregated stats
  - [x] Questionnaire response viewing + notes + status
  - [x] Contact submission viewing + notes + status
  - [x] Status workflow: unreviewed → reviewed → archived

## P1 - Next Tasks
- [ ] Manual scoring logic (Low/Medium/High for community_fit, lifestyle_alignment, decision_maturity)
- [ ] ESLint warning fix in QuestionnairePage.jsx

## P2 - Future/Backlog
- [ ] Analytics activation (Google Analytics, Meta Pixel) - requires tracking IDs
- [ ] 2FA for admin interface
- [ ] QuestionnairePage.jsx refactor into smaller components
- [ ] Export functionality for admin data

## Excluded (by design)
- CRM automation
- Email sequences
- Automated scoring/ranking
- User-facing lead scoring
- Performance dashboards
- OAuth/SSO for admin

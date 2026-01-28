// HILLIA Mock Data
// Frontend-first architecture - backend-ready structure

export const siteConfig = {
  name: 'HILLIA',
  tagline: 'by invitation',
  meta: {
    title: 'Hillia | By Invitation',
    description: 'An invitation-only exploration of living in the Uttarakhand hills.',
  },
};

export const homepageContent = {
  entryText: [
    'Living in the hills means different things to different people.',
    'Hillia exists to understand whether those differences can coexist.',
  ],
  ctaLabel: 'Enter',
};

export const philosophyContent = {
  title: 'Philosophy',
  intro: 'An understanding that precedes all else.',
  paragraphs: [
    'Hillia was not created to sell property. It was created to find alignment — between people, place, and pace.',
    'The Uttarakhand hills demand a certain kind of attention. A willingness to slow down, to observe, to let the land speak before speaking over it. Not everyone who seeks a home in these hills is prepared to listen.',
    'We believe that a community is not made by proximity alone. It is made by shared sensibilities — about silence, about privacy, about the kind of life worth building when the noise of the city is finally left behind.',
    'Hillia does not optimise for volume, speed, or persuasion. Alignment precedes growth. If a feature improves conversion but weakens alignment, it is rejected. If a potential resident increases revenue but disrupts coherence, they are not the right fit.',
    'We collect information not to sell, but to understand. Data here is treated as responsibility, not asset. Every response is read by a person, never processed by algorithm alone.',
    'This is not a platform for everyone. It is a platform for those who understand that some things cannot be rushed — and should not be.',
  ],
};

export const communityContent = {
  title: 'Community',
  intro: 'Expectations, not amenities.',
  blocks: [
    {
      title: 'Privacy',
      text: 'Residents value discretion. There is no expectation of social performance, no pressure to participate in community events, no shared calendars or group activities unless explicitly sought. A neighbour here is someone who respects distance as much as presence.',
    },
    {
      title: 'Silence',
      text: 'Sound carries in the hills. Construction, music, gatherings — all are subject to unwritten but deeply held norms. Those who seek the hills for escape must also be willing to preserve the silence for others.',
    },
    {
      title: 'Stewardship',
      text: 'The land is not a backdrop. Residents are expected to engage with the ecology — to understand water, soil, and slope. Building here is not about imposing a vision; it is about integrating with what already exists.',
    },
    {
      title: 'Long-term thinking',
      text: 'This is not a weekend retreat market. Hillia is designed for those thinking in decades, not seasons. Appreciation, resale, rental yield — these are not the metrics by which we evaluate fit.',
    },
  ],
};

export const approachContent = {
  title: 'Approach',
  intro: 'How we work.',
  paragraphs: [
    'Every engagement begins with a questionnaire. It is not a form — it is a conversation, designed to surface values, preferences, and expectations that are rarely discussed in traditional property transactions.',
    'Responses are reviewed manually. There is no scoring algorithm that determines approval. Instead, our team reads each submission carefully, looking for signals of alignment with the community we are building.',
    'If alignment is found, a conversation follows. If not, we decline — respectfully, without explanation beyond what is necessary. We do not negotiate on fit.',
    'For those who proceed, the journey is deliberately slow. Site visits are unhurried. Decisions are given time. Pressure is absent because it has no place in the kind of purchase we facilitate.',
    'We work with a limited number of advisors who share our values. They are not incentivised by volume. They are selected for judgement.',
  ],
};

export const partnersContent = {
  title: 'Partners',
  intro: "Partners listed here are aligned with Hillia's approach to stewardship, discretion, and long-term community thinking. They are not engaged to promote, scale, or monetise the platform. They are present to help protect its intent.",
  categories: [
    {
      title: 'Stewardship & Spatial Thinking',
      description: 'Individuals and practices aligned on restraint in hillside development, long-term spatial coherence, and building only what can age quietly.',
      disclaimer: 'Not involved in sales, marketing, or volume-led expansion.',
    },
    {
      title: 'Operations & Long-Term Care',
      description: 'Partners aligned on maintenance standards, shared infrastructure discipline, and the long view of how communities function over decades.',
      disclaimer: 'Not involved in short-term optimisation or yield-driven decisions.',
    },
    {
      title: 'Legal, Governance & Process',
      description: 'Advisors aligned on clean title, transparent structuring, and decision-making frameworks that privilege clarity over speed.',
      disclaimer: 'Not involved in deal sourcing or brokerage.',
    },
    {
      title: 'Cultural & Community Alignment',
      description: 'Individuals aligned on the belief that community quality is shaped as much by behaviour as by architecture.',
      disclaimer: 'Not involved in screening individuals; alignment is assessed holistically.',
    },
  ],
  independenceClause: 'Partners operate independently and are listed here solely to reflect alignment of values and responsibility, not endorsement or affiliation.',
  closing: 'Hillia remains accountable for all decisions.',
};

export const contactContent = {
  title: 'Contact',
  intro: 'Reach out only if there is genuine intent.',
};

export const questionnaireContent = {
  title: 'Community Fit Questionnaire',
  subtitle: 'Invitation-Only Branded Villa Communities | Uttarakhand Hills',
  intro: 'A conversation, not a form.',
  introNote: {
    paragraphs: [
      'This questionnaire helps us understand how different people imagine life in the hills.',
      'There are no right or wrong answers.',
      'Most responses remain anonymous.',
      'Contact details are optional and shared only if you choose.',
    ],
    usedFor: [
      'community understanding',
      'design and planning',
      'long-term relevance',
    ],
    disclaimer: 'They are never used for automated decisions or sales.',
  },
  sections: [
    {
      id: 'life-stage',
      title: 'Life Stage & Context',
      label: 'Section A',
      questions: [
        {
          id: 'q1-life-phase',
          question: 'Which stage best describes your current life phase?',
          type: 'single',
          options: [
            'Actively building career / enterprise',
            'Established career / business consolidation',
            'Transitioning to a slower pace of life',
            'Semi-retired / retired',
          ],
        },
        {
          id: 'q2-life-context',
          question: 'Is there any context you'd like to share about your current phase of life?',
          type: 'text',
          placeholder: '',
          optional: true,
        },
        {
          id: 'q3-household',
          question: 'Which best describes your household composition?',
          type: 'single',
          options: [
            'Individual / couple',
            'Couple with young children',
            'Couple with teenage children',
            'Empty nest / children living independently',
          ],
        },
      ],
    },
    {
      id: 'education',
      title: 'Education & Intellectual Orientation',
      label: 'Section B',
      questions: [
        {
          id: 'q4-education',
          question: 'Highest level of formal education completed',
          type: 'single',
          options: [
            'Undergraduate',
            'Postgraduate',
            'Doctoral / professional specialisation',
            'Prefer not to specify',
          ],
        },
        {
          id: 'q5-activities',
          question: 'Which activities do you naturally gravitate towards in your free time?',
          type: 'multiselect',
          maxSelect: 3,
          options: [
            'Reading / learning',
            'Arts, music, cinema, culture',
            'Entrepreneurship / investing / business thinking',
            'Spiritual or contemplative practices',
            'Outdoor activities (walking, trekking, nature)',
            'Hosting small gatherings',
            'Solitary / quiet pursuits',
          ],
        },
      ],
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Rhythm & Social Energy',
      label: 'Section C',
      questions: [
        {
          id: 'q6-recharge',
          question: 'Which environment helps you recharge best?',
          type: 'single',
          options: [
            'Silence and solitude',
            'Quiet surroundings with occasional interaction',
            'Small, familiar social groups',
            'Active, socially engaging environments',
          ],
        },
        {
          id: 'q7-second-home-use',
          question: 'How do you expect to use a second home in the hills?',
          type: 'single',
          options: [
            'Mostly private retreat',
            'Occasional social interaction',
            'Enjoy planned community moments',
            'Flexible / seasonal',
          ],
        },
        {
          id: 'q8-hosting',
          question: 'How often do you expect to host friends or extended family?',
          type: 'single',
          options: [
            'Rarely',
            'Occasionally',
            'Regularly',
            'Seasonally',
          ],
        },
      ],
    },
    {
      id: 'values',
      title: 'Values & Boundaries',
      label: 'Section D',
      questions: [
        {
          id: 'q9-importance',
          question: 'How important are the following in a shared residential community?',
          type: 'matrix',
          rows: ['Privacy', 'Silence / low noise', 'Order & maintenance', 'Respect for common rules', 'Environmental sensitivity'],
          columns: ['Very Important', 'Important', 'Neutral', 'Not Important'],
        },
        {
          id: 'q10-shared-spaces',
          question: 'In shared spaces, which best reflects your comfort level?',
          type: 'single',
          options: [
            'Prefer minimal shared use',
            'Comfortable with structured shared use',
            'Comfortable with informal shared use',
          ],
        },
        {
          id: 'q11-boundaries',
          question: 'Any additional thoughts on boundaries or shared living?',
          type: 'text',
          placeholder: '',
          optional: true,
        },
      ],
    },
    {
      id: 'decision-style',
      title: 'Decision-Making & Behavioural Style',
      label: 'Section E',
      questions: [
        {
          id: 'q12-disagreements',
          question: 'When disagreements arise, you usually prefer to:',
          type: 'single',
          options: [
            'Adjust quietly',
            'Discuss and resolve informally',
            'Use structured processes',
          ],
        },
        {
          id: 'q13-decisions',
          question: 'Which best describes how you make decisions?',
          type: 'single',
          options: [
            'Quickly and intuitively',
            'Carefully and analytically',
            'In consultation with family / advisors',
          ],
        },
        {
          id: 'q14-risk',
          question: 'How do you generally approach risk?',
          type: 'single',
          options: [
            'Conservative',
            'Balanced',
            'Experimental',
          ],
        },
      ],
    },
    {
      id: 'pets-children',
      title: 'Pets, Children & Shared Life',
      label: 'Section F',
      questions: [
        {
          id: 'q15-pets',
          question: 'Your perspective on pets in residential communities:',
          type: 'single',
          options: [
            'I own pets and value pet-friendly environments',
            'Comfortable around pets',
            'Prefer limited pet presence',
            'Prefer pet-free environments',
          ],
        },
        {
          id: 'q16-children',
          question: 'Your comfort with children in shared spaces:',
          type: 'single',
          options: [
            'Comfortable and welcoming',
            'Comfortable with boundaries',
            'Prefer limited presence',
            'Prefer adult-oriented spaces',
          ],
        },
      ],
    },
    {
      id: 'home-config',
      title: 'Home Configuration & Value',
      label: 'Section G',
      questions: [
        {
          id: 'q17-configuration',
          question: 'Which home configurations interest you?',
          type: 'single',
          options: [
            '2 BHK',
            '3 BHK',
            '3 BHK + Study',
            'Villa',
          ],
        },
        {
          id: 'q18-budget',
          question: 'Indicative willingness to spend (non-binding):',
          type: 'matrix',
          rows: ['2 BHK', '3 BHK', '3 BHK + Study', 'Villa'],
          columns: ['₹2–2.5 Cr', '₹2.5–3.5 Cr', '₹3.5–4.5 Cr', '₹5 Cr+'],
        },
        {
          id: 'q19-features',
          question: 'Which premium features matter to you?',
          type: 'multiselect',
          maxSelect: 7,
          options: [
            'Lake view',
            'Forest view',
            'Isolated / low density',
            'Personal pool',
            'Large bathrooms / tubs',
            'Storage / utility spaces',
            'Clubhouse access',
          ],
        },
      ],
    },
    {
      id: 'community-expectations',
      title: 'Community Expectations',
      label: 'Section H',
      questions: [
        {
          id: 'q20-negative-impact',
          question: 'What would most negatively impact your experience?',
          type: 'multiselect',
          maxSelect: 2,
          options: [
            'Noise / disturbance',
            'Poor maintenance',
            'Unclear rules',
            'Excessive social intrusion',
            'Lack of shared values',
          ],
        },
        {
          id: 'q21-ideal-community',
          question: 'In one sentence, what kind of community would you most enjoy being part of?',
          type: 'text',
          placeholder: '',
        },
      ],
    },
    {
      id: 'cultural-signals',
      title: 'Cultural Signals',
      label: 'Section I',
      optional: true,
      questions: [
        {
          id: 'q22-last-book',
          question: 'Last book you read',
          type: 'text',
          placeholder: '',
          optional: true,
        },
        {
          id: 'q23-last-film',
          question: 'Last film / series you watched',
          type: 'text',
          placeholder: '',
          optional: true,
        },
        {
          id: 'q24-three-words',
          question: 'Describe yourself in three words',
          type: 'text',
          placeholder: '',
          optional: true,
        },
      ],
    },
  ],
  contactSection: {
    id: 'contact',
    title: 'Optional Contact',
    label: 'Section J',
    consentQuestion: {
      id: 'q25-contact-consent',
      question: 'Would you like to be contacted for future conversations?',
      type: 'single',
      options: ['Yes', 'No'],
    },
    preferredContact: {
      id: 'preferred-contact',
      question: 'Preferred means of communication',
      type: 'single',
      optional: true,
      options: ['Email', 'Phone', 'WhatsApp', 'No preference'],
    },
    fields: [
      { id: 'email', label: 'Email', type: 'email', optional: true },
      { id: 'phone', label: 'Phone', type: 'tel', optional: true },
    ],
  },
  completion: {
    title: 'Submitted',
    message: 'Your responses have been received. If there is alignment, you will hear from us. If not, we wish you well in your search.',
    anonymousMessage: 'Your anonymous responses have been received.',
  },
};

export const privacyContent = {
  title: 'Privacy',
  intro: 'How we handle your information.',
  sections: [
    {
      title: 'What we collect',
      text: 'Optional personal identifiers, lifestyle and preference indicators, indicative budget ranges, qualitative cultural responses, and anonymous technical usage data.',
    },
    {
      title: 'How we use it',
      text: 'Internal research and design intelligence, community compatibility assessment, opt-in future communication, and aggregate anonymised insights.',
    },
    {
      title: 'Retention',
      text: 'Data is retained for 36 months by default, or deleted earlier upon request.',
    },
    {
      title: 'Your rights',
      text: 'You may request access, correction, withdrawal of consent, or deletion at any time by writing to privacy@hillia.in.',
    },
  ],
};

export const navigationLinks = [
  { label: 'Philosophy', path: '/philosophy' },
  { label: 'Approach', path: '/approach' },
  { label: 'Community', path: '/community' },
  { label: 'Questionnaire', path: '/questionnaire' },
  { label: 'Partners', path: '/partners' },
  { label: 'Contact', path: '/contact' },
];

// Local storage keys for questionnaire
export const STORAGE_KEYS = {
  QUESTIONNAIRE_RESPONSES: 'hillia_questionnaire_responses',
  QUESTIONNAIRE_PROGRESS: 'hillia_questionnaire_progress',
  HAS_ENTERED: 'hillia_has_entered',
  CONTACT_SUBMISSIONS: 'hillia_contact_submissions',
};

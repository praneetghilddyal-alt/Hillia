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
  intro: 'Those we work with.',
  partners: [
    {
      name: 'Architectural Advisors',
      role: 'Design guidance for terrain-sensitive construction',
    },
    {
      name: 'Land Consultants',
      role: 'Due diligence and regulatory navigation',
    },
    {
      name: 'Stewardship Services',
      role: 'Ongoing property care and estate management',
    },
  ],
};

export const contactContent = {
  title: 'Contact',
  intro: 'Reach out only if there is genuine intent.',
  fields: [
    { name: 'name', label: 'Name', type: 'text', required: true },
    { name: 'city', label: 'City', type: 'text', required: true },
    { name: 'reason', label: 'Reason for reaching out', type: 'textarea', required: true },
  ],
  disclaimer: 'Submissions are reviewed manually. Response times vary. We do not respond to inquiries that lack specificity.',
};

export const questionnaireContent = {
  title: 'Questionnaire',
  intro: 'A conversation, not a form.',
  sections: [
    {
      id: 'life-stage',
      title: 'Life Stage',
      questions: [
        {
          id: 'age-range',
          question: 'Where are you in life?',
          type: 'single',
          options: [
            'Early career, building foundations',
            'Mid-career, established but seeking change',
            'Later career, preparing for transition',
            'Post-career, focused on what matters',
          ],
        },
        {
          id: 'primary-residence',
          question: 'This property would be:',
          type: 'single',
          options: [
            'A primary residence',
            'A secondary home, visited regularly',
            'A future retirement destination',
            'An investment with occasional use',
          ],
        },
      ],
    },
    {
      id: 'lifestyle',
      title: 'Lifestyle Rhythm',
      questions: [
        {
          id: 'time-in-hills',
          question: 'How much time do you envision spending in the hills annually?',
          type: 'single',
          options: [
            'Less than one month',
            'One to three months',
            'Three to six months',
            'More than six months',
          ],
        },
        {
          id: 'remote-work',
          question: 'Do you work remotely?',
          type: 'single',
          options: [
            'Yes, entirely',
            'Yes, partially',
            'No, but transitioning',
            'No, and not planning to',
          ],
        },
      ],
    },
    {
      id: 'values',
      title: 'Values & Boundaries',
      questions: [
        {
          id: 'silence-importance',
          question: 'How important is silence to you?',
          type: 'single',
          options: [
            'Essential — it is why I seek the hills',
            'Important — but not at the cost of community',
            'Neutral — I adapt to my environment',
            'Not a priority',
          ],
        },
        {
          id: 'privacy-expectation',
          question: 'Your expectation of privacy:',
          type: 'single',
          options: [
            'Complete — I prefer minimal interaction',
            'High — neighbourly but not social',
            'Moderate — open to selective engagement',
            'Low — I enjoy active community life',
          ],
        },
      ],
    },
    {
      id: 'spatial',
      title: 'Spatial Needs',
      questions: [
        {
          id: 'configuration',
          question: 'What configuration suits your needs?',
          type: 'single',
          options: [
            '2 BHK — compact, efficient',
            '3 BHK — room for family or guests',
            '3 BHK + Study — space for focused work',
            'Villa — independent, generous',
          ],
        },
        {
          id: 'outdoor-space',
          question: 'Outdoor space preference:',
          type: 'single',
          options: [
            'Minimal — a balcony or terrace suffices',
            'Moderate — a garden or courtyard',
            'Generous — land to tend and walk',
            'Expansive — acreage matters',
          ],
        },
      ],
    },
    {
      id: 'budget',
      title: 'Budget & Willingness',
      questions: [
        {
          id: 'budget-range',
          question: 'Your indicative budget range:',
          type: 'single',
          options: [
            'Under ₹1 crore',
            '₹1 crore – ₹2 crore',
            '₹2 crore – ₹4 crore',
            'Above ₹4 crore',
          ],
        },
        {
          id: 'decision-timeline',
          question: 'When do you see yourself making a decision?',
          type: 'single',
          options: [
            'Within the next six months',
            'Within the next year',
            'Within the next two years',
            'No fixed timeline — exploring',
          ],
        },
      ],
    },
    {
      id: 'cultural',
      title: 'Cultural Signals',
      questions: [
        {
          id: 'last-book',
          question: 'The last book you read:',
          type: 'text',
          placeholder: 'Title and author, if you recall',
        },
        {
          id: 'last-film',
          question: 'The last film you watched:',
          type: 'text',
          placeholder: 'Title',
        },
        {
          id: 'three-words',
          question: 'Describe yourself in three words:',
          type: 'text',
          placeholder: '',
        },
      ],
    },
  ],
  completion: {
    title: 'Submitted',
    message: 'Your responses have been received. If there is alignment, you will hear from us. If not, we wish you well in your search.',
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

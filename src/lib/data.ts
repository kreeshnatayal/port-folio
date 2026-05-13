export const navigation = [
  { href: '#operator-file', label: 'OPERATOR FILE' },
  { href: '#mission-archive', label: 'MISSION ARCHIVE' },
  { href: '#mission-log', label: 'MISSION LOG' },
  { href: '#skill-matrix', label: 'SKILL MATRIX' },
  { href: '#transmission', label: 'TRANSMISSION' },
];

export const postCheckLines = [
  'BIOS v2.001 — KRISHNA TAYAL SYSTEMS',
  'POST CHECK: MEMORY BANKS... OK',
  'POST CHECK: VIDEO SUBSYSTEM... OK',
  'POST CHECK: NEURAL INTERFACE... DEGRADED',
  'WARNING: EMOTIONAL STABILITY — NOT FOUND',
  'WARNING: SLEEP SCHEDULE — UNRECOGNIZED',
  'LOADING OPERATOR PROFILE...',
  'MOUNTING ARCHIVE SECTORS...',
  'SYSTEM INTEGRITY: ACCEPTABLE (BARELY)',
  'INITIALIZING RECOVERED INTERFACE...',
];

export const systemNotifications: Array<{
  delay: number;
  type: 'achievement' | 'warning' | 'system' | 'glitch';
  title: string;
  body: string;
}> = [
  { delay: 2500,  type: 'system',      title: 'SYSTEM CHECK',          body: 'Emotional stability: NOT FOUND' },
  { delay: 8000,  type: 'achievement', title: 'ACHIEVEMENT UNLOCKED',   body: '"First Contact" — Archive accessed' },
  { delay: 16000, type: 'warning',     title: '⚠ RECRUITER DETECTED',   body: 'Sector 7 — Recommend caution' },
  { delay: 24000, type: 'system',      title: 'SIDE QUESTS',            body: 'Currently active: 3 / Completed: never' },
  { delay: 32000, type: 'glitch',      title: '//ERROR//',              body: 'Corporate alignment: OPTIONAL' },
  { delay: 40000, type: 'achievement', title: 'ACHIEVEMENT UNLOCKED',   body: '"Still Reading" — Uncommon' },
  { delay: 48000, type: 'warning',     title: '⚠ WARNING',              body: 'Stakeholder alignment still pending' },
];

export const ambientMessages = [
  'SYSTEM STABILITY: ACCEPTABLE',
  'STAKEHOLDER ALIGNMENT: PENDING',
  'OPTIMIZED FOR CURIOSITY',
  'BUILT UNDER QUESTIONABLE SLEEP CONDITIONS',
  'COGNITIVE LOAD: CONTROLLED',
  'NARRATIVE COHERENCE: HIGH',
  'SIDE QUESTS ACTIVE',
  'CORPORATE ALIGNMENT: OPTIONAL',
];

export const operatorProfile = {
  designation: 'CREATIVE SYSTEMS OPERATOR',
  classification: 'ACTIVE',
  sectors: ['PRODUCT STRATEGY', 'AI SYSTEMS', "FOUNDER'S OFFICE", 'NARRATIVE ARCHITECTURE'],
  psychProfile:
    'Subject exhibits high ambiguity tolerance, strong narrative synthesis, and an unusual ability to turn chaos into executable structure. Possibly dangerous to bad product decisions.',
  strengthVector:
    'Turns scattered context into a clear operating narrative people can actually move on.',
  operatingMode: 'Creative systems thinker with product, strategy, and AI instincts.',
  knownWeaknesses: 'Sleep schedule. Questionable coffee intake. Will redesign the problem before solving it.',
  targetEnvironments: ["Founder's Office", 'PM', 'APM', 'AI PM', 'EIR', 'Strategy Operator'],
};

export const missions = [
  {
    id: 'MSN-001',
    classification: 'STRATEGIC PRODUCT',
    status: 'COMPLETE',
    difficulty: '████░',
    title: 'AI Workflow Command Center',
    briefing:
      'Design a high-clarity workflow layer for AI-powered operations — turning fragmented requests, competing priorities, and review cycles into one usable decision system.',
    outcome: 'Improved decision visibility, reduced coordination drag, made the AI layer feel operational instead of ornamental.',
    operativeRole: 'Product Strategy / AI PM',
    tools: ['Product strategy', 'Workflow design', 'AI systems', 'Cross-functional synthesis'],
  },
  {
    id: 'MSN-002',
    classification: 'GROWTH NARRATIVE',
    status: 'COMPLETE',
    difficulty: '███░░',
    title: 'Growth Narrative Reframing',
    briefing:
      'Rebuild product positioning around user psychology and behavior — translating feature sprawl into a sharper adoption story with cleaner conversion paths.',
    outcome: 'Stronger narrative cohesion, clearer user understanding, fewer "what does this actually do?" conversations.',
    operativeRole: 'PM / Growth Strategy',
    tools: ['Messaging architecture', 'Behavioral insight', 'Growth loops', 'Story systems'],
  },
  {
    id: 'MSN-003',
    classification: 'OPERATIONAL SYSTEM',
    status: 'ACTIVE',
    difficulty: '█████',
    title: 'Founder Operating Layer',
    briefing:
      "Build lightweight planning and execution systems for fast-moving founder environments where strategy, follow-through, and cross-team visibility need one shared frame — without becoming another process layer.",
    outcome: 'Improved alignment across moving priorities without adding process theater or spreadsheet fatigue.',
    operativeRole: "Founder's Office / Operator",
    tools: ['Operating systems', 'Decision design', 'Execution cadence', 'Strategic synthesis'],
  },
];

export const missionLog = [
  {
    period: 'CURRENT — ONGOING',
    title: 'PRODUCT + SYSTEMS OPERATOR',
    classification: 'ACTIVE DEPLOYMENT',
    log: 'Working across product strategy, AI opportunity framing, workflows, narrative clarity, and operational design. Building the muscle for high-ambiguity, high-velocity environments.',
  },
  {
    period: 'PREVIOUS — COMPLETED',
    title: 'CROSS-FUNCTIONAL BUILDER',
    classification: 'ARCHIVED',
    log: 'Collaborated across product, design, growth, and business contexts to turn ambiguity into clearer bets, sharper execution paths, and stories people could actually align around.',
  },
  {
    period: 'FOUNDATION — ORIGIN',
    title: 'INTERNET-NATIVE STORYTELLER',
    classification: 'CORE ATTRIBUTE',
    log: 'Developed strong instinct for interfaces, digital behavior, and cultural signal without confusing trend awareness for judgment. The foundation everything else runs on.',
  },
];

export const skillMatrix = [
  {
    code: 'SKL-01',
    title: 'Narrative Systems',
    rating: '████████░░',
    body: 'Builds stories that align product direction, team decisions, and user understanding.',
  },
  {
    code: 'SKL-02',
    title: 'Decision Architecture',
    rating: '███████░░░',
    body: 'Creates structure for better prioritization, cleaner trade-offs, and less strategic fog.',
  },
  {
    code: 'SKL-03',
    title: 'Interface Taste',
    rating: '████████░░',
    body: 'Understands that what feels intuitive is the result of deliberate sequencing and restraint.',
  },
  {
    code: 'SKL-04',
    title: 'Cultural Signal',
    rating: '█████████░',
    body: 'Reads internet-native patterns with enough distance to use them intelligently.',
  },
];

export const contactChannels = [
  { label: 'EMAIL',    value: 'krishna@houseofprama.com', href: 'mailto:krishna@houseofprama.com', protocol: 'SMTP/TLS' },
  { label: 'LINKEDIN', value: 'Connect on LinkedIn',       href: 'https://linkedin.com/in/krishnatayal', protocol: 'HTTP/2' },
  { label: 'RESUME',   value: 'Download PDF Dossier',      href: '#',                               protocol: 'PDF/1.7' },
];

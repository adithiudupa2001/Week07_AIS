import { QuadrantId, QuadrantInfo, Stage, TaskStep } from '../types';

export const QUADRANTS: Record<QuadrantId, QuadrantInfo> = {
  'person-leads': {
    id: 'person-leads',
    title: 'A person leads, AI inside',
    rowLabel: 'Work that people and AI must do together',
    colLabel: 'Work with a right answer',
    bgClass: 'bg-[#F4EEFD] dark:bg-[#231A33]/70',
    borderClass: 'border-purple-200/80 dark:border-purple-900/60',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
  },
  'agents-run': {
    id: 'agents-run',
    title: 'Agents run it, a person judges',
    rowLabel: 'Work that people and AI must do together',
    colLabel: 'Work with no single right answer',
    bgClass: 'bg-[#EDF2F7] dark:bg-[#1A2332]/70',
    borderClass: 'border-slate-200/90 dark:border-slate-800/80',
    badgeBg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  },
  'ai-alone': {
    id: 'ai-alone',
    title: 'AI alone, with checks',
    rowLabel: 'Work that either of them can do alone',
    colLabel: 'Work with a right answer',
    bgClass: 'bg-[#EDF2F7] dark:bg-[#1A2332]/70',
    borderClass: 'border-slate-200/90 dark:border-slate-800/80',
    badgeBg: 'bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
  },
  'person-decides': {
    id: 'person-decides',
    title: 'A person decides, AI alongside',
    rowLabel: 'Work that either of them can do alone',
    colLabel: 'Work with no single right answer',
    bgClass: 'bg-[#F4EEFD] dark:bg-[#231A33]/70',
    borderClass: 'border-purple-200/80 dark:border-purple-900/60',
    badgeBg: 'bg-purple-100 text-purple-800 dark:bg-purple-950/80 dark:text-purple-300',
  },
};

export const STAGE_CONFIG: Record<
  Stage,
  {
    name: Stage;
    colorHex: string;
    labelColor: string;
    dotClass: string;
    activeChipClass: string;
    borderClass: string;
    textColor: string;
  }
> = {
  Find: {
    name: 'Find',
    colorHex: '#0D9488', // Teal
    labelColor: 'text-teal-700 dark:text-teal-400',
    dotClass: 'bg-teal-600 dark:bg-teal-400',
    activeChipClass: 'bg-teal-600 text-white border-teal-600 shadow-sm hover:bg-teal-700',
    borderClass: 'border-teal-500/30 dark:border-teal-400/30',
    textColor: 'text-teal-800 dark:text-teal-200',
  },
  Sort: {
    name: 'Sort',
    colorHex: '#1E3A8A', // Navy
    labelColor: 'text-[#1E3A8A] dark:text-blue-300',
    dotClass: 'bg-[#1E3A8A] dark:bg-blue-400',
    activeChipClass: 'bg-[#1E3A8A] text-white border-[#1E3A8A] shadow-sm hover:bg-[#172554]',
    borderClass: 'border-[#1E3A8A]/30 dark:border-blue-400/30',
    textColor: 'text-blue-900 dark:text-blue-200',
  },
  Draft: {
    name: 'Draft',
    colorHex: '#D97706', // Amber
    labelColor: 'text-amber-700 dark:text-amber-400',
    dotClass: 'bg-amber-500 dark:bg-amber-400',
    activeChipClass: 'bg-amber-600 text-white border-amber-600 shadow-sm hover:bg-amber-700',
    borderClass: 'border-amber-500/30 dark:border-amber-400/30',
    textColor: 'text-amber-900 dark:text-amber-200',
  },
  Send: {
    name: 'Send',
    colorHex: '#DC2626', // Red
    labelColor: 'text-red-700 dark:text-red-400',
    dotClass: 'bg-red-600 dark:bg-red-400',
    activeChipClass: 'bg-red-600 text-white border-red-600 shadow-sm hover:bg-red-700',
    borderClass: 'border-red-500/30 dark:border-red-400/30',
    textColor: 'text-red-900 dark:text-red-200',
  },
};

export const TASK_STEPS: TaskStep[] = [
  {
    id: 1,
    stage: 'Find',
    name: "Pull today's unread emails",
    quadrantId: 'ai-alone',
    quadrantName: 'AI alone, with checks',
    reason: '"Unread" is a status the system can read; there is one correct list.',
  },
  {
    id: 2,
    stage: 'Find',
    name: 'Find threads I never replied to',
    quadrantId: 'ai-alone',
    quadrantName: 'AI alone, with checks',
    reason: 'Whether a reply was sent is a fact in the mailbox, so AI can find it alone.',
  },
  {
    id: 3,
    stage: 'Find',
    name: 'Skip newsletters and auto-alerts',
    quadrantId: 'ai-alone',
    quadrantName: 'AI alone, with checks',
    reason: 'Sender patterns are rule-based; a weekly spot-check catches mistakes.',
  },
  {
    id: 4,
    stage: 'Find',
    name: 'Confirm no professor email was skipped',
    quadrantId: 'ai-alone',
    quadrantName: 'AI alone, with checks',
    reason: 'This is the check itself: a count of @smu.edu.sg senders against the filtered list.',
  },
  {
    id: 5,
    stage: 'Sort',
    name: 'Decide which emails need a reply',
    quadrantId: 'person-leads',
    quadrantName: 'A person leads, AI inside',
    reason: 'There is a right answer, but it depends on my courses and commitments, so I set the rules.',
  },
  {
    id: 6,
    stage: 'Sort',
    name: 'Set reply-by deadlines',
    quadrantId: 'person-leads',
    quadrantName: 'A person leads, AI inside',
    reason: 'Professor emails same day, CCA emails within two days: my priorities, applied by AI.',
  },
  {
    id: 7,
    stage: 'Sort',
    name: 'Spot group-project emails that need me',
    quadrantId: 'person-leads',
    quadrantName: 'A person leads, AI inside',
    reason: 'Only I know my role in each group, so AI flags and I confirm.',
  },
  {
    id: 8,
    stage: 'Draft',
    name: 'Draft replies into my Drafts folder',
    quadrantId: 'agents-run',
    quadrantName: 'Agents run it, a person judges',
    reason: 'A reply can be worded many good ways, so AI drafts and I judge.',
  },
  {
    id: 9,
    stage: 'Draft',
    name: 'Write a brief and a detailed version',
    quadrantId: 'agents-run',
    quadrantName: 'Agents run it, a person judges',
    reason: 'Offering two options lets me pick the tone, with no single right one.',
  },
  {
    id: 10,
    stage: 'Draft',
    name: 'List the replies I still owe',
    quadrantId: 'agents-run',
    quadrantName: 'Agents run it, a person judges',
    reason: 'AI assembles the list; I judge what really matters tonight.',
  },
  {
    id: 11,
    stage: 'Send',
    name: 'Reply about grades, extensions or offers',
    quadrantId: 'person-decides',
    quadrantName: 'A person decides, AI alongside',
    reason: 'High stakes for my grades and career; AI gives context, I write and own it.',
  },
  {
    id: 12,
    stage: 'Send',
    name: 'Send now or wait until morning',
    quadrantId: 'person-decides',
    quadrantName: 'A person decides, AI alongside',
    reason: 'Timing and tone are judgment calls; nothing is ever sent automatically.',
  },
];

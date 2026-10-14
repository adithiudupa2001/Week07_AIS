export type Stage = 'Find' | 'Sort' | 'Draft' | 'Send';

export type QuadrantId = 'person-leads' | 'agents-run' | 'ai-alone' | 'person-decides';

export interface QuadrantInfo {
  id: QuadrantId;
  title: string;
  rowLabel: string;
  colLabel: string;
  bgClass: string;
  borderClass: string;
  badgeBg: string;
}

export interface TaskStep {
  id: number;
  stage: Stage;
  name: string;
  quadrantId: QuadrantId;
  quadrantName: string;
  reason: string;
}

export interface GuessFeedback {
  stepId: number;
  stepName: string;
  guessedQuadrantId: QuadrantId;
  correctQuadrantId: QuadrantId;
  isCorrect: boolean;
  message: string;
}

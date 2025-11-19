export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface ScorecardEntry {
  id: string;
  hole: number;
  metric: string; // e.g., "Squirrels Startled", "Divots Exploded"
  score: number;
}

export enum AppView {
  CHAT = 'CHAT',
  ANALYZER = 'ANALYZER',
  SCORECARD = 'SCORECARD'
}

export interface AnalysisResult {
  verdict: string;
  confidence: number;
  advice: string;
}
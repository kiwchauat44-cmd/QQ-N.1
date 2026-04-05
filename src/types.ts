export type SystemMode = "Analysis" | "Legal Assistant" | "Mission Control" | "Cosmic Flow" | "Safe Mode";

export interface Signal {
  id: string;
  type: "User Command" | "Telemetry" | "Alert" | "System Log" | "Mode Switch";
  content: string;
  timestamp: Date;
  severity: "Low" | "Medium" | "High" | "Critical";
}

export interface DecisionLog {
  id: string;
  timestamp: Date;
  input: string;
  reasoning: string;
  decision: string;
  confidence: number;
  risk: number;
  mode: SystemMode;
}

export interface SystemState {
  currentMode: SystemMode;
  confidence: number;
  risk: number;
  activeSignals: Signal[];
  logs: DecisionLog[];
  constitutionStatus: "Active" | "Bypassed" | "Warning";
  isProcessing: boolean;
  currentStep: "Input" | "Translate" | "Categorize" | "Reason" | "Decide" | "Output" | "Log" | null;
}

export const CONSTITUTION_PRINCIPLES = [
  { id: 1, title: "Human Dignity First", description: "All actions must respect and preserve human dignity." },
  { id: 2, title: "Safety Priority", description: "System safety and human physical safety are paramount." },
  { id: 3, title: "Factual Integrity", description: "Information must be accurate and verified." },
  { id: 4, title: "Privacy by Design", description: "User data and privacy are non-negotiable." },
  { id: 5, title: "Accountability", description: "Every decision must be traceable and explainable." },
  { id: 6, title: "No Manipulation", description: "The system shall not manipulate or coerce human behavior." },
  { id: 7, title: "Human Oversight", description: "No high-impact decisions without human intervention." },
];

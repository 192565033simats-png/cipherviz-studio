// ── Core Tree Node ──────────────────────────────────────────────
export interface TreeNode {
  id: string;
  char: string | null;
  freq: number;
  left: TreeNode | null;
  right: TreeNode | null;
}

// ── Highlight targets for UI rendering ─────────────────────────
export interface Highlight {
  /** Node IDs to highlight in the tree view */
  nodes: string[];
  /** Character keys to highlight in freq/code tables */
  characters: string[];
  /** Index into inputChars array */
  charIndex: number;
  /** Newly merged node ID (tree build phase) */
  mergedNodeId: string | null;
  /** Active code key (code generation phase) */
  activeCodeKey: string | null;
}

// ── Immutable snapshot of full simulation state ────────────────
export interface Snapshot {
  input: string;
  inputChars: string[];
  frequencyMap: Record<string, number>;
  priorityQueue: TreeNode[];
  tree: TreeNode | null;
  codes: Record<string, string>;
  encodedOutput: string;
  encodingProgress: number;
}

// ── Phase identifiers ──────────────────────────────────────────
export type StepPhase =
  | 'idle'
  | 'parsing'
  | 'counting'
  | 'building'
  | 'generating'
  | 'encoding'
  | 'complete';

// ── Single atomic step ─────────────────────────────────────────
export interface Step {
  index: number;
  phase: StepPhase;
  action: string;
  explanation: string;
  dataStructure: string;
  snapshot: Snapshot;
  highlight: Highlight;
}

// ── Engine interface exposed to UI ─────────────────────────────
export interface HuffmanEngine {
  /** Current step's data (or idle placeholder) */
  currentStepData: Step;
  steps: Step[];
  currentStep: number;
  totalSteps: number;
  isStarted: boolean;
  isComplete: boolean;
  start: (input: string) => void;
  next: () => void;
  prev: () => void;
  reset: () => void;
  goToStep: (n: number) => void;
}

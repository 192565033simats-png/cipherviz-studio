export interface TreeNode {
  id: string;
  char: string | null;
  freq: number;
  left: TreeNode | null;
  right: TreeNode | null;
  x?: number;
  y?: number;
}

export type StepPhase =
  | 'idle'
  | 'parsing'
  | 'counting'
  | 'building'
  | 'generating'
  | 'encoding'
  | 'complete';

export interface StepState {
  phase: StepPhase;
  stepIndex: number;
  description: string;
  detail: string;
  dataStructure: string;

  // Array view
  inputChars: string[];
  activeCharIndex: number;

  // Hash table
  freqMap: Record<string, number>;
  activeFreqKey: string | null;

  // Tree
  forest: TreeNode[];
  activeNodeIds: string[];
  mergedNodeId: string | null;

  // Codes
  codes: Record<string, string>;
  activeCodeKey: string | null;

  // Output
  encodedBinary: string;
  encodingProgress: number; // index into inputChars for encoding phase
}

export interface HuffmanEngine {
  state: StepState;
  steps: StepState[];
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

import { useState, useCallback } from 'react';
import { HuffmanEngine, StepState } from './types';
import { computeAllSteps } from './huffman';

const idleState: StepState = {
  phase: 'idle',
  stepIndex: 0,
  description: 'Enter text and press Start to begin.',
  detail: 'CipherStruct Studio will walk you through the Huffman Coding algorithm step by step, showing how data structures evolve at each stage.',
  dataStructure: '',
  inputChars: [],
  activeCharIndex: -1,
  freqMap: {},
  activeFreqKey: null,
  forest: [],
  activeNodeIds: [],
  mergedNodeId: null,
  codes: {},
  activeCodeKey: null,
  encodedBinary: '',
  encodingProgress: -1,
};

export function useHuffmanEngine(): HuffmanEngine {
  const [steps, setSteps] = useState<StepState[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const state = isStarted && steps.length > 0 ? steps[currentStep] : idleState;
  const isComplete = state.phase === 'complete';

  const start = useCallback((input: string) => {
    if (!input.trim()) return;
    const allSteps = computeAllSteps(input.trim());
    setSteps(allSteps);
    setCurrentStep(0);
    setIsStarted(true);
  }, []);

  const next = useCallback(() => {
    setCurrentStep(s => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep(s => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsStarted(false);
  }, []);

  const goToStep = useCallback((n: number) => {
    setCurrentStep(Math.max(0, Math.min(n, steps.length - 1)));
  }, [steps.length]);

  return {
    state,
    steps,
    currentStep,
    totalSteps: steps.length,
    isStarted,
    isComplete,
    start,
    next,
    prev,
    reset,
    goToStep,
  };
}

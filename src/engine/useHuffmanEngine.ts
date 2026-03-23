import { useState, useCallback } from 'react';
import { HuffmanEngine, Step } from './types';
import { computeAllSteps } from './huffman';

const idleStep: Step = {
  index: 0,
  phase: 'idle',
  action: 'Enter text and press Start to begin.',
  explanation:
    'CipherStruct Studio will walk you through the Huffman Coding algorithm step by step, showing how data structures evolve at each stage.',
  dataStructure: '',
  snapshot: {
    input: '',
    inputChars: [],
    frequencyMap: {},
    priorityQueue: [],
    tree: null,
    codes: {},
    encodedOutput: '',
    encodingProgress: -1,
  },
  highlight: {
    nodes: [],
    characters: [],
    charIndex: -1,
    mergedNodeId: null,
    activeCodeKey: null,
  },
};

export function useHuffmanEngine(): HuffmanEngine {
  const [steps, setSteps] = useState<Step[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  const currentStepData =
    isStarted && steps.length > 0 ? steps[currentStep] : idleStep;
  const isComplete = currentStepData.phase === 'complete';

  const start = useCallback((input: string) => {
    if (!input.trim()) return;
    const allSteps = computeAllSteps(input.trim());
    setSteps(allSteps);
    setCurrentStep(0);
    setIsStarted(true);
  }, []);

  const next = useCallback(() => {
    setCurrentStep((s) => Math.min(s + 1, steps.length - 1));
  }, [steps.length]);

  const prev = useCallback(() => {
    setCurrentStep((s) => Math.max(s - 1, 0));
  }, []);

  const reset = useCallback(() => {
    setSteps([]);
    setCurrentStep(0);
    setIsStarted(false);
  }, []);

  const goToStep = useCallback(
    (n: number) => {
      setCurrentStep(Math.max(0, Math.min(n, steps.length - 1)));
    },
    [steps.length]
  );

  return {
    currentStepData,
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

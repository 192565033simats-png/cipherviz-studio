import { TreeNode } from './types';

export interface DecryptionStep {
  stepIndex: number;
  description: string;
  detail: string;
  binaryInput: string;
  currentBitIndex: number;
  currentPath: string;
  decodedSoFar: string;
  activeNodeId: string | null;
  highlightedChar: string | null;
  tree: TreeNode;
  codes: Record<string, string>;
  isComplete: boolean;
  phase: 'traversal' | 'complete';
  finalPlaintext: string;
  warning: string | null;
}

function cloneTree(n: TreeNode | null): TreeNode | null {
  if (!n) return null;
  return { ...n, left: cloneTree(n.left), right: cloneTree(n.right) };
}

export function computeDecryptionSteps(
  binary: string,
  tree: TreeNode,
  codes: Record<string, string>
): DecryptionStep[] {
  const steps: DecryptionStep[] = [];
  const clonedTree = cloneTree(tree)!;
  const sanitizedBinary = binary.replace(/\s+/g, '');
  const invalidBitIndex = sanitizedBinary.search(/[^01]/);

  const base = {
    binaryInput: sanitizedBinary,
    tree: clonedTree,
    codes,
    isComplete: false,
    phase: 'traversal' as const,
    finalPlaintext: '',
    warning: null as string | null,
  };

  steps.push({
    ...base,
    stepIndex: 0,
    description: 'Begin Huffman Decoding',
    detail: `The encoded bitstream "${sanitizedBinary.slice(0, 30)}${sanitizedBinary.length > 30 ? '...' : ''}" (${sanitizedBinary.length} bits) is decoded using the same Huffman tree from encoding. Each leaf directly recovers one original character.`,
    currentBitIndex: -1,
    currentPath: '',
    decodedSoFar: '',
    activeNodeId: clonedTree.id,
    highlightedChar: null,
  });

  if (invalidBitIndex !== -1) {
    const warning = `Invalid encoded input: non-binary character '${sanitizedBinary[invalidBitIndex]}' at index ${invalidBitIndex}.`;
    steps.push({
      ...base,
      stepIndex: steps.length,
      description: 'Decoding Stopped',
      detail: warning,
      phase: 'complete',
      currentBitIndex: invalidBitIndex,
      currentPath: '',
      decodedSoFar: '',
      activeNodeId: null,
      highlightedChar: null,
      warning,
      isComplete: true,
    });
    return steps;
  }

  let decoded = '';
  let current = clonedTree;
  let path = '';

  for (let i = 0; i < sanitizedBinary.length; i++) {
    const bit = sanitizedBinary[i];
    path += bit;

    const nextNode = bit === '0' ? current.left : current.right;
    if (!nextNode) {
      const warning = `Invalid traversal at bit index ${i}: path "${path}" has no ${bit === '0' ? 'left' : 'right'} child.`;
      steps.push({
        ...base,
        stepIndex: steps.length,
        description: 'Decoding Stopped',
        detail: warning,
        phase: 'complete',
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: null,
        finalPlaintext: decoded,
        warning,
        isComplete: true,
      });
      return steps;
    }

    current = nextNode;

    if (current.char !== null) {
      decoded += current.char;
      steps.push({
        ...base,
        stepIndex: steps.length,
        description: `Bit '${bit}' → go ${bit === '0' ? 'LEFT' : 'RIGHT'} → found '${current.char}'`,
        detail: `Bit ${i} directs traversal ${bit === '0' ? 'left' : 'right'}. Reached leaf '${current.char}', so one plaintext character is recovered. Decoded text so far: "${decoded}".`,
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: current.char,
      });
      current = clonedTree;
      path = '';
    } else {
      steps.push({
        ...base,
        stepIndex: steps.length,
        description: `Bit '${bit}' → go ${bit === '0' ? 'LEFT' : 'RIGHT'}`,
        detail: `Bit ${i} moves to an internal node (freq ${current.freq}). Current path: "${path}". Continue traversal until reaching a leaf.`,
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: null,
      });
    }
  }

  const warning = path.length > 0
    ? `Warning: decoding ended with incomplete path "${path}". The encoded stream may be truncated.`
    : null;

  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Huffman Traversal Complete',
    detail: warning
      ? `All ${sanitizedBinary.length} bits were processed with a partial trailing path. Recovered plaintext so far: "${decoded}". ${warning}`
      : `All ${sanitizedBinary.length} bits were processed successfully. Recovered plaintext: "${decoded}".`,
    currentBitIndex: sanitizedBinary.length,
    currentPath: '',
    decodedSoFar: decoded,
    activeNodeId: null,
    highlightedChar: null,
    finalPlaintext: decoded,
    warning,
  });

  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Decoding Complete!',
    detail: warning
      ? `Huffman decoding finished with warning. Final recovered plaintext: "${decoded}".`
      : `Huffman decoding complete. Final output exactly matches the original input text: "${decoded}".`,
    phase: 'complete',
    currentBitIndex: sanitizedBinary.length,
    currentPath: '',
    decodedSoFar: decoded,
    activeNodeId: null,
    highlightedChar: null,
    finalPlaintext: decoded,
    warning,
    isComplete: true,
  });

  return steps;
}
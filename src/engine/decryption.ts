import { TreeNode } from './types';

export interface AsciiBreakdown {
  char: string;
  binary: string;
  ascii: number;
}

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
  phase: 'traversal' | 'ascii-conversion' | 'complete';
  asciiBreakdown: AsciiBreakdown[];
  finalPlaintext: string;
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

  const base = {
    binaryInput: binary,
    tree: clonedTree,
    codes,
    isComplete: false,
    phase: 'traversal' as const,
    asciiBreakdown: [] as AsciiBreakdown[],
    finalPlaintext: '',
  };

  let decoded = '';
  let current = clonedTree;
  let path = '';

  steps.push({
    ...base,
    stepIndex: 0,
    description: 'Begin Huffman Decoding',
    detail: `The binary string "${binary.slice(0, 30)}${binary.length > 30 ? '...' : ''}" (${binary.length} bits) will be decoded by traversing the Huffman tree bit by bit. Starting at the root node.`,
    currentBitIndex: -1,
    currentPath: '',
    decodedSoFar: '',
    activeNodeId: clonedTree.id,
    highlightedChar: null,
  });

  for (let i = 0; i < binary.length; i++) {
    const bit = binary[i];
    path += bit;

    if (bit === '0' && current.left) {
      current = current.left;
    } else if (bit === '1' && current.right) {
      current = current.right;
    }

    if (current.char !== null) {
      decoded += current.char;
      steps.push({
        ...base,
        stepIndex: steps.length,
        description: `Bit '${bit}' → go ${bit === '0' ? 'LEFT' : 'RIGHT'} → found '${current.char}'`,
        detail: `Reading bit ${i}: '${bit}' means traverse ${bit === '0' ? 'left' : 'right'}. Reached leaf node '${current.char}'. Path "${path}" decodes to character '${current.char}'. Decoded so far: "${decoded}"`,
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
        detail: `Reading bit ${i}: '${bit}' means traverse ${bit === '0' ? 'left' : 'right'}. Now at internal node (freq ${current.freq}). Path so far: "${path}". Continue reading bits.`,
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: null,
      });
    }
  }

  // Huffman traversal complete step
  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Huffman Traversal Complete',
    detail: `All ${binary.length} bits processed. Decoded Huffman output: "${decoded}". Now converting each character to its ASCII binary representation.`,
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: decoded,
    activeNodeId: null,
    highlightedChar: null,
  });

  // ASCII conversion steps — one per character
  const breakdown: AsciiBreakdown[] = [];
  for (let i = 0; i < decoded.length; i++) {
    const ch = decoded[i];
    const ascii = ch.charCodeAt(0);
    const bin = ascii.toString(2).padStart(8, '0');
    breakdown.push({ char: ch, binary: bin, ascii });

    steps.push({
      ...base,
      stepIndex: steps.length,
      description: `ASCII: '${ch}' → ${ascii} → ${bin}`,
      detail: `Character '${ch}' has ASCII value ${ascii}. In binary: ${bin}. This is byte ${i + 1} of ${decoded.length}.`,
      phase: 'ascii-conversion',
      currentBitIndex: binary.length,
      currentPath: '',
      decodedSoFar: decoded,
      activeNodeId: null,
      highlightedChar: ch,
      asciiBreakdown: [...breakdown],
      finalPlaintext: decoded.slice(0, i + 1),
    });
  }

  // Final complete step
  const fullBreakdown = [...breakdown];
  const binaryOutput = fullBreakdown.map(b => b.binary).join(' ');
  const paddingWarning = decoded.length > 0 && (decoded.length * 8) % 8 !== 0
    ? ' Note: binary length is not a perfect multiple of 8.'
    : '';

  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Decoding Complete!',
    detail: `Full pipeline complete. ${binary.length} Huffman bits → ${decoded.length} characters → ${decoded.length * 8} ASCII bits. Final plaintext: "${decoded}".${paddingWarning}`,
    phase: 'complete',
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: decoded,
    activeNodeId: null,
    highlightedChar: null,
    asciiBreakdown: fullBreakdown,
    finalPlaintext: decoded,
    isComplete: true,
  });

  return steps;
}

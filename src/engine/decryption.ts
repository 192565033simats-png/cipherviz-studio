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

  let decoded = '';
  let current = clonedTree;
  let path = '';

  steps.push({
    stepIndex: 0,
    description: 'Begin Huffman Decoding',
    detail: `The binary string "${binary.slice(0, 30)}${binary.length > 30 ? '...' : ''}" (${binary.length} bits) will be decoded by traversing the Huffman tree bit by bit. Starting at the root node.`,
    binaryInput: binary,
    currentBitIndex: -1,
    currentPath: '',
    decodedSoFar: '',
    activeNodeId: clonedTree.id,
    highlightedChar: null,
    tree: clonedTree,
    codes,
    isComplete: false,
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
      // Reached a leaf — decode character
      decoded += current.char;
      steps.push({
        stepIndex: steps.length,
        description: `Bit '${bit}' → go ${bit === '0' ? 'LEFT' : 'RIGHT'} → found '${current.char}'`,
        detail: `Reading bit ${i}: '${bit}' means traverse ${bit === '0' ? 'left' : 'right'}. Reached leaf node '${current.char}'. Path "${path}" decodes to character '${current.char}'. Decoded so far: "${decoded}"`,
        binaryInput: binary,
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: current.char,
        tree: clonedTree,
        codes,
        isComplete: false,
      });

      // Reset to root
      current = clonedTree;
      path = '';
    } else {
      steps.push({
        stepIndex: steps.length,
        description: `Bit '${bit}' → go ${bit === '0' ? 'LEFT' : 'RIGHT'}`,
        detail: `Reading bit ${i}: '${bit}' means traverse ${bit === '0' ? 'left' : 'right'}. Now at internal node (freq ${current.freq}). Path so far: "${path}". Continue reading bits.`,
        binaryInput: binary,
        currentBitIndex: i,
        currentPath: path,
        decodedSoFar: decoded,
        activeNodeId: current.id,
        highlightedChar: null,
        tree: clonedTree,
        codes,
        isComplete: false,
      });
    }
  }

  steps.push({
    stepIndex: steps.length,
    description: 'Decoding complete!',
    detail: `All ${binary.length} bits have been processed. The decoded message is: "${decoded}". The Huffman tree was traversed ${decoded.length} times to recover each character.`,
    binaryInput: binary,
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: decoded,
    activeNodeId: null,
    highlightedChar: null,
    tree: clonedTree,
    codes,
    isComplete: true,
  });

  return steps;
}

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
  decodedBinary: string;
  finalPlaintext: string;
  conversionWarning: string | null;
}

function cloneTree(n: TreeNode | null): TreeNode | null {
  if (!n) return null;
  return { ...n, left: cloneTree(n.left), right: cloneTree(n.right) };
}

function formatBinaryGroups(binary: string): string {
  const cleaned = binary.replace(/\s+/g, '');
  if (!cleaned) return '';
  const groups = cleaned.match(/.{1,8}/g);
  return groups ? groups.join(' ') : cleaned;
}

function splitFullBytes(binary: string): string[] {
  const bytes: string[] = [];
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) bytes.push(byte);
  }
  return bytes;
}

export function binaryToText(binary: string): string {
  let result = '';
  for (let i = 0; i < binary.length; i += 8) {
    const byte = binary.slice(i, i + 8);
    if (byte.length === 8) {
      result += String.fromCharCode(parseInt(byte, 2));
    }
  }
  return result;
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
    decodedBinary: '',
    finalPlaintext: '',
    conversionWarning: null as string | null,
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
      decodedBinary: '',
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
        decodedBinary: decoded,
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
        decodedBinary: decoded,
      });
    }
  }

  const normalizedDecodedBinary = decoded.replace(/\s+/g, '');
  const isStrictBinary = /^[01]*$/.test(normalizedDecodedBinary);
  const completeByteLength =
    normalizedDecodedBinary.length - (normalizedDecodedBinary.length % 8);
  const convertibleBinary = normalizedDecodedBinary.slice(0, completeByteLength);
  const trailingBits = normalizedDecodedBinary.slice(completeByteLength);
  const conversionWarning = !isStrictBinary
    ? 'Warning: Huffman output contains non-binary symbols, so Binary → ASCII conversion was skipped.'
    : trailingBits.length > 0
      ? `Warning: ${trailingBits.length} trailing bit(s) were ignored because they do not form a full 8-bit byte.`
      : null;

  // Huffman traversal complete step
  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Huffman Traversal Complete',
    detail: `All ${binary.length} bits processed. Huffman decoded binary output: "${formatBinaryGroups(normalizedDecodedBinary)}". Next: Final Step: Binary to ASCII Conversion.`,
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: normalizedDecodedBinary,
    activeNodeId: null,
    highlightedChar: null,
    decodedBinary: normalizedDecodedBinary,
  });

  steps.push({
    ...base,
    stepIndex: steps.length,
    phase: 'ascii-conversion',
    description: 'Final Step: Binary to ASCII Conversion',
    detail: isStrictBinary
      ? `Split the Huffman decoded binary into 8-bit bytes, convert each byte with parseInt(byte, 2), then map it with String.fromCharCode().${conversionWarning ? ` ${conversionWarning}` : ''}`
      : `${conversionWarning} The current decoded output is preserved as plaintext.`,
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: normalizedDecodedBinary,
    activeNodeId: null,
    highlightedChar: null,
    decodedBinary: normalizedDecodedBinary,
    conversionWarning,
  });

  // ASCII conversion steps — one per full byte
  const breakdown: AsciiBreakdown[] = [];
  const fullBytes = isStrictBinary ? splitFullBytes(convertibleBinary) : [];
  let runningPlaintext = '';

  for (let i = 0; i < fullBytes.length; i++) {
    const byte = fullBytes[i];
    const ascii = parseInt(byte, 2);
    const ch = String.fromCharCode(ascii);
    runningPlaintext += ch;
    breakdown.push({ char: ch, binary: byte, ascii });

    steps.push({
      ...base,
      stepIndex: steps.length,
      description: `Byte ${i + 1}: ${byte} → ${ascii} → '${ch}'`,
      detail: `Read byte ${i + 1}/${fullBytes.length}: ${byte}. Decimal ASCII = ${ascii}, mapped character = '${ch}'.`,
      phase: 'ascii-conversion',
      currentBitIndex: binary.length,
      currentPath: '',
      decodedSoFar: normalizedDecodedBinary,
      activeNodeId: null,
      highlightedChar: ch,
      decodedBinary: normalizedDecodedBinary,
      asciiBreakdown: [...breakdown],
      finalPlaintext: runningPlaintext,
      conversionWarning,
    });
  }

  // Final complete step
  const fullBreakdown = [...breakdown];
  const finalPlaintext = isStrictBinary
    ? binaryToText(convertibleBinary)
    : decoded;

  steps.push({
    ...base,
    stepIndex: steps.length,
    description: 'Decoding Complete!',
    detail: isStrictBinary
      ? `Full pipeline complete. ${binary.length} Huffman bits → ${normalizedDecodedBinary.length} decoded bits → ${fullBreakdown.length} ASCII byte(s) → plaintext "${finalPlaintext}".${conversionWarning ? ` ${conversionWarning}` : ''}`
      : `Huffman decoding complete. Output is "${decoded}". Binary → ASCII conversion was skipped because output is not strict binary.`,
    phase: 'complete',
    currentBitIndex: binary.length,
    currentPath: '',
    decodedSoFar: normalizedDecodedBinary,
    activeNodeId: null,
    highlightedChar: null,
    decodedBinary: normalizedDecodedBinary,
    asciiBreakdown: fullBreakdown,
    finalPlaintext,
    conversionWarning,
    isComplete: true,
  });

  return steps;
}

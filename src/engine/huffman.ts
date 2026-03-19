import { StepState, TreeNode } from './types';

let nodeCounter = 0;
function makeNode(char: string | null, freq: number, left: TreeNode | null = null, right: TreeNode | null = null): TreeNode {
  return { id: `node-${nodeCounter++}`, char, freq, left, right };
}

function cloneTree(n: TreeNode | null): TreeNode | null {
  if (!n) return null;
  return { ...n, left: cloneTree(n.left), right: cloneTree(n.right) };
}

function cloneForest(f: TreeNode[]): TreeNode[] {
  return f.map(n => cloneTree(n)!);
}

function generateCodes(node: TreeNode | null, prefix: string, codes: Record<string, string>) {
  if (!node) return;
  if (node.char !== null) {
    codes[node.char] = prefix || '0';
    return;
  }
  generateCodes(node.left, prefix + '0', codes);
  generateCodes(node.right, prefix + '1', codes);
}

function baseState(): StepState {
  return {
    phase: 'idle',
    stepIndex: 0,
    description: '',
    detail: '',
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
}

export function computeAllSteps(input: string): StepState[] {
  nodeCounter = 0;
  const steps: StepState[] = [];
  const chars = input.split('');

  // --- PHASE: parsing ---
  let current = { ...baseState(), inputChars: chars, phase: 'parsing' as const };

  steps.push({
    ...current,
    description: 'Initialize input array',
    detail: `The input "${input}" is split into ${chars.length} individual characters and stored in an array. This array will be processed character by character.`,
    dataStructure: 'Array',
  });

  for (let i = 0; i < chars.length; i++) {
    steps.push({
      ...current,
      stepIndex: steps.length,
      activeCharIndex: i,
      description: `Read character '${chars[i]}' at index ${i}`,
      detail: `Scanning position ${i} of the input array. The character '${chars[i]}' (ASCII ${chars[i].charCodeAt(0)}) is identified and will be counted in the frequency table.`,
      dataStructure: 'Array',
    });
  }

  // --- PHASE: counting ---
  const freqMap: Record<string, number> = {};
  current = { ...current, phase: 'counting' as const, activeCharIndex: -1 };

  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    freqMap[c] = (freqMap[c] || 0) + 1;
    steps.push({
      ...current,
      stepIndex: steps.length,
      freqMap: { ...freqMap },
      activeCharIndex: i,
      activeFreqKey: c,
      description: `Count '${c}' → frequency = ${freqMap[c]}`,
      detail: `Character '${c}' is looked up in the hash table. ${freqMap[c] === 1 ? 'This is its first occurrence, so a new entry is created with frequency 1.' : `Its frequency is incremented from ${freqMap[c] - 1} to ${freqMap[c]}.`}`,
      dataStructure: 'Hash Table',
    });
  }

  // --- PHASE: building ---
  let forest: TreeNode[] = Object.entries(freqMap)
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([ch, f]) => makeNode(ch, f));

  current = {
    ...current,
    phase: 'building' as const,
    freqMap: { ...freqMap },
    activeCharIndex: -1,
    activeFreqKey: null,
    forest: cloneForest(forest),
  };

  steps.push({
    ...current,
    stepIndex: steps.length,
    description: 'Initialize priority queue from frequencies',
    detail: `${forest.length} leaf nodes are created from the frequency table, each representing a unique character. They are sorted by frequency (ascending) to form a min-priority queue.`,
    dataStructure: 'Tree / Priority Queue',
  });

  while (forest.length > 1) {
    forest.sort((a, b) => a.freq - b.freq);
    const left = forest.shift()!;
    const right = forest.shift()!;

    steps.push({
      ...current,
      stepIndex: steps.length,
      forest: cloneForest([left, right, ...forest]),
      activeNodeIds: [left.id, right.id],
      mergedNodeId: null,
      description: `Select two minimum nodes: ${left.char ?? '(' + left.freq + ')'} [${left.freq}] and ${right.char ?? '(' + right.freq + ')'} [${right.freq}]`,
      detail: `The two nodes with the smallest frequencies are extracted from the priority queue. Left: ${left.char ? `'${left.char}'` : 'internal'} (freq ${left.freq}), Right: ${right.char ? `'${right.char}'` : 'internal'} (freq ${right.freq}).`,
      dataStructure: 'Tree / Priority Queue',
    });

    const merged = makeNode(null, left.freq + right.freq, left, right);
    forest.push(merged);

    steps.push({
      ...current,
      stepIndex: steps.length,
      forest: cloneForest(forest),
      activeNodeIds: [],
      mergedNodeId: merged.id,
      description: `Merge into internal node [${merged.freq}]`,
      detail: `A new internal node is created with frequency ${left.freq} + ${right.freq} = ${merged.freq}. The left child gets edge label '0' and the right child gets '1'. This merged node is inserted back into the priority queue.`,
      dataStructure: 'Tree',
    });
  }

  // --- PHASE: generating codes ---
  const codes: Record<string, string> = {};
  generateCodes(forest[0], '', codes);

  const sortedChars = Object.keys(codes).sort();
  current = {
    ...current,
    phase: 'generating' as const,
    forest: cloneForest(forest),
    activeNodeIds: [],
    mergedNodeId: null,
  };

  steps.push({
    ...current,
    stepIndex: steps.length,
    description: 'Tree complete — generating Huffman codes',
    detail: `The Huffman tree is fully constructed with root frequency ${forest[0].freq}. Now we traverse the tree to assign binary codes: left edges = '0', right edges = '1'.`,
    dataStructure: 'Tree',
  });

  const codesSoFar: Record<string, string> = {};
  for (const ch of sortedChars) {
    codesSoFar[ch] = codes[ch];
    steps.push({
      ...current,
      stepIndex: steps.length,
      codes: { ...codesSoFar },
      activeCodeKey: ch,
      description: `Code for '${ch}' → ${codes[ch]}`,
      detail: `Traversing from root to leaf '${ch}': the path ${codes[ch].split('').map((b, i) => `${b === '0' ? 'left' : 'right'}`).join(' → ')} produces the binary code "${codes[ch]}" (${codes[ch].length} bits).`,
      dataStructure: 'Tree',
    });
  }

  // --- PHASE: encoding ---
  current = {
    ...current,
    phase: 'encoding' as const,
    codes: { ...codes },
    activeCodeKey: null,
  };

  let encoded = '';
  for (let i = 0; i < chars.length; i++) {
    encoded += codes[chars[i]];
    steps.push({
      ...current,
      stepIndex: steps.length,
      activeCharIndex: i,
      encodedBinary: encoded,
      encodingProgress: i,
      description: `Encode '${chars[i]}' → ${codes[chars[i]]}`,
      detail: `Character '${chars[i]}' is replaced by its Huffman code "${codes[chars[i]]}". The encoded output is now ${encoded.length} bits long.`,
      dataStructure: 'Array → Binary Output',
    });
  }

  // --- complete ---
  steps.push({
    ...current,
    stepIndex: steps.length,
    phase: 'complete' as const,
    activeCharIndex: -1,
    encodedBinary: encoded,
    encodingProgress: chars.length,
    description: 'Encoding complete!',
    detail: `The full input "${input}" (${input.length * 8} bits uncompressed) has been encoded into ${encoded.length} bits using Huffman coding. Compression ratio: ${((1 - encoded.length / (input.length * 8)) * 100).toFixed(1)}%.`,
    dataStructure: 'Complete',
  });

  return steps;
}

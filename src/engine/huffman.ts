import { Step, TreeNode, Snapshot, Highlight } from './types';

// ── Deterministic node ID generator ────────────────────────────
let nodeCounter = 0;
function makeNode(
  char: string | null,
  freq: number,
  left: TreeNode | null = null,
  right: TreeNode | null = null
): TreeNode {
  return { id: `node-${nodeCounter++}`, char, freq, left, right };
}

// ── Deep-clone helpers (immutability) ──────────────────────────
function cloneTree(n: TreeNode | null): TreeNode | null {
  if (!n) return null;
  return { ...n, left: cloneTree(n.left), right: cloneTree(n.right) };
}
function cloneForest(f: TreeNode[]): TreeNode[] {
  return f.map((n) => cloneTree(n)!);
}

// ── Code generation via tree traversal ─────────────────────────
function generateCodes(
  node: TreeNode | null,
  prefix: string,
  codes: Record<string, string>
) {
  if (!node) return;
  if (node.char !== null) {
    codes[node.char] = prefix || '0';
    return;
  }
  generateCodes(node.left, prefix + '0', codes);
  generateCodes(node.right, prefix + '1', codes);
}

// ── Helpers ────────────────────────────────────────────────────
function emptyHighlight(): Highlight {
  return { nodes: [], characters: [], charIndex: -1, mergedNodeId: null, activeCodeKey: null };
}

function makeSnapshot(partial: Partial<Snapshot>, base?: Snapshot): Snapshot {
  const def: Snapshot = base
    ? { ...base }
    : {
        input: '',
        inputChars: [],
        frequencyMap: {},
        priorityQueue: [],
        tree: null,
        codes: {},
        encodedOutput: '',
        encodingProgress: -1,
      };
  return { ...def, ...partial };
}

// ── Main computation: returns every atomic step ────────────────
export function computeAllSteps(input: string): Step[] {
  nodeCounter = 0;
  const steps: Step[] = [];
  const chars = input.split('');
  const baseSnap = makeSnapshot({ input, inputChars: chars });

  // ── PHASE: parsing ───────────────────────────────────────────
  steps.push({
    index: 0,
    phase: 'parsing',
    action: 'Initialize input array',
    explanation: `The input "${input}" is split into ${chars.length} individual characters stored in an array. Each will be processed one by one.`,
    dataStructure: 'Array',
    snapshot: { ...baseSnap },
    highlight: emptyHighlight(),
  });

  for (let i = 0; i < chars.length; i++) {
    steps.push({
      index: steps.length,
      phase: 'parsing',
      action: `Read character '${chars[i]}' at index ${i}`,
      explanation: `Scanning position ${i}. Character '${chars[i]}' (ASCII ${chars[i].charCodeAt(0)}) is identified for frequency counting.`,
      dataStructure: 'Array',
      snapshot: { ...baseSnap },
      highlight: { ...emptyHighlight(), charIndex: i },
    });
  }

  // ── PHASE: counting ──────────────────────────────────────────
  const freqMap: Record<string, number> = {};
  for (let i = 0; i < chars.length; i++) {
    const c = chars[i];
    freqMap[c] = (freqMap[c] || 0) + 1;
    steps.push({
      index: steps.length,
      phase: 'counting',
      action: `Count '${c}' → frequency = ${freqMap[c]}`,
      explanation: `Character '${c}' lookup in hash table. ${
        freqMap[c] === 1
          ? 'First occurrence — new entry with frequency 1.'
          : `Frequency incremented from ${freqMap[c] - 1} to ${freqMap[c]}.`
      }`,
      dataStructure: 'Hash Table',
      snapshot: makeSnapshot({ ...baseSnap, frequencyMap: { ...freqMap } }),
      highlight: { ...emptyHighlight(), charIndex: i, characters: [c] },
    });
  }

  // ── PHASE: building ──────────────────────────────────────────
  let forest: TreeNode[] = Object.entries(freqMap)
    .sort((a, b) => a[1] - b[1] || a[0].localeCompare(b[0]))
    .map(([ch, f]) => makeNode(ch, f));

  const buildBase = makeSnapshot({
    ...baseSnap,
    frequencyMap: { ...freqMap },
    priorityQueue: cloneForest(forest),
  });

  steps.push({
    index: steps.length,
    phase: 'building',
    action: 'Initialize priority queue from frequencies',
    explanation: `${forest.length} leaf nodes created, sorted by frequency (ascending) to form a min-priority queue.`,
    dataStructure: 'Tree / Priority Queue',
    snapshot: { ...buildBase },
    highlight: emptyHighlight(),
  });

  while (forest.length > 1) {
    forest.sort((a, b) => a.freq - b.freq);
    const left = forest.shift()!;
    const right = forest.shift()!;

    // Step: select two minimums
    steps.push({
      index: steps.length,
      phase: 'building',
      action: `Select min nodes: ${left.char ?? '(' + left.freq + ')'} [${left.freq}] and ${right.char ?? '(' + right.freq + ')'} [${right.freq}]`,
      explanation: `Two smallest nodes extracted. Left: ${left.char ? `'${left.char}'` : 'internal'} (${left.freq}), Right: ${right.char ? `'${right.char}'` : 'internal'} (${right.freq}).`,
      dataStructure: 'Tree / Priority Queue',
      snapshot: makeSnapshot({
        ...buildBase,
        priorityQueue: cloneForest([left, right, ...forest]),
      }),
      highlight: { ...emptyHighlight(), nodes: [left.id, right.id] },
    });

    // Merge
    const merged = makeNode(null, left.freq + right.freq, left, right);
    forest.push(merged);

    steps.push({
      index: steps.length,
      phase: 'building',
      action: `Merge → internal node [${merged.freq}]`,
      explanation: `New internal node: ${left.freq} + ${right.freq} = ${merged.freq}. Left child ← '0', right child ← '1'. Inserted back into queue.`,
      dataStructure: 'Tree',
      snapshot: makeSnapshot({
        ...buildBase,
        priorityQueue: cloneForest(forest),
        tree: cloneTree(forest.length === 1 ? forest[0] : null),
      }),
      highlight: { ...emptyHighlight(), mergedNodeId: merged.id },
    });
  }

  // ── PHASE: generating codes ──────────────────────────────────
  const codes: Record<string, string> = {};
  generateCodes(forest[0], '', codes);
  const sortedChars = Object.keys(codes).sort();

  const genBase = makeSnapshot({
    ...buildBase,
    priorityQueue: cloneForest(forest),
    tree: cloneTree(forest[0]),
  });

  steps.push({
    index: steps.length,
    phase: 'generating',
    action: 'Tree complete — generating Huffman codes',
    explanation: `Huffman tree constructed with root frequency ${forest[0].freq}. Traversing to assign binary codes: left = '0', right = '1'.`,
    dataStructure: 'Tree',
    snapshot: { ...genBase },
    highlight: emptyHighlight(),
  });

  const codesSoFar: Record<string, string> = {};
  for (const ch of sortedChars) {
    codesSoFar[ch] = codes[ch];
    steps.push({
      index: steps.length,
      phase: 'generating',
      action: `Code for '${ch}' → ${codes[ch]}`,
      explanation: `Path from root to '${ch}': ${codes[ch]
        .split('')
        .map((b) => (b === '0' ? 'left' : 'right'))
        .join(' → ')} → code "${codes[ch]}" (${codes[ch].length} bits).`,
      dataStructure: 'Tree',
      snapshot: makeSnapshot({ ...genBase, codes: { ...codesSoFar } }),
      highlight: { ...emptyHighlight(), activeCodeKey: ch, characters: [ch] },
    });
  }

  // ── PHASE: encoding ──────────────────────────────────────────
  const encBase = makeSnapshot({ ...genBase, codes: { ...codes } });
  let encoded = '';

  for (let i = 0; i < chars.length; i++) {
    encoded += codes[chars[i]];
    steps.push({
      index: steps.length,
      phase: 'encoding',
      action: `Encode '${chars[i]}' → ${codes[chars[i]]}`,
      explanation: `Character '${chars[i]}' replaced by Huffman code "${codes[chars[i]]}". Output is now ${encoded.length} bits.`,
      dataStructure: 'Array → Binary Output',
      snapshot: makeSnapshot({
        ...encBase,
        encodedOutput: encoded,
        encodingProgress: i,
      }),
      highlight: { ...emptyHighlight(), charIndex: i, characters: [chars[i]] },
    });
  }

  // ── PHASE: complete ──────────────────────────────────────────
  steps.push({
    index: steps.length,
    phase: 'complete',
    action: 'Encoding complete!',
    explanation: `Input "${input}" (${input.length * 8} bits uncompressed) encoded to ${encoded.length} bits. Compression: ${((1 - encoded.length / (input.length * 8)) * 100).toFixed(1)}%.`,
    dataStructure: 'Complete',
    snapshot: makeSnapshot({
      ...encBase,
      encodedOutput: encoded,
      encodingProgress: chars.length,
    }),
    highlight: emptyHighlight(),
  });

  return steps;
}

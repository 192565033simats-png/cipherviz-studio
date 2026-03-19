import { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { Navbar } from '../components/Navbar';
import { CustomCursor } from '../components/CustomCursor';
import { computeAllSteps } from '../engine/huffman';
import { computeDecryptionSteps, DecryptionStep } from '../engine/decryption';
import { TreeNode } from '../engine/types';
import { Play, SkipForward, SkipBack, RotateCcw, Pause, Unlock, Sparkles, ArrowRight, Binary, GitBranch, KeyRound } from 'lucide-react';

interface LayoutNode {
  id: string; char: string | null; freq: number; x: number; y: number;
  left: LayoutNode | null; right: LayoutNode | null;
}

function layoutTree(node: TreeNode | null, depth: number, xRef: { val: number }, gap: number): LayoutNode | null {
  if (!node) return null;
  const left = layoutTree(node.left, depth + 1, xRef, gap);
  const x = xRef.val;
  xRef.val += gap;
  const right = layoutTree(node.right, depth + 1, xRef, gap);
  return { id: node.id, char: node.char, freq: node.freq, x, y: depth * 80, left, right };
}

function collectEdges(node: LayoutNode | null, edges: { x1: number; y1: number; x2: number; y2: number; label: string }[]) {
  if (!node) return;
  if (node.left) { edges.push({ x1: node.x, y1: node.y, x2: node.left.x, y2: node.left.y, label: '0' }); collectEdges(node.left, edges); }
  if (node.right) { edges.push({ x1: node.x, y1: node.y, x2: node.right.x, y2: node.right.y, label: '1' }); collectEdges(node.right, edges); }
}

function collectNodes(node: LayoutNode | null, nodes: LayoutNode[]) {
  if (!node) return;
  collectNodes(node.left, nodes);
  nodes.push(node);
  collectNodes(node.right, nodes);
}

const DecryptPage = () => {
  const [input, setInput] = useState('');
  const [steps, setSteps] = useState<DecryptionStep[]>([]);
  const [currentStep, setCurrentStep] = useState(0);
  const [isStarted, setIsStarted] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();

  const step = isStarted && steps.length > 0 ? steps[currentStep] : null;
  const isComplete = step?.isComplete ?? false;

  const handleStart = useCallback(() => {
    if (!input.trim()) return;
    const encSteps = computeAllSteps(input.trim());
    const finalStep = encSteps[encSteps.length - 1];
    const binary = finalStep.snapshot.encodedOutput;
    const tree = finalStep.snapshot.priorityQueue[0];
    const codes = finalStep.snapshot.codes;
    if (tree && binary) {
      const decSteps = computeDecryptionSteps(binary, tree, codes);
      setSteps(decSteps);
      setCurrentStep(0);
      setIsStarted(true);
      setAutoPlaying(true);
    }
  }, [input]);

  const next = useCallback(() => setCurrentStep(s => Math.min(s + 1, steps.length - 1)), [steps.length]);
  const prev = useCallback(() => setCurrentStep(s => Math.max(s - 1, 0)), []);
  const reset = useCallback(() => { setSteps([]); setCurrentStep(0); setIsStarted(false); setAutoPlaying(false); }, []);

  useEffect(() => {
    if (autoPlaying && isStarted && !isComplete) {
      autoPlayRef.current = setInterval(next, 500);
    }
    return () => { if (autoPlayRef.current) clearInterval(autoPlayRef.current); };
  }, [autoPlaying, isStarted, isComplete, next]);

  useEffect(() => { if (isComplete) setAutoPlaying(false); }, [isComplete]);

  const { nodes, edges, width, height } = useMemo(() => {
    if (!step?.tree) return { nodes: [] as LayoutNode[], edges: [] as any[], width: 0, height: 0 };
    const gap = 55;
    const xRef = { val: 30 };
    const laid = layoutTree(step.tree, 0, xRef, gap);
    const allNodes: LayoutNode[] = [];
    const allEdges: { x1: number; y1: number; x2: number; y2: number; label: string }[] = [];
    if (laid) { collectNodes(laid, allNodes); collectEdges(laid, allEdges); }
    const maxX = Math.max(...allNodes.map(n => n.x), 100) + 50;
    const maxY = Math.max(...allNodes.map(n => n.y), 50) + 60;
    return { nodes: allNodes, edges: allEdges, width: maxX, height: maxY };
  }, [step?.tree]);

  return (
    <>
      <CustomCursor />
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-16">
          <aside className="w-80 flex-shrink-0 border-r border-border/30 bg-card/50 overflow-y-auto p-5 space-y-5">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Unlock className="w-5 h-5 text-primary" />
                <h1 className="text-lg font-semibold tracking-tight gold-text">Decryption</h1>
              </div>
              <p className="text-xs text-muted-foreground">Step-by-step Huffman Decoding</p>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Enter text to encode → then decode
              </label>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                disabled={isStarted}
                placeholder="Enter text (e.g. hello world)..."
                className="w-full h-24 px-3 py-2.5 bg-input rounded-xl text-sm font-mono resize-none
                  border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20
                  placeholder:text-muted-foreground/40 transition-all disabled:opacity-50"
              />
              <p className="text-[10px] text-muted-foreground">
                The text will be Huffman-encoded first, then decoded step-by-step showing tree traversal.
              </p>
            </div>

            {!isStarted ? (
              <button
                onClick={handleStart}
                disabled={!input.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                  gold-gradient text-primary-foreground font-medium text-sm
                  hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed glow-gold"
              >
                <Play className="w-4 h-4" />
                Start Decoding
              </button>
            ) : (
              <div className="space-y-2">
                <div className="grid grid-cols-3 gap-2">
                  <button onClick={prev} disabled={currentStep === 0 || autoPlaying}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl bg-secondary text-secondary-foreground text-sm font-medium hover:bg-secondary/80 transition-all disabled:opacity-30">
                    <SkipBack className="w-3.5 h-3.5" /> Prev
                  </button>
                  <button onClick={next} disabled={isComplete || autoPlaying}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl gold-gradient text-primary-foreground text-sm font-medium hover:opacity-90 transition-all disabled:opacity-30">
                    Next <SkipForward className="w-3.5 h-3.5" />
                  </button>
                  <button onClick={reset}
                    className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl crimson-gradient text-accent-foreground text-sm font-medium hover:opacity-90 transition-all">
                    <RotateCcw className="w-3.5 h-3.5" /> Reset
                  </button>
                </div>
                <button
                  onClick={() => setAutoPlaying(p => !p)}
                  disabled={isComplete}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${autoPlaying ? 'bg-accent/20 text-accent-foreground border border-accent/30' : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'} disabled:opacity-30`}
                >
                  {autoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {autoPlaying ? 'Pause' : 'Auto-Play'}
                </button>
              </div>
            )}

            {step && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Step {currentStep + 1} / {steps.length}</span>
                </div>
                <div className="h-1.5 bg-muted rounded-full overflow-hidden">
                  <div className="h-full gold-gradient rounded-full transition-all duration-300"
                    style={{ width: `${((currentStep + 1) / steps.length) * 100}%` }} />
                </div>
              </div>
            )}

            {step && step.decodedSoFar && (
              <div className="space-y-2 pt-3 border-t border-border/30">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Decoded Text</label>
                <div className="p-3 rounded-xl bg-secondary/50">
                  <p className="font-mono text-sm text-primary break-all">{step.decodedSoFar}</p>
                </div>
              </div>
            )}

            {step?.codes && Object.keys(step.codes).length > 0 && (
              <div className="space-y-2 pt-3 border-t border-border/30">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Code Table</label>
                <div className="grid gap-1 max-h-40 overflow-auto">
                  {Object.entries(step.codes).sort().map(([ch, code]) => (
                    <div key={ch} className={`flex items-center justify-between px-3 py-1 rounded-lg font-mono text-xs transition-all
                      ${step.highlightedChar === ch ? 'bg-primary/20 ring-1 ring-primary/40 text-primary' : 'bg-secondary/30 text-muted-foreground'}`}>
                      <span>'{ch}'</span>
                      <span>{code}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </aside>

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {step ? (
              <>
                <div className="glass-panel p-5 space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Binary Input</h3>
                  <div className="flex flex-wrap gap-0.5 font-mono text-sm">
                    {step.binaryInput.split('').map((bit, i) => (
                      <span
                        key={i}
                        className={`w-6 h-7 flex items-center justify-center rounded transition-all duration-200
                          ${i === step.currentBitIndex
                            ? 'bg-primary text-primary-foreground scale-110 font-bold glow-gold'
                            : i < step.currentBitIndex
                              ? 'bg-secondary/60 text-muted-foreground'
                              : 'bg-secondary/30 text-secondary-foreground'
                          }`}
                      >
                        {bit}
                      </span>
                    ))}
                  </div>
                </div>

                {nodes.length > 0 && (
                  <div className="glass-panel p-5 space-y-3">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Huffman Tree Traversal
                    </h3>
                    <div className="overflow-auto rounded-xl bg-secondary/30 p-4" style={{ maxHeight: 400 }}>
                      <svg width={width} height={height} className="min-w-full">
                        {edges.map((e, i) => (
                          <g key={i}>
                            <line x1={e.x1} y1={e.y1 + 18} x2={e.x2} y2={e.y2 - 4}
                              stroke="hsl(var(--border))" strokeWidth={1.5} className="transition-all duration-300" />
                            <text
                              x={(e.x1 + e.x2) / 2 + (e.label === '0' ? -12 : 8)}
                              y={(e.y1 + e.y2) / 2 + 10}
                              fill="hsl(var(--muted-foreground))" fontSize={11} fontFamily="var(--font-mono)"
                            >{e.label}</text>
                          </g>
                        ))}
                        {nodes.map(n => {
                          const isActive = n.id === step.activeNodeId;
                          const isLeaf = n.char !== null;
                          const isHighlighted = step.highlightedChar === n.char && isLeaf;

                          let fill = 'hsl(var(--node-default))';
                          if (isActive) fill = 'hsl(var(--node-active))';
                          else if (isHighlighted) fill = 'hsl(var(--node-merged))';
                          else if (isLeaf) fill = 'hsl(var(--node-leaf))';

                          return (
                            <g key={n.id} className="transition-all duration-300">
                              <circle cx={n.x} cy={n.y} r={isActive ? 20 : 17} fill={fill} opacity={0.9}
                                className="transition-all duration-300" />
                              {isActive && (
                                <circle cx={n.x} cy={n.y} r={24} fill="none"
                                  stroke="hsl(var(--gold))" strokeWidth={1.5} opacity={0.4}
                                  className="node-pulse" />
                              )}
                              {isLeaf && (
                                <text x={n.x} y={n.y - 3} textAnchor="middle" fill="hsl(var(--background))"
                                  fontSize={12} fontWeight={600} fontFamily="var(--font-mono)">{n.char}</text>
                              )}
                              <text x={n.x} y={n.y + (isLeaf ? 10 : 5)} textAnchor="middle"
                                fill={isLeaf ? 'hsl(var(--background))' : 'hsl(var(--foreground))'}
                                fontSize={9} fontFamily="var(--font-mono)">{n.freq}</text>
                            </g>
                          );
                        })}
                      </svg>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-lg text-center space-y-8">
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-2xl gold-gradient opacity-20 animate-pulse" />
                    <div className="absolute inset-2 rounded-xl bg-card flex items-center justify-center">
                      <Unlock className="w-10 h-10 text-primary" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary animate-float" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-2xl md:text-3xl font-bold">
                      <span className="gold-text">Huffman</span> Decryption Studio
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Enter your text in the control panel and hit <span className="text-primary font-medium">Start Decoding</span> to
                      watch the Huffman tree traversal decode binary back into characters.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { icon: Binary, label: 'Binary Parsing' },
                      { icon: GitBranch, label: 'Tree Traversal' },
                      { icon: KeyRound, label: 'Character Recovery' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30 text-sm text-muted-foreground">
                        <f.icon className="w-3.5 h-3.5 text-primary" />
                        {f.label}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>Type text in the left panel to begin</span>
                  </div>
                </div>
              </div>
            )}
          </main>

          <aside className="w-80 flex-shrink-0 border-l border-border/30 bg-card/50 overflow-y-auto p-5 space-y-5">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Step Explanation</h2>
            {step ? (
              <div className="step-fade-in space-y-4" key={step.stepIndex}>
                <h3 className="text-base font-semibold leading-snug">{step.description}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{step.detail}</p>
                {step.currentPath && (
                  <div className="pt-2 border-t border-border/30">
                    <label className="text-xs text-muted-foreground uppercase tracking-wider">Current Path</label>
                    <p className="font-mono text-sm text-primary mt-1">{step.currentPath}</p>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">Explanation will appear here during decoding.</p>
            )}
          </aside>
        </div>
      </div>
    </>
  );
};

export default DecryptPage;

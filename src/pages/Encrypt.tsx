import { useState, useCallback, useEffect, useRef } from 'react';
import { useHuffmanEngine } from '../engine/useHuffmanEngine';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ArrayView } from '../components/viz/ArrayView';
import { HashTableView } from '../components/viz/HashTableView';
import { TreeView } from '../components/viz/TreeView';
import { CodeTableView } from '../components/viz/CodeTableView';
import { PipelineBar } from '../components/viz/PipelineBar';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { Lock, Sparkles, ArrowLeft, Binary, Layers, GitBranch } from 'lucide-react';

const Encrypt = () => {
  const engine = useHuffmanEngine();
  const step = engine.currentStepData;
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (autoPlaying && engine.isStarted && !engine.isComplete) {
      autoPlayRef.current = setInterval(() => {
        engine.next();
      }, 600);
    }
    return () => {
      if (autoPlayRef.current) clearInterval(autoPlayRef.current);
    };
  }, [autoPlaying, engine.isStarted, engine.isComplete, engine.next]);

  useEffect(() => {
    if (engine.isComplete) setAutoPlaying(false);
  }, [engine.isComplete]);

  const handleSimulate = useCallback((input: string) => {
    engine.start(input);
    setAutoPlaying(false);
  }, [engine]);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (!engine.isStarted) return;
      if (e.key === 'ArrowRight') { e.preventDefault(); if (!autoPlaying) engine.next(); }
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (!autoPlaying) engine.prev(); }
      if (e.key === ' ') { e.preventDefault(); setAutoPlaying(p => !p); }
      if (e.key === 'r' || e.key === 'R') { e.preventDefault(); engine.reset(); setAutoPlaying(false); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [engine, autoPlaying]);

  const showEmpty = !engine.isStarted;
  const phase = step.phase;

  // Determine which viz panels to show based on phase
  const showArray = phase !== 'idle';
  const showHash = phase === 'counting' || phase === 'building' || phase === 'generating' || phase === 'encoding' || phase === 'complete';
  const showTree = phase === 'building' || phase === 'generating' || phase === 'encoding' || phase === 'complete';
  const showCodes = phase === 'generating' || phase === 'encoding' || phase === 'complete';

  return (
    <>
      <CustomCursor />
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-16">
          {/* LEFT: Controls */}
          <aside className="w-72 flex-shrink-0 border-r border-border/30 bg-card/50 overflow-y-auto">
            <ControlPanel
              engine={engine}
              onSimulate={handleSimulate}
              autoPlaying={autoPlaying}
              onToggleAutoPlay={() => setAutoPlaying(p => !p)}
            />
          </aside>

          {/* CENTER: Visualization Stage */}
          <main className="flex-1 overflow-y-auto flex flex-col">
            {/* Pipeline indicator */}
            {engine.isStarted && (
              <PipelineBar currentPhase={phase} />
            )}

            {showEmpty ? (
              <div className="flex-1 flex items-center justify-center">
                <div className="max-w-md text-center space-y-8">
                  <div className="relative mx-auto w-28 h-28">
                    <div className="absolute inset-0 rounded-2xl gold-gradient opacity-20 animate-pulse" />
                    <div className="absolute inset-3 rounded-xl bg-card flex items-center justify-center">
                      <Lock className="w-12 h-12 text-primary" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-primary animate-float" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-3xl font-bold">
                      <span className="gold-text">Huffman</span> Encryption Studio
                    </h2>
                    <p className="text-muted-foreground leading-relaxed text-sm">
                      Enter text in the left panel and press <span className="text-primary font-semibold">Simulate</span> to watch
                      the algorithm unfold, one atomic step at a time.
                    </p>
                  </div>

                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { icon: Layers, label: 'Array Traversal' },
                      { icon: Binary, label: 'Hash Mapping' },
                      { icon: GitBranch, label: 'Tree Construction' },
                    ].map((f, i) => (
                      <div key={i} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30 text-sm text-muted-foreground">
                        <f.icon className="w-3.5 h-3.5 text-primary" />
                        {f.label}
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-center gap-2 text-xs text-muted-foreground/60">
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Type text in the left panel to begin</span>
                  </div>

                  <div className="pt-4 text-[10px] text-muted-foreground/40 font-mono">
                    Keyboard: ← → navigate · Space play/pause · R reset
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 p-5 space-y-4 overflow-y-auto">
                {/* Array — always visible once started */}
                {showArray && (
                  <div className={`glass-panel p-5 transition-all duration-500 ${phase === 'parsing' || phase === 'counting' ? 'ring-1 ring-primary/30 glow-primary' : ''}`}>
                    <ArrayView step={step} />
                  </div>
                )}

                {/* Hash + Codes side by side */}
                {(showHash || showCodes) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {showHash && (
                      <div className={`glass-panel p-5 transition-all duration-500 ${phase === 'counting' ? 'ring-1 ring-primary/30 glow-primary' : ''}`}>
                        <HashTableView step={step} />
                      </div>
                    )}
                    {showCodes && (
                      <div className={`glass-panel p-5 transition-all duration-500 ${phase === 'generating' ? 'ring-1 ring-primary/30 glow-primary' : ''}`}>
                        <CodeTableView step={step} />
                      </div>
                    )}
                  </div>
                )}

                {/* Tree — the star of the show */}
                {showTree && (
                  <div className={`glass-panel p-5 transition-all duration-500 ${phase === 'building' || phase === 'generating' ? 'ring-1 ring-primary/30 glow-primary' : ''}`}>
                    <TreeView step={step} />
                  </div>
                )}

                {/* Encoded output during encoding phase */}
                {step.snapshot.encodedOutput && (
                  <div className={`glass-panel p-5 transition-all duration-500 ${phase === 'encoding' ? 'ring-1 ring-primary/30 glow-primary' : ''}`}>
                    <div className="space-y-3">
                      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                        <Binary className="w-3.5 h-3.5 text-primary" />
                        Encoded Output
                      </h3>
                      <div className="flex flex-wrap gap-0.5 font-mono text-sm">
                        {step.snapshot.encodedOutput.split('').map((bit, i) => (
                          <span
                            key={i}
                            className={`w-5 h-6 flex items-center justify-center rounded text-xs transition-all duration-200
                              ${i >= step.snapshot.encodedOutput.length - (step.snapshot.codes[step.snapshot.inputChars[step.snapshot.encodingProgress]] || '').length && i < step.snapshot.encodedOutput.length
                                ? 'bg-primary text-primary-foreground font-bold'
                                : 'bg-secondary/50 text-muted-foreground'
                              }`}
                          >
                            {bit}
                          </span>
                        ))}
                      </div>
                      <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
                        <span>{step.snapshot.encodedOutput.length} bits</span>
                        <span>{step.snapshot.inputChars.length * 8} bits uncompressed</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </main>

          {/* RIGHT: Explanation */}
          <aside className="w-80 flex-shrink-0 border-l border-border/30 bg-card/50 overflow-y-auto">
            <ExplanationPanel step={step} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default Encrypt;

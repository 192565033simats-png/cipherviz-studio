import { useState, useCallback, useEffect, useRef } from 'react';
import { useHuffmanEngine } from '../engine/useHuffmanEngine';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ArrayView } from '../components/viz/ArrayView';
import { HashTableView } from '../components/viz/HashTableView';
import { TreeView } from '../components/viz/TreeView';
import { CodeTableView } from '../components/viz/CodeTableView';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';
import { Lock, Sparkles, ArrowRight, Binary, Layers, GitBranch } from 'lucide-react';

const Encrypt = () => {
  const engine = useHuffmanEngine();
  const { state } = engine;
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
    setAutoPlaying(true);
  }, [engine]);

  const showEmpty = !engine.isStarted;

  return (
    <>
      <CustomCursor />
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar />
        <div className="flex flex-1 overflow-hidden pt-16">
          <aside className="w-72 flex-shrink-0 border-r border-border/30 bg-card/50 overflow-y-auto">
            <ControlPanel
              engine={engine}
              onSimulate={handleSimulate}
              autoPlaying={autoPlaying}
              onToggleAutoPlay={() => setAutoPlaying(p => !p)}
            />
          </aside>

          <main className="flex-1 overflow-y-auto p-6 space-y-6">
            {showEmpty ? (
              <div className="flex items-center justify-center h-full">
                <div className="max-w-lg text-center space-y-8">
                  {/* Animated icon */}
                  <div className="relative mx-auto w-24 h-24">
                    <div className="absolute inset-0 rounded-2xl gold-gradient opacity-20 animate-pulse" />
                    <div className="absolute inset-2 rounded-xl bg-card flex items-center justify-center">
                      <Lock className="w-10 h-10 text-primary" />
                    </div>
                    <Sparkles className="absolute -top-2 -right-2 w-5 h-5 text-primary animate-float" />
                  </div>

                  <div className="space-y-3">
                    <h2 className="font-display text-2xl md:text-3xl font-bold">
                      <span className="gold-text">Huffman</span> Encryption Studio
                    </h2>
                    <p className="text-muted-foreground leading-relaxed">
                      Enter your text in the control panel and hit <span className="text-primary font-medium">Simulate</span> to
                      watch the Huffman coding algorithm unfold step by step.
                    </p>
                  </div>

                  {/* Feature pills */}
                  <div className="flex flex-wrap justify-center gap-3">
                    {[
                      { icon: Layers, label: 'Array Processing' },
                      { icon: Binary, label: 'Frequency Mapping' },
                      { icon: GitBranch, label: 'Tree Construction' },
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
            ) : (
              <>
                <div className="glass-panel p-5">
                  <ArrayView state={state} />
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="glass-panel p-5">
                    <HashTableView state={state} />
                  </div>
                  <div className="glass-panel p-5">
                    <CodeTableView state={state} />
                  </div>
                </div>
                <div className="glass-panel p-5">
                  <TreeView state={state} />
                </div>
              </>
            )}
          </main>

          <aside className="w-80 flex-shrink-0 border-l border-border/30 bg-card/50 overflow-y-auto">
            <ExplanationPanel state={state} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default Encrypt;

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

import { useState, useCallback, useEffect, useRef } from 'react';
import { useHuffmanEngine } from '../engine/useHuffmanEngine';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ArrayView } from '../components/viz/ArrayView';
import { HashTableView } from '../components/viz/HashTableView';
import { TreeView } from '../components/viz/TreeView';
import { CodeTableView } from '../components/viz/CodeTableView';
import { LandingPage } from '../components/LandingPage';
import { CustomCursor } from '../components/CustomCursor';
import { Navbar } from '../components/Navbar';

const Index = () => {
  const engine = useHuffmanEngine();
  const { state } = engine;
  const [showStudio, setShowStudio] = useState(false);
  const [autoPlaying, setAutoPlaying] = useState(false);
  const autoPlayRef = useRef<ReturnType<typeof setInterval>>();

  const launchStudio = useCallback(() => {
    setShowStudio(true);
    window.scrollTo({ top: 0 });
  }, []);

  // Auto-play: advance one step at a time
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

  // Stop auto-play when complete
  useEffect(() => {
    if (engine.isComplete) setAutoPlaying(false);
  }, [engine.isComplete]);

  const handleSimulate = useCallback((input: string) => {
    engine.start(input);
    setAutoPlaying(true);
  }, [engine]);

  if (!showStudio) {
    return (
      <>
        <CustomCursor />
        <LandingPage onLaunch={launchStudio} />
      </>
    );
  }

  return (
    <>
      <CustomCursor />
      <div className="h-screen flex flex-col overflow-hidden">
        <Navbar onSimulationClick={() => setShowStudio(false)} />
        <div className="flex flex-1 overflow-hidden pt-16">
          {/* Left — Controls */}
          <aside className="w-72 flex-shrink-0 border-r border-border/30 bg-card/50 overflow-y-auto">
            <ControlPanel
              engine={engine}
              onSimulate={handleSimulate}
              autoPlaying={autoPlaying}
              onToggleAutoPlay={() => setAutoPlaying(p => !p)}
            />
          </aside>

          {/* Center — Visualization */}
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

          {/* Right — Explanation */}
          <aside className="w-80 flex-shrink-0 border-l border-border/30 bg-card/50 overflow-y-auto">
            <ExplanationPanel state={state} />
          </aside>
        </div>
      </div>
    </>
  );
};

export default Index;

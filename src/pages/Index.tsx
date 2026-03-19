import { useHuffmanEngine } from '../engine/useHuffmanEngine';
import { ControlPanel } from '../components/ControlPanel';
import { ExplanationPanel } from '../components/ExplanationPanel';
import { ArrayView } from '../components/viz/ArrayView';
import { HashTableView } from '../components/viz/HashTableView';
import { TreeView } from '../components/viz/TreeView';
import { CodeTableView } from '../components/viz/CodeTableView';

const Index = () => {
  const engine = useHuffmanEngine();
  const { state } = engine;

  return (
    <div className="h-screen flex overflow-hidden">
      {/* Left — Controls */}
      <aside className="w-72 flex-shrink-0 border-r border-border/50 bg-card/50 overflow-y-auto">
        <ControlPanel engine={engine} />
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
      <aside className="w-80 flex-shrink-0 border-l border-border/50 bg-card/50 overflow-y-auto">
        <ExplanationPanel state={state} />
      </aside>
    </div>
  );
};

export default Index;

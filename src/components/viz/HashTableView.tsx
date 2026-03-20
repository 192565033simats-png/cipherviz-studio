import { Step } from '../../engine/types';
import { Hash } from 'lucide-react';

interface HashTableViewProps {
  step: Step;
}

export function HashTableView({ step }: HashTableViewProps) {
  const freqMap = step.snapshot.frequencyMap;
  const activeFreqKey = step.highlight.characters[0] ?? null;
  const entries = Object.entries(freqMap).sort((a, b) => (b[1] as number) - (a[1] as number)) as [string, number][];

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
        Frequency table will appear here
      </div>
    );
  }

  const maxFreq = Math.max(...entries.map(e => e[1]));

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Hash className="w-3.5 h-3.5 text-primary" />
        Frequency Table
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{entries.length} unique</span>
      </h3>
      <div className="grid gap-1.5">
        {entries.map(([char, freq]) => {
          const isActive = char === activeFreqKey && (step.phase === 'counting' || step.phase === 'building');
          const barWidth = (freq / maxFreq) * 100;

          return (
            <div
              key={char}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm
                transition-all duration-300
                ${isActive
                  ? 'bg-primary/20 ring-2 ring-primary/50 scale-[1.02] glow-primary z-10'
                  : 'bg-secondary/40 hover:bg-secondary/60'}
              `}
            >
              <span className={`w-8 text-center font-bold text-base ${isActive ? 'text-primary' : 'text-foreground'}`}>
                {char === ' ' ? '␣' : char}
              </span>
              <div className="flex-1 h-6 bg-muted/20 rounded-md overflow-hidden">
                <div
                  className={`h-full rounded-md transition-all duration-700 ease-out ${isActive ? 'gold-gradient' : 'bg-secondary/80'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className={`w-8 text-right tabular-nums font-bold ${isActive ? 'text-primary text-lg' : 'text-muted-foreground'}`}>
                {freq}
              </span>
              {isActive && (
                <span className="absolute -left-1 top-1/2 -translate-y-1/2 w-1.5 h-6 rounded-full bg-primary" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

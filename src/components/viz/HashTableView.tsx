import { Step } from '../../engine/types';

interface HashTableViewProps {
  step: Step;
}

export function HashTableView({ step }: HashTableViewProps) {
  const freqMap = step.snapshot.frequencyMap;
  const activeFreqKey = step.highlight.characters[0] ?? null;
  const entries = Object.entries(freqMap).sort((a, b) => (b[1] as number) - (a[1] as number)) as [string, number][];

  if (entries.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Frequency table will appear here
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Frequency Table
      </h3>
      <div className="grid gap-1.5">
        {entries.map(([char, freq]) => {
          const isActive = char === activeFreqKey && step.phase === 'counting';
          const maxFreq = Math.max(...entries.map(e => e[1]));
          const barWidth = (freq / maxFreq) * 100;

          return (
            <div
              key={char}
              className={`
                relative flex items-center gap-3 px-3 py-2 rounded-lg font-mono text-sm
                transition-all duration-300
                ${isActive ? 'bg-primary/20 ring-1 ring-primary/40' : 'bg-secondary/50'}
              `}
            >
              <span className={`w-6 text-center font-semibold ${isActive ? 'text-primary' : 'text-foreground'}`}>
                '{char}'
              </span>
              <div className="flex-1 h-5 bg-muted/30 rounded-md overflow-hidden">
                <div
                  className={`h-full rounded-md transition-all duration-500 ease-out ${isActive ? 'bg-primary/60' : 'bg-secondary'}`}
                  style={{ width: `${barWidth}%` }}
                />
              </div>
              <span className={`w-8 text-right tabular-nums ${isActive ? 'text-primary font-semibold' : 'text-muted-foreground'}`}>
                {freq}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

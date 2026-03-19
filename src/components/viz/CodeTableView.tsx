import { Step } from '../../engine/types';

interface CodeTableViewProps {
  step: Step;
}

export function CodeTableView({ step }: CodeTableViewProps) {
  const codes = step.snapshot.codes;
  const activeCodeKey = step.highlight.activeCodeKey;
  const entries = Object.entries(codes).sort((a, b) => a[0].localeCompare(b[0]));

  if (entries.length === 0) return null;

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Huffman Codes
      </h3>
      <div className="grid gap-1">
        {entries.map(([char, code]) => {
          const isActive = char === activeCodeKey;
          return (
            <div
              key={char}
              className={`
                flex items-center justify-between px-3 py-1.5 rounded-lg font-mono text-sm
                transition-all duration-300
                ${isActive ? 'bg-accent/20 ring-1 ring-accent/40' : 'bg-secondary/30'}
              `}
            >
              <span className={isActive ? 'text-accent font-semibold' : 'text-foreground'}>'{char}'</span>
              <span className={`tabular-nums ${isActive ? 'text-accent' : 'text-muted-foreground'}`}>{code}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

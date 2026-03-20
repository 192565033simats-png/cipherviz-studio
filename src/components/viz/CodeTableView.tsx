import { Step } from '../../engine/types';
import { Code } from 'lucide-react';

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
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Code className="w-3.5 h-3.5 text-primary" />
        Huffman Codes
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{entries.length} codes</span>
      </h3>
      <div className="grid gap-1.5">
        {entries.map(([char, code]) => {
          const isActive = char === activeCodeKey;
          return (
            <div
              key={char}
              className={`
                relative flex items-center justify-between px-3 py-2 rounded-lg font-mono text-sm
                transition-all duration-300
                ${isActive
                  ? 'bg-primary/20 ring-2 ring-primary/50 scale-[1.02] glow-primary'
                  : 'bg-secondary/30 hover:bg-secondary/50'}
              `}
            >
              <span className={`font-bold ${isActive ? 'text-primary text-base' : 'text-foreground'}`}>
                {char === ' ' ? '␣' : `'${char}'`}
              </span>
              <div className="flex gap-0.5">
                {code.split('').map((bit, i) => (
                  <span
                    key={i}
                    className={`w-5 h-5 flex items-center justify-center rounded text-[10px] font-bold
                      ${isActive
                        ? bit === '0' ? 'bg-primary/30 text-primary' : 'bg-accent/30 text-accent-foreground'
                        : 'bg-muted/30 text-muted-foreground'
                      }`}
                  >
                    {bit}
                  </span>
                ))}
              </div>
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

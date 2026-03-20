import { Step } from '../../engine/types';
import { Layers } from 'lucide-react';

interface ArrayViewProps {
  step: Step;
}

export function ArrayView({ step }: ArrayViewProps) {
  const { inputChars } = step.snapshot;
  const activeCharIndex = step.highlight.charIndex;

  if (inputChars.length === 0) {
    return (
      <div className="flex items-center justify-center h-20 text-muted-foreground text-sm">
        Input array will appear here
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
        <Layers className="w-3.5 h-3.5 text-primary" />
        Input Array
        <span className="ml-auto text-[10px] font-mono text-muted-foreground/60">{inputChars.length} chars</span>
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {inputChars.map((char, i) => {
          const isActive = i === activeCharIndex;
          const isProcessed = activeCharIndex >= 0 && i < activeCharIndex;
          return (
            <div key={`${i}-${char}`} className="flex flex-col items-center gap-1">
              <div
                className={`
                  relative flex items-center justify-center w-10 h-10 rounded-lg font-mono text-sm font-semibold
                  transition-all duration-300 ease-out
                  ${isActive
                    ? 'bg-primary text-primary-foreground scale-125 glow-primary ring-2 ring-primary/50 z-10'
                    : isProcessed
                      ? 'bg-secondary/60 text-muted-foreground scale-95 opacity-50'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                  }
                `}
              >
                {char === ' ' ? '␣' : char}
                {isActive && (
                  <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-primary animate-ping" />
                )}
              </div>
              <span className={`text-[9px] font-mono transition-all duration-300 ${isActive ? 'text-primary font-bold' : 'text-muted-foreground/40'}`}>
                {i}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

import { StepState } from '../../engine/types';

interface ArrayViewProps {
  state: StepState;
}

export function ArrayView({ state }: ArrayViewProps) {
  const { inputChars, activeCharIndex } = state;

  if (inputChars.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
        Input array will appear here
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
        Input Array
      </h3>
      <div className="flex flex-wrap gap-1.5">
        {inputChars.map((char, i) => {
          const isActive = i === activeCharIndex;
          const isProcessed = activeCharIndex >= 0 && i < activeCharIndex;
          return (
            <div
              key={i}
              className={`
                flex items-center justify-center w-9 h-9 rounded-lg font-mono text-sm font-medium
                transition-all duration-300 ease-out
                ${isActive
                  ? 'bg-primary text-primary-foreground scale-110 glow-primary'
                  : isProcessed
                    ? 'bg-secondary text-secondary-foreground opacity-60'
                    : 'bg-secondary text-secondary-foreground'
                }
              `}
            >
              {char}
            </div>
          );
        })}
      </div>
      <div className="flex gap-1.5">
        {inputChars.map((_, i) => (
          <div key={i} className="w-9 text-center text-[10px] text-muted-foreground font-mono">
            {i}
          </div>
        ))}
      </div>
    </div>
  );
}

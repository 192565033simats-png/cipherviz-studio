import { StepState } from '../engine/types';
import { Info, Database, GitBranch, Binary } from 'lucide-react';

interface ExplanationPanelProps {
  state: StepState;
}

const dsIcons: Record<string, typeof Info> = {
  'Array': Database,
  'Hash Table': Database,
  'Tree': GitBranch,
  'Tree / Priority Queue': GitBranch,
  'Array → Binary Output': Binary,
  'Complete': Info,
};

export function ExplanationPanel({ state }: ExplanationPanelProps) {
  const Icon = dsIcons[state.dataStructure] || Info;

  return (
    <div className="flex flex-col h-full p-5 space-y-5">
      <div className="space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step Explanation
        </h2>
      </div>

      <div className="step-fade-in space-y-4" key={state.stepIndex}>
        {/* Description */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {state.dataStructure || 'Ready'}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug">{state.description}</h3>
        </div>

        {/* Detail */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {state.detail}
        </p>

        {/* Encoded output */}
        {state.encodedBinary && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Encoded Output
            </h4>
            <div className="p-3 rounded-xl bg-secondary/50 max-h-32 overflow-auto">
              <p className="font-mono text-xs text-accent break-all leading-relaxed">
                {state.encodedBinary}
              </p>
            </div>
            <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
              <span>{state.encodedBinary.length} bits</span>
              {state.inputChars.length > 0 && (
                <span>
                  {((1 - state.encodedBinary.length / (state.inputChars.length * 8)) * 100).toFixed(1)}% compression
                </span>
              )}
            </div>
            {state.phase === 'complete' && (
              <button
                onClick={() => navigator.clipboard.writeText(state.encodedBinary)}
                className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium
                  hover:bg-primary/20 transition-all"
              >
                Copy Binary
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

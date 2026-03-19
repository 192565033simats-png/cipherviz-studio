import { Step } from '../engine/types';
import { Info, Database, GitBranch, Binary } from 'lucide-react';

interface ExplanationPanelProps {
  step: Step;
}

const dsIcons: Record<string, typeof Info> = {
  'Array': Database,
  'Hash Table': Database,
  'Tree': GitBranch,
  'Tree / Priority Queue': GitBranch,
  'Array → Binary Output': Binary,
  'Complete': Info,
};

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  const Icon = dsIcons[step.dataStructure] || Info;

  return (
    <div className="flex flex-col h-full p-5 space-y-5">
      <div className="space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step Explanation
        </h2>
      </div>

      <div className="step-fade-in space-y-4" key={step.index}>
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-primary">
            <Icon className="w-4 h-4" />
            <span className="text-xs font-medium uppercase tracking-wider">
              {step.dataStructure || 'Ready'}
            </span>
          </div>
          <h3 className="text-base font-semibold leading-snug">{step.action}</h3>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.explanation}
        </p>

        {step.snapshot.encodedOutput && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Encoded Output
            </h4>
            <div className="p-3 rounded-xl bg-secondary/50 max-h-32 overflow-auto">
              <p className="font-mono text-xs text-accent break-all leading-relaxed">
                {step.snapshot.encodedOutput}
              </p>
            </div>
            <div className="flex gap-3 text-[10px] text-muted-foreground font-mono">
              <span>{step.snapshot.encodedOutput.length} bits</span>
              {step.snapshot.inputChars.length > 0 && (
                <span>
                  {((1 - step.snapshot.encodedOutput.length / (step.snapshot.inputChars.length * 8)) * 100).toFixed(1)}% compression
                </span>
              )}
            </div>
            {step.phase === 'complete' && (
              <button
                onClick={() => navigator.clipboard.writeText(step.snapshot.encodedOutput)}
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

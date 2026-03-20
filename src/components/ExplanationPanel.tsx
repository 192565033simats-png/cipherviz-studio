import { Step } from '../engine/types';
import { Info, Database, GitBranch, Binary, Layers, Hash, Code, CheckCircle } from 'lucide-react';

interface ExplanationPanelProps {
  step: Step;
}

const phaseIcons: Record<string, typeof Info> = {
  'idle': Info,
  'parsing': Layers,
  'counting': Hash,
  'building': GitBranch,
  'generating': Code,
  'encoding': Binary,
  'complete': CheckCircle,
};

const phaseColors: Record<string, string> = {
  'idle': 'text-muted-foreground',
  'parsing': 'text-primary',
  'counting': 'text-primary',
  'building': 'text-primary',
  'generating': 'text-primary',
  'encoding': 'text-primary',
  'complete': 'text-primary',
};

export function ExplanationPanel({ step }: ExplanationPanelProps) {
  const Icon = phaseIcons[step.phase] || Info;
  const color = phaseColors[step.phase] || 'text-muted-foreground';

  return (
    <div className="flex flex-col h-full p-5 space-y-5">
      <div className="space-y-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Step Explanation
        </h2>
        {step.phase !== 'idle' && (
          <div className="text-[10px] font-mono text-muted-foreground/50">
            Step {step.index + 1}
          </div>
        )}
      </div>

      <div className="step-fade-in space-y-4" key={step.index}>
        {/* Phase badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-primary/10 ${color}`}>
          <Icon className="w-3.5 h-3.5" />
          <span className="text-xs font-semibold uppercase tracking-wider">
            {step.phase === 'idle' ? 'Ready' : step.phase}
          </span>
        </div>

        {/* Data structure label */}
        {step.dataStructure && (
          <div className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-widest">
            Using: {step.dataStructure}
          </div>
        )}

        {/* Action */}
        <h3 className="text-base font-semibold leading-snug">{step.action}</h3>

        {/* Explanation */}
        <p className="text-sm text-muted-foreground leading-relaxed">
          {step.explanation}
        </p>

        {/* Highlight info */}
        {step.highlight.charIndex >= 0 && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Active Index</div>
            <div className="font-mono text-sm text-primary font-bold">
              [{step.highlight.charIndex}] → '{step.snapshot.inputChars[step.highlight.charIndex]}'
            </div>
          </div>
        )}

        {step.highlight.activeCodeKey && (
          <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 space-y-1">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Active Code</div>
            <div className="font-mono text-sm text-primary font-bold">
              '{step.highlight.activeCodeKey}' → {step.snapshot.codes[step.highlight.activeCodeKey]}
            </div>
          </div>
        )}

        {/* Encoded output summary */}
        {step.snapshot.encodedOutput && step.phase === 'complete' && (
          <div className="space-y-3 pt-3 border-t border-border/50">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Final Result
            </h4>
            <div className="p-3 rounded-xl bg-secondary/50 max-h-24 overflow-auto">
              <p className="font-mono text-xs text-primary break-all leading-relaxed">
                {step.snapshot.encodedOutput}
              </p>
            </div>
            <div className="flex gap-4 text-[10px] text-muted-foreground font-mono">
              <span>{step.snapshot.encodedOutput.length} bits</span>
              <span>
                {((1 - step.snapshot.encodedOutput.length / (step.snapshot.inputChars.length * 8)) * 100).toFixed(1)}% saved
              </span>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(step.snapshot.encodedOutput)}
              className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium
                hover:bg-primary/20 transition-all"
            >
              Copy Binary
            </button>
          </div>
        )}
      </div>

      {/* Keyboard hints */}
      <div className="mt-auto pt-4 border-t border-border/30 space-y-1.5">
        <div className="text-[10px] uppercase tracking-wider text-muted-foreground/40 font-semibold">Keyboard</div>
        <div className="grid grid-cols-2 gap-1 text-[10px] font-mono text-muted-foreground/40">
          <span>← → Navigate</span>
          <span>Space Play/Pause</span>
          <span>R Reset</span>
        </div>
      </div>
    </div>
  );
}

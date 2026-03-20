import { StepPhase } from '../../engine/types';
import { Layers, Hash, GitBranch, Code, Binary, CheckCircle } from 'lucide-react';

interface PipelineBarProps {
  currentPhase: StepPhase;
}

const phases: { key: StepPhase; label: string; icon: typeof Layers }[] = [
  { key: 'parsing', label: 'Parse', icon: Layers },
  { key: 'counting', label: 'Count', icon: Hash },
  { key: 'building', label: 'Build Tree', icon: GitBranch },
  { key: 'generating', label: 'Gen Codes', icon: Code },
  { key: 'encoding', label: 'Encode', icon: Binary },
  { key: 'complete', label: 'Done', icon: CheckCircle },
];

const phaseOrder = ['parsing', 'counting', 'building', 'generating', 'encoding', 'complete'];

export function PipelineBar({ currentPhase }: PipelineBarProps) {
  const currentIdx = phaseOrder.indexOf(currentPhase);

  return (
    <div className="flex-shrink-0 border-b border-border/30 bg-card/30 backdrop-blur-sm px-5 py-3">
      <div className="flex items-center gap-1">
        {phases.map((p, i) => {
          const isActive = p.key === currentPhase;
          const isPast = i < currentIdx;
          const Icon = p.icon;

          return (
            <div key={p.key} className="flex items-center">
              {i > 0 && (
                <div className={`w-6 h-px mx-1 transition-all duration-500 ${isPast || isActive ? 'bg-primary' : 'bg-border/50'}`} />
              )}
              <div
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-500
                  ${isActive
                    ? 'bg-primary/20 text-primary ring-1 ring-primary/40 glow-primary scale-105'
                    : isPast
                      ? 'bg-primary/10 text-primary/70'
                      : 'bg-secondary/30 text-muted-foreground/50'
                  }`}
              >
                <Icon className="w-3 h-3" />
                <span className="hidden lg:inline">{p.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

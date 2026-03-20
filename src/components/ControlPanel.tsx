import { useState } from 'react';
import { HuffmanEngine } from '../engine/types';
import { Play, SkipForward, SkipBack, RotateCcw, Zap, Pause, ChevronRight } from 'lucide-react';

interface ControlPanelProps {
  engine: HuffmanEngine;
  onSimulate?: (input: string) => void;
  autoPlaying?: boolean;
  onToggleAutoPlay?: () => void;
}

export function ControlPanel({ engine, onSimulate, autoPlaying, onToggleAutoPlay }: ControlPanelProps) {
  const [input, setInput] = useState('hello world');
  const { isStarted, isComplete, currentStep, totalSteps, currentStepData } = engine;

  const handleStart = () => {
    if (input.trim()) {
      if (onSimulate) {
        onSimulate(input);
      } else {
        engine.start(input);
      }
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 space-y-5">
        {/* Logo */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight gold-text">CipherStruct</h1>
          </div>
          <p className="text-xs text-muted-foreground">Interactive Huffman Coding Engine</p>
        </div>

        {/* Input */}
        <div className="space-y-2">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Input Text
          </label>
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isStarted}
            placeholder="Enter text to encode..."
            className="w-full h-24 px-3 py-2.5 bg-input rounded-xl text-sm font-mono resize-none
              border border-border/50 focus:border-primary/50 focus:outline-none focus:ring-1 focus:ring-primary/20
              placeholder:text-muted-foreground/40 transition-all disabled:opacity-50"
          />
        </div>

        {/* Controls */}
        <div className="space-y-2">
          {!isStarted ? (
            <button
              onClick={handleStart}
              disabled={!input.trim()}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                gold-gradient text-primary-foreground font-semibold text-sm
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                glow-gold group"
            >
              <Play className="w-4 h-4 group-hover:scale-110 transition-transform" />
              Start Simulation
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          ) : (
            <div className="space-y-3">
              {/* Step navigation */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={engine.prev}
                  disabled={currentStep === 0 || autoPlaying}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl
                    bg-secondary text-secondary-foreground text-sm font-medium
                    hover:bg-secondary/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                    active:scale-95"
                >
                  <SkipBack className="w-3.5 h-3.5" />
                  Prev
                </button>
                <button
                  onClick={engine.next}
                  disabled={isComplete || autoPlaying}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl
                    gold-gradient text-primary-foreground text-sm font-semibold
                    hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed
                    active:scale-95"
                >
                  Next
                  <SkipForward className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => { engine.reset(); }}
                  className="flex items-center justify-center gap-1 px-3 py-2.5 rounded-xl
                    crimson-gradient text-accent-foreground text-sm font-medium
                    hover:opacity-90 transition-all active:scale-95"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset
                </button>
              </div>

              {/* Auto-play */}
              {onToggleAutoPlay && (
                <button
                  onClick={onToggleAutoPlay}
                  disabled={isComplete}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all
                    ${autoPlaying
                      ? 'bg-primary/20 text-primary border border-primary/30 glow-primary'
                      : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                    } disabled:opacity-30`}
                >
                  {autoPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  {autoPlaying ? 'Pause' : 'Auto-Play'}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span className="font-mono">Step {currentStep + 1} / {totalSteps}</span>
              <span className="capitalize font-semibold text-primary">{currentStepData.phase}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full gold-gradient rounded-full transition-all duration-300 ease-out"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Step scrubber */}
        {isStarted && (
          <div className="space-y-2">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Jump to step
            </label>
            <input
              type="range"
              min={0}
              max={totalSteps - 1}
              value={currentStep}
              onChange={(e) => engine.goToStep(Number(e.target.value))}
              disabled={autoPlaying}
              className="w-full h-1.5 bg-muted rounded-full appearance-none cursor-pointer
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:cursor-pointer
                [&::-webkit-slider-thumb]:shadow-[0_0_8px_hsl(var(--primary)/0.4)]
                disabled:opacity-30"
            />
          </div>
        )}

        {/* Phase indicators */}
        {isStarted && (
          <div className="space-y-1.5">
            <label className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Phases
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['parsing', 'counting', 'building', 'generating', 'encoding', 'complete'].map(phase => (
                <span
                  key={phase}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all
                    ${currentStepData.phase === phase
                      ? 'bg-primary/20 text-primary ring-1 ring-primary/30 scale-105'
                      : 'bg-secondary/50 text-muted-foreground'
                    }`}
                >
                  {phase}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

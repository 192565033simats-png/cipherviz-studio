import { useState } from 'react';
import { HuffmanEngine } from '../engine/types';
import { Play, SkipForward, SkipBack, RotateCcw, Zap } from 'lucide-react';

interface ControlPanelProps {
  engine: HuffmanEngine;
}

export function ControlPanel({ engine }: ControlPanelProps) {
  const [input, setInput] = useState('hello world');
  const { isStarted, isComplete, currentStep, totalSteps } = engine;

  const handleStart = () => {
    if (input.trim()) engine.start(input);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-5 space-y-5">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-primary" />
            <h1 className="text-lg font-semibold tracking-tight">CipherStruct</h1>
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
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl
                bg-primary text-primary-foreground font-medium text-sm
                hover:opacity-90 transition-all disabled:opacity-40 disabled:cursor-not-allowed
                glow-primary"
            >
              <Play className="w-4 h-4" />
              Start Visualization
            </button>
          ) : (
            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={engine.prev}
                disabled={currentStep === 0}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
                  bg-secondary text-secondary-foreground text-sm font-medium
                  hover:bg-secondary/80 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                <SkipBack className="w-3.5 h-3.5" />
                Prev
              </button>
              <button
                onClick={engine.next}
                disabled={isComplete}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
                  bg-primary text-primary-foreground text-sm font-medium
                  hover:opacity-90 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
              >
                Next
                <SkipForward className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={engine.reset}
                className="flex items-center justify-center gap-1.5 px-3 py-2.5 rounded-xl
                  bg-destructive/10 text-destructive text-sm font-medium
                  hover:bg-destructive/20 transition-all"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Reset
              </button>
            </div>
          )}
        </div>

        {/* Progress */}
        {isStarted && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Step {currentStep + 1} / {totalSteps}</span>
              <span className="capitalize font-medium text-foreground">{engine.state.phase}</span>
            </div>
            <div className="h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Phase indicator */}
        {isStarted && (
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Phases
            </label>
            <div className="flex flex-wrap gap-1.5">
              {['parsing', 'counting', 'building', 'generating', 'encoding', 'complete'].map(phase => (
                <span
                  key={phase}
                  className={`px-2 py-1 rounded-md text-[10px] font-medium uppercase tracking-wider transition-all
                    ${engine.state.phase === phase
                      ? 'bg-primary/20 text-primary ring-1 ring-primary/30'
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

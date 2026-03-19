import { useEffect, useRef } from 'react';
import { Navbar } from './Navbar';
import { Binary, GitBranch, Layers, Zap, ArrowDown, Database, Lock } from 'lucide-react';
import logoImg from '@/assets/logo.png';

interface LandingPageProps {
  onLaunch: () => void;
}

export function LandingPage({ onLaunch }: LandingPageProps) {
  const sectionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-12');
          }
        });
      },
      { threshold: 0.15 }
    );

    const els = sectionsRef.current?.querySelectorAll('.reveal');
    els?.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={sectionsRef} className="min-h-screen">
      <Navbar onSimulationClick={onLaunch} transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, hsl(var(--crimson-light)), transparent 70%)' }} />
        </div>

        <div className="relative z-10 space-y-8 max-w-3xl">
          <div className="animate-float">
            <img src={logoImg} alt="CipherStruct" className="h-24 mx-auto mb-4 drop-shadow-2xl" />
          </div>

          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight">
            <span className="gold-text">Cipher</span>
            <span className="text-foreground">Struct</span>
            <span className="block text-2xl md:text-3xl font-sans font-light text-muted-foreground mt-3">
              Interactive DSA Visualization Engine
            </span>
          </h1>

          <p className="text-lg text-muted-foreground max-w-xl mx-auto leading-relaxed">
            Watch algorithms come alive. Step through Huffman Coding as data structures
            transform before your eyes — one operation at a time.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={onLaunch}
              className="px-8 py-3.5 rounded-2xl text-base font-semibold gold-gradient text-primary-foreground
                hover:opacity-90 transition-all glow-gold"
            >
              Start Simulation
            </button>
            <a
              href="#features"
              className="px-8 py-3.5 rounded-2xl text-base font-medium border border-border/50
                text-foreground hover:bg-card/50 transition-all"
            >
              Learn More
            </a>
          </div>
        </div>

        <a href="#features" className="absolute bottom-10 z-10 animate-bounce text-muted-foreground">
          <ArrowDown className="w-5 h-5" />
        </a>
      </section>

      {/* Features */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-6xl mx-auto">
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 text-center mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              Dive into <span className="gold-text">Data Structures</span>
            </h2>
            <p className="text-muted-foreground max-w-lg mx-auto">
              Every algorithm step is decomposed, visualized, and explained.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: Layers, title: 'Array Processing', desc: 'Watch characters flow through the input array with real-time index tracking.' },
              { icon: Database, title: 'Hash Table Mapping', desc: 'See frequency tables build character by character with animated bar charts.' },
              { icon: GitBranch, title: 'Tree Construction', desc: 'Observe the Huffman tree grow as nodes merge step by step.' },
              { icon: Binary, title: 'Binary Encoding', desc: 'Follow the encoding process as each character maps to its binary code.' },
              { icon: Lock, title: 'Full Reversibility', desc: 'Step forward and backward through every atomic operation.' },
              { icon: Zap, title: 'Auto-Play Mode', desc: 'One click to watch the entire algorithm unfold automatically.' },
            ].map((f, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-12 transition-all duration-700 glass-panel p-6 space-y-3 hover:border-primary/30 group"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <div className="w-10 h-10 rounded-xl gold-gradient flex items-center justify-center
                  group-hover:glow-gold transition-all">
                  <f.icon className="w-5 h-5 text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-foreground">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-32 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 text-center mb-20">
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4">
              How It <span className="gold-text">Works</span>
            </h2>
          </div>

          <div className="space-y-8">
            {[
              { step: '01', title: 'Enter Your Text', desc: 'Type any message into the workbench to begin the compression journey.' },
              { step: '02', title: 'Click Simulate', desc: 'One click starts the full step-by-step Huffman algorithm execution.' },
              { step: '03', title: 'Watch & Learn', desc: 'Every data structure transforms in real-time with clear explanations.' },
              { step: '04', title: 'Get Results', desc: 'Receive the compressed binary with full code table and compression stats.' },
            ].map((item, i) => (
              <div
                key={i}
                className="reveal opacity-0 translate-y-12 transition-all duration-700 flex gap-6 items-start"
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                <span className="text-4xl font-display font-bold gold-text flex-shrink-0">{item.step}</span>
                <div className="glass-panel p-5 flex-1">
                  <h3 className="font-semibold text-foreground mb-1">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section id="about" className="py-32 px-6">
        <div className="reveal opacity-0 translate-y-12 transition-all duration-700 max-w-2xl mx-auto text-center space-y-6">
          <h2 className="font-display text-3xl md:text-4xl font-bold">
            Ready to <span className="gold-text">Explore</span>?
          </h2>
          <p className="text-muted-foreground">
            Dive into the simulation and see algorithms like never before.
          </p>
          <button
            onClick={onLaunch}
            className="px-10 py-4 rounded-2xl text-lg font-semibold gold-gradient text-primary-foreground
              hover:opacity-90 transition-all glow-gold"
          >
            Launch CipherStruct Studio
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border/30 py-8 px-6 text-center text-xs text-muted-foreground">
        <p>CipherStruct Studio — Interactive DSA Visualization Engine</p>
      </footer>
    </div>
  );
}

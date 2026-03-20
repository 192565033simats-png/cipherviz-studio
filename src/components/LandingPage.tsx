import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { Navbar } from './Navbar';
import { Binary, GitBranch, Layers, Zap, ArrowDown, Database, Lock } from 'lucide-react';

export function LandingPage() {
  const navigate = useNavigate();
  const sectionsRef = useRef<HTMLDivElement>(null);

  const onLaunch = () => navigate('/encrypt');

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
      <Navbar transparent />

      {/* Hero */}
      <section className="relative min-h-screen flex flex-col items-center justify-center text-center px-6 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, hsl(var(--gold)), transparent 70%)' }} />
          <div className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] rounded-full opacity-5"
            style={{ background: 'radial-gradient(circle, hsl(var(--crimson-light)), transparent 70%)' }} />
        </div>

        <div className="relative z-10 space-y-8 max-w-3xl">
          <div className="animate-float">
            <div className="w-24 h-24 mx-auto mb-4 rounded-2xl gold-gradient flex items-center justify-center glow-gold">
              <Lock className="w-12 h-12 text-primary-foreground" />
            </div>
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

      {/* About */}
      <section id="about" className="py-32 px-6">
        <div className="max-w-4xl mx-auto space-y-16">
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 text-center space-y-4">
            <h2 className="font-display text-3xl md:text-4xl font-bold">
              🧠 About <span className="gold-text">CipherStruct</span> Studio
            </h2>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              CipherStruct Studio is an interactive web application designed to visualize how data structures and algorithms work internally during data processing.
            </p>
            <p className="text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              Unlike traditional tools that only show final results, this platform focuses on <span className="text-primary font-medium">step-by-step simulation</span>, allowing users to observe how data transforms through structures like arrays, hash tables, and trees.
            </p>
          </div>

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 glass-panel p-8 space-y-5" style={{ transitionDelay: '100ms' }}>
            <h3 className="font-display text-xl font-bold">🎯 What This System Does</h3>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Demonstrates algorithm execution one step at a time</li>
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Visualizes how data moves through:</li>
            </ul>
            <div className="flex flex-wrap gap-3 pl-6">
              {[
                { emoji: '📦', label: 'Arrays' },
                { emoji: '🔑', label: 'Hash Tables' },
                { emoji: '🌲', label: 'Huffman Trees' },
              ].map((ds) => (
                <div key={ds.label} className="flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/50 border border-border/30 text-sm text-foreground">
                  <span>{ds.emoji}</span> {ds.label}
                </div>
              ))}
            </div>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Highlights active elements during processing</li>
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Provides clear explanations for every step</li>
            </ul>
          </div>

          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 glass-panel p-8 space-y-5" style={{ transitionDelay: '200ms' }}>
            <h3 className="font-display text-xl font-bold">🎬 Why It's Different</h3>
            <p className="text-muted-foreground">Instead of just showing output, CipherStruct Studio helps users:</p>
            <ul className="space-y-3 text-muted-foreground">
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> <strong className="text-foreground">See</strong> how algorithms work</li>
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> <strong className="text-foreground">Understand</strong> why each step happens</li>
              <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> <strong className="text-foreground">Interact</strong> with the process using controls</li>
            </ul>
            <div className="flex flex-wrap gap-2 pt-2">
              {['▶ Start', '⏭ Next', '⏮ Previous', '🔄 Reset'].map((ctrl) => (
                <span key={ctrl} className="px-3 py-1.5 rounded-lg bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                  {ctrl}
                </span>
              ))}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 glass-panel p-8 space-y-4" style={{ transitionDelay: '300ms' }}>
              <h3 className="font-display text-xl font-bold">🧠 Learning Focus</h3>
              <p className="text-muted-foreground">Built to make abstract concepts simple through visual, interactive experiences:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Data Structures</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Algorithm Design</li>
                <li className="flex items-start gap-3"><span className="text-primary mt-0.5">▸</span> Huffman Coding</li>
              </ul>
            </div>

            <div className="reveal opacity-0 translate-y-12 transition-all duration-700 glass-panel p-8 space-y-4" style={{ transitionDelay: '400ms' }}>
              <h3 className="font-display text-xl font-bold">🌟 Goal</h3>
              <p className="text-muted-foreground leading-relaxed">
                To transform complex algorithm logic into a clear, engaging, and easy-to-understand simulation — helping users <span className="text-primary font-medium">learn by seeing and interacting</span> rather than memorizing.
              </p>
            </div>
          </div>

          {/* CTA */}
          <div className="reveal opacity-0 translate-y-12 transition-all duration-700 text-center space-y-6 pt-8" style={{ transitionDelay: '500ms' }}>
            <h3 className="font-display text-2xl md:text-3xl font-bold">
              Ready to <span className="gold-text">Explore</span>?
            </h3>
            <div className="flex gap-4 justify-center">
              <button
                onClick={onLaunch}
                className="px-10 py-4 rounded-2xl text-lg font-semibold gold-gradient text-primary-foreground hover:opacity-90 transition-all glow-gold"
              >
                Encrypt
              </button>
              <button
                onClick={() => navigate('/decrypt')}
                className="px-10 py-4 rounded-2xl text-lg font-semibold border border-primary/30 text-primary hover:bg-primary/10 transition-all"
              >
                Decrypt
              </button>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border/30 py-8 px-6 text-center text-xs text-muted-foreground">
        <p>CipherStruct Studio — Interactive DSA Visualization Engine</p>
      </footer>
    </div>
  );
}

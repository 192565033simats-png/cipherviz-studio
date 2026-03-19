import logoImg from '@/assets/logo.png';

interface NavbarProps {
  onSimulationClick: () => void;
  transparent?: boolean;
}

export function Navbar({ onSimulationClick, transparent }: NavbarProps) {
  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'bg-background/80 backdrop-blur-xl border-b border-border/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logoImg} alt="CipherStruct" className="h-8 w-auto" />
          <span className="text-lg font-semibold tracking-tight gold-text">
            CipherStruct
          </span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm text-muted-foreground">
          <a href="#features" className="hover:text-foreground transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-foreground transition-colors">How It Works</a>
          <a href="#about" className="hover:text-foreground transition-colors">About</a>
        </div>

        <button
          onClick={onSimulationClick}
          className="px-5 py-2 rounded-xl text-sm font-medium gold-gradient text-primary-foreground
            hover:opacity-90 transition-all glow-gold"
        >
          Launch Studio
        </button>
      </div>
    </nav>
  );
}

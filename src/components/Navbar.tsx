import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Lock, Unlock, Info } from 'lucide-react';

interface NavbarProps {
  onSimulationClick?: () => void;
  transparent?: boolean;
}

export function Navbar({ onSimulationClick, transparent }: NavbarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const isHome = location.pathname === '/';

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        transparent
          ? 'bg-transparent'
          : 'bg-background/80 backdrop-blur-xl border-b border-border/30'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        <button
          onClick={() => onSimulationClick ? onSimulationClick() : navigate('/')}
          className="flex items-center gap-2.5 hover:opacity-80 transition-opacity"
        >
          <div className="w-8 h-8 rounded-lg gold-gradient flex items-center justify-center">
            <Lock className="w-4 h-4 text-primary-foreground" />
          </div>
          <span className="text-lg font-semibold tracking-tight gold-text">
            CipherStruct
          </span>
        </button>

        <div className="hidden md:flex items-center gap-1">
          <button
            onClick={() => navigate('/')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${isHome ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-card/60'}`}
          >
            <Home className="w-3.5 h-3.5" />
            Home
          </button>
          <button
            onClick={() => navigate('/encrypt')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${location.pathname === '/encrypt' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-card/60'}`}
          >
            <Lock className="w-3.5 h-3.5" />
            Encrypt
          </button>
          <button
            onClick={() => navigate('/decrypt')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all
              ${location.pathname === '/decrypt' ? 'text-primary bg-primary/10' : 'text-muted-foreground hover:text-foreground hover:bg-card/60'}`}
          >
            <Unlock className="w-3.5 h-3.5" />
            Decrypt
          </button>
          {isHome ? (
            <a
              href="#about"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              About
            </a>
          ) : (
            <button
              onClick={() => navigate('/#about')}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-card/60 transition-all"
            >
              <Info className="w-3.5 h-3.5" />
              About
            </button>
          )}
        </div>

        <button
          onClick={() => onSimulationClick ? onSimulationClick() : navigate('/encrypt')}
          className="px-5 py-2 rounded-xl text-sm font-medium gold-gradient text-primary-foreground
            hover:opacity-90 transition-all glow-gold"
        >
          Launch Studio
        </button>
      </div>
    </nav>
  );
}

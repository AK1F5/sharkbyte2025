import { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface MarketData {
  symbol: string;
  price: number;
  change_pct: number;
}

export function Header() {
  const [mobileNavActive, setMobileNavActive] = useState(false);
  const [marketData, setMarketData] = useState<MarketData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeSection, setActiveSection] = useState('hero');

  useEffect(() => {
    // Mock market data with realistic stock tickers
    const mockMarketData: MarketData[] = [
      { symbol: 'AMZN', price: 178.35, change_pct: 2.15 },
      { symbol: 'MSFT', price: 412.80, change_pct: 1.85 },
      { symbol: 'GOOGL', price: 142.50, change_pct: -0.45 },
      { symbol: 'AAPL', price: 189.95, change_pct: 0.92 },
      { symbol: 'NVDA', price: 495.20, change_pct: 3.45 },
      { symbol: 'META', price: 485.60, change_pct: -1.20 },
    ];
    
    setMarketData(mockMarketData);
  }, []);

  useEffect(() => {
    if (marketData.length > 0) {
      const rotateInterval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % marketData.length);
      }, 20000); // 20 seconds
      return () => clearInterval(rotateInterval);
    }
  }, [marketData.length]);

  useEffect(() => {
    const handleScroll = () => {
      const sections = ['hero', 'about', 'resume', 'Certifications', 'portfolio'];
      const scrollPosition = window.scrollY + 100;

      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const offsetTop = element.offsetTop;
          const offsetHeight = element.offsetHeight;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const currentTicker = marketData[currentIndex];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileNavActive(false);
  };

  return (
    <header id="header" className="header sticky top-0 z-[997]">
      <div className="container mx-auto px-4 xl:max-w-7xl flex items-center justify-between min-h-[70px] py-2">
        {/* Left: Logo and Market pill */}
        <div className="flex items-center gap-3 flex-shrink min-w-0">
          <a href="#hero" onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }} className="logo flex items-center flex-shrink-0">
            <h1 className="sitename m-0 whitespace-nowrap">KeenKloud</h1>
          </a>

          {/* Market pill - hidden on very small screens */}
          <div className="market-pill hidden sm:flex">
            <span className="dot" aria-hidden="true"></span>
            <span id="mk-sym">{currentTicker?.symbol || '—'}</span>
            <span id="mk-px">${currentTicker?.price ? Number(currentTicker.price).toFixed(2) : '—'}</span>
            <span id="mk-chg" className={`chg ${currentTicker ? (currentTicker.change_pct >= 0 ? 'up' : 'down') : ''}`}>
              {currentTicker ? `${currentTicker.change_pct >= 0 ? '+' : ''}${Number(currentTicker.change_pct).toFixed(2)}%` : '—%'}
            </span>
          </div>
        </div>

        {/* Right: Nav menu */}
        <nav id="navmenu" className="navmenu flex items-center flex-shrink-0">
          {/* Desktop Navigation */}
          <ul className="hidden xl:flex items-center gap-8 m-0 p-0 list-none">
            <li>
              <a 
                href="#hero" 
                className={`relative px-1 py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer group ${
                  activeSection === 'hero' ? 'text-blue-400' : ''
                }`}
                onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
              >
                Home
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
                  activeSection === 'hero' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={`relative px-1 py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer group ${
                  activeSection === 'about' ? 'text-blue-400' : ''
                }`}
                onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
              >
                About
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
                  activeSection === 'about' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            </li>
            <li>
              <a 
                href="#resume" 
                className={`relative px-1 py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer group ${
                  activeSection === 'resume' ? 'text-blue-400' : ''
                }`}
                onClick={(e) => { e.preventDefault(); scrollToSection('resume'); }}
              >
                Resume
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
                  activeSection === 'resume' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            </li>
            <li>
              <a 
                href="#Certifications" 
                className={`relative px-1 py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer group ${
                  activeSection === 'Certifications' ? 'text-blue-400' : ''
                }`}
                onClick={(e) => { e.preventDefault(); scrollToSection('Certifications'); }}
              >
                Certifications
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
                  activeSection === 'Certifications' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            </li>
            <li>
              <a 
                href="#portfolio" 
                className={`relative px-1 py-2 text-white hover:text-blue-400 transition-all duration-300 cursor-pointer group ${
                  activeSection === 'portfolio' ? 'text-blue-400' : ''
                }`}
                onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}
              >
                Portfolio
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-blue-400 to-blue-600 transform origin-left transition-transform duration-300 ${
                  activeSection === 'portfolio' ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                }`}></span>
              </a>
            </li>
          </ul>

          {/* Mobile Navigation Toggle */}
          <button 
            className="xl:hidden text-white p-2 hover:bg-white/10 rounded-lg transition-colors flex-shrink-0"
            onClick={() => setMobileNavActive(!mobileNavActive)}
            aria-label="Toggle navigation"
          >
            {mobileNavActive ? <X size={24} /> : <Menu size={24} />}
          </button>
        </nav>
      </div>

      {/* Mobile Navigation Menu - Side Drawer (moved outside main container) */}
      {mobileNavActive && (
        <>
          {/* Backdrop - lighter and less blurry */}
          <div 
            className="fixed inset-0 bg-black/30 z-[9998] xl:hidden"
            onClick={() => setMobileNavActive(false)}
          ></div>
          
          {/* Slide-in Menu - brighter with better contrast */}
          <div className="fixed top-0 right-0 h-full w-80 max-w-[85vw] bg-[#1a1a1a] border-l-2 border-blue-500/30 shadow-2xl z-[9999] xl:hidden transition-transform duration-300 ease-out">
            <div className="flex flex-col h-full p-6 bg-gradient-to-b from-gray-900 to-gray-950">
              {/* Close Button - more visible */}
              <div className="flex justify-end mb-8">
                <button 
                  className="text-white bg-gray-800 p-3 hover:bg-blue-600 rounded-lg transition-all duration-200 shadow-lg"
                  onClick={() => setMobileNavActive(false)}
                  aria-label="Close navigation"
                >
                  <X size={24} />
                </button>
              </div>
              
              {/* Menu Items - larger and more visible */}
              <nav className="flex flex-col gap-4">
                <a 
                  href="#hero" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === 'hero' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={(e) => { e.preventDefault(); scrollToSection('hero'); }}
                >
                  Home
                </a>
                <a 
                  href="#about" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === 'about' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={(e) => { e.preventDefault(); scrollToSection('about'); }}
                >
                  About
                </a>
                <a 
                  href="#resume" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === 'resume' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={(e) => { e.preventDefault(); scrollToSection('resume'); }}
                >
                  Resume
                </a>
                <a 
                  href="#Certifications" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === 'Certifications' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={(e) => { e.preventDefault(); scrollToSection('Certifications'); }}
                >
                  Certifications
                </a>
                <a 
                  href="#portfolio" 
                  className={`px-4 py-3 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeSection === 'portfolio' 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-800 hover:text-white'
                  }`}
                  onClick={(e) => { e.preventDefault(); scrollToSection('portfolio'); }}
                >
                  Portfolio
                </a>
              </nav>
            </div>
          </div>
        </>
      )}
    </header>
  );
}

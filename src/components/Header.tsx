import { useState, useEffect } from "react";
import { Truck, Phone, Menu, X } from "lucide-react";
import { Button } from "./ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { href: "#servicos", label: "Serviços" },
    { href: "#como-funciona", label: "Como Funciona" },
    { href: "#rastreio", label: "Rastreio" },
    { href: "#contato", label: "Contato" },
  ];

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? "bg-card/95 backdrop-blur-xl shadow-lg border-b border-border/50" 
          : "bg-transparent"
      }`}
    >
      <div className="container mx-auto px-4 sm:px-6">
        <div className="h-18 md:h-20 flex items-center justify-between">
          {/* Logo */}
          <a href="#" className="flex items-center gap-3 group">
            <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-300 ${
              isScrolled ? "bg-primary shadow-md" : "bg-primary-foreground/20 backdrop-blur-sm"
            }`}>
              <Truck className={`w-6 h-6 transition-colors ${
                isScrolled ? "text-primary-foreground" : "text-primary-foreground"
              }`} />
            </div>
            <span className={`text-xl font-extrabold tracking-tight transition-colors ${
              isScrolled ? "text-foreground" : "text-primary-foreground"
            }`}>
              BRC<span className="text-accent">LOG</span>
            </span>
          </a>
          
          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  isScrolled 
                    ? "text-muted-foreground hover:text-primary hover:bg-primary/5" 
                    : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3">
            <Button 
              variant={isScrolled ? "outline" : "ghost"} 
              size="sm"
              className={`gap-2 ${!isScrolled && "text-primary-foreground border-primary-foreground/30 hover:bg-primary-foreground/10"}`}
            >
              <Phone className="w-4 h-4" />
              <span className="hidden sm:inline">(11) 99999-9999</span>
            </Button>
            <Button size="sm" className="gap-2 btn-glow">
              Solicitar Coleta
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className={`lg:hidden p-2 rounded-lg transition-colors ${
              isScrolled 
                ? "text-foreground hover:bg-muted" 
                : "text-primary-foreground hover:bg-primary-foreground/10"
            }`}
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`lg:hidden overflow-hidden transition-all duration-300 ${
          isMobileMenuOpen ? "max-h-80 pb-4" : "max-h-0"
        }`}>
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                onClick={() => setIsMobileMenuOpen(false)}
                className={`px-4 py-3 rounded-lg font-medium transition-all ${
                  isScrolled 
                    ? "text-foreground hover:bg-muted" 
                    : "text-primary-foreground hover:bg-primary-foreground/10"
                }`}
              >
                {link.label}
              </a>
            ))}
            <div className="flex flex-col gap-2 mt-3 pt-3 border-t border-border/30">
              <Button variant="outline" className="justify-center gap-2">
                <Phone className="w-4 h-4" />
                (11) 99999-9999
              </Button>
              <Button className="justify-center">Solicitar Coleta</Button>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;
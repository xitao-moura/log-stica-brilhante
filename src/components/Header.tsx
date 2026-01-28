import { Package, Truck, MapPin, Clock, Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <Truck className="w-6 h-6 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold text-foreground">
            BRC<span className="text-primary">LOG</span>
          </span>
        </div>
        
        <nav className="hidden md:flex items-center gap-8">
          <a href="#servicos" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Serviços
          </a>
          <a href="#como-funciona" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Como Funciona
          </a>
          <a href="#rastreio" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Rastreio
          </a>
          <a href="#contato" className="text-muted-foreground hover:text-primary transition-colors font-medium">
            Contato
          </a>
        </nav>

        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" className="hidden sm:flex">
            <Phone className="w-4 h-4" />
            Ligar
          </Button>
          <Button size="sm">Solicitar Coleta</Button>
        </div>
      </div>
    </header>
  );
};

export default Header;

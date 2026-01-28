import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Linkedin } from "lucide-react";

const Footer = () => {
  return (
    <footer id="contato" className="bg-foreground text-background py-16">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
                <Truck className="w-6 h-6 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">
                BRC<span className="text-primary">LOG</span>
              </span>
            </div>
            <p className="text-background/70">
              Soluções logísticas completas para sua empresa. Coleta e entrega com qualidade e agilidade.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-background/10 flex items-center justify-center hover:bg-primary transition-colors">
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="font-bold text-lg mb-4">Links Rápidos</h4>
            <ul className="space-y-3">
              <li><a href="#servicos" className="text-background/70 hover:text-primary transition-colors">Serviços</a></li>
              <li><a href="#como-funciona" className="text-background/70 hover:text-primary transition-colors">Como Funciona</a></li>
              <li><a href="#rastreio" className="text-background/70 hover:text-primary transition-colors">Rastreio</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Sobre Nós</a></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="font-bold text-lg mb-4">Serviços</h4>
            <ul className="space-y-3">
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Coleta Expressa</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Entrega Rápida</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Logística Reversa</a></li>
              <li><a href="#" className="text-background/70 hover:text-primary transition-colors">Corporativo</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-background/70">
                <Phone className="w-5 h-5 text-primary" />
                (11) 99999-9999
              </li>
              <li className="flex items-center gap-3 text-background/70">
                <Mail className="w-5 h-5 text-primary" />
                contato@brclog.com.br
              </li>
              <li className="flex items-start gap-3 text-background/70">
                <MapPin className="w-5 h-5 text-primary mt-0.5" />
                <span>Av. Paulista, 1000<br />São Paulo - SP</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 text-center text-background/50">
          <p>&copy; {new Date().getFullYear()} BRCLog. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

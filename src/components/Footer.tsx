import { Truck, Phone, Mail, MapPin, Facebook, Instagram, Linkedin, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const Footer = () => {
  return (
    <footer id="contato" className="relative overflow-hidden">
      {/* CTA Section */}
      <div className="bg-gradient-to-r from-primary via-primary to-primary-foreground/90 py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-foreground mb-5">
              Pronto para começar?
            </h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Solicite sua primeira coleta agora e descubra a eficiência da BRCLog. 
              Cadastro rápido e sem burocracia.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="xl" className="bg-accent text-accent-foreground hover:bg-accent/90 btn-glow-accent">
                Solicitar Coleta Grátis
                <ArrowRight className="w-5 h-5" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Falar com Consultor
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-foreground text-background py-16 lg:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
            {/* Brand */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shadow-lg">
                  <Truck className="w-7 h-7 text-primary-foreground" />
                </div>
                <span className="text-2xl font-extrabold">
                  BRC<span className="text-accent">LOG</span>
                </span>
              </div>
              <p className="text-background/70 mb-6 leading-relaxed">
                Soluções logísticas completas para sua empresa. 
                Coleta e entrega com qualidade, agilidade e tecnologia.
              </p>
              <div className="flex gap-3">
                {[Facebook, Instagram, Linkedin].map((Icon, i) => (
                  <a 
                    key={i}
                    href="#" 
                    className="w-10 h-10 rounded-xl bg-background/10 flex items-center justify-center hover:bg-primary hover:scale-110 transition-all duration-200"
                  >
                    <Icon className="w-5 h-5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-background">Links Rápidos</h4>
              <ul className="space-y-4">
                {["Serviços", "Como Funciona", "Rastreio", "Sobre Nós", "Trabalhe Conosco"].map((link) => (
                  <li key={link}>
                    <a 
                      href={`#${link.toLowerCase().replace(" ", "-")}`} 
                      className="text-background/70 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-background">Serviços</h4>
              <ul className="space-y-4">
                {["Coleta Expressa", "Entrega Rápida", "Logística Reversa", "Corporativo", "E-commerce"].map((service) => (
                  <li key={service}>
                    <a 
                      href="#" 
                      className="text-background/70 hover:text-accent transition-colors flex items-center gap-2 group"
                    >
                      <ArrowRight className="w-4 h-4 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
                      {service}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold text-lg mb-6 text-background">Contato</h4>
              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Phone className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-background/50 text-sm">Telefone</p>
                    <p className="text-background font-medium">(11) 99999-9999</p>
                  </div>
                </li>
                <li className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Mail className="w-5 h-5 text-secondary" />
                  </div>
                  <div>
                    <p className="text-background/50 text-sm">E-mail</p>
                    <p className="text-background font-medium">contato@brclog.com.br</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-accent" />
                  </div>
                  <div>
                    <p className="text-background/50 text-sm">Endereço</p>
                    <p className="text-background font-medium">Av. Paulista, 1000<br />São Paulo - SP</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* Newsletter */}
          <div className="mt-16 pt-10 border-t border-background/10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
              <div>
                <h4 className="font-bold text-lg text-background mb-2">Receba nossas novidades</h4>
                <p className="text-background/60">Fique por dentro das últimas atualizações e promoções.</p>
              </div>
              <div className="flex gap-3 w-full lg:w-auto">
                <Input 
                  type="email" 
                  placeholder="Seu e-mail" 
                  className="bg-background/10 border-background/20 text-background placeholder:text-background/40 h-12 min-w-[250px]"
                />
                <Button className="h-12 px-6">Inscrever</Button>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-background/50 text-sm">
            <p>&copy; {new Date().getFullYear()} BRCLog. Todos os direitos reservados.</p>
            <div className="flex gap-6">
              <a href="#" className="hover:text-accent transition-colors">Termos de Uso</a>
              <a href="#" className="hover:text-accent transition-colors">Privacidade</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
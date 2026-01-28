import { Truck, Package, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center pt-16 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 right-10 w-72 h-72 bg-accent/20 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-20 left-10 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-6 animate-slide-up">
            <div className="inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <span className="w-2 h-2 bg-secondary rounded-full animate-pulse-soft" />
              Entrega rápida em todo Brasil
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
              Coleta e Entrega{" "}
              <span className="text-accent">Inteligente</span>{" "}
              para seu Negócio
            </h1>
            
            <p className="text-lg md:text-xl text-primary-foreground/80 max-w-xl">
              Soluções logísticas completas com rastreamento em tempo real. 
              Sua encomenda segura do ponto A ao ponto B.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Button variant="hero" size="xl">
                <Package className="w-5 h-5" />
                Solicitar Coleta
              </Button>
              <Button variant="heroOutline" size="xl">
                Rastrear Encomenda
                <ArrowRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 pt-8 border-t border-primary-foreground/20">
              <div>
                <div className="text-3xl font-bold text-accent">10K+</div>
                <div className="text-sm text-primary-foreground/70">Entregas/mês</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">98%</div>
                <div className="text-sm text-primary-foreground/70">Satisfação</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-accent">24h</div>
                <div className="text-sm text-primary-foreground/70">Suporte</div>
              </div>
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex justify-center items-center animate-fade-in">
            <div className="relative">
              <div className="w-80 h-80 bg-primary-foreground/10 rounded-full flex items-center justify-center backdrop-blur-sm">
                <div className="w-60 h-60 bg-primary-foreground/15 rounded-full flex items-center justify-center">
                  <div className="w-40 h-40 bg-accent rounded-full flex items-center justify-center shadow-2xl animate-float">
                    <Truck className="w-20 h-20 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute top-0 right-0 bg-card rounded-xl p-3 shadow-xl animate-float" style={{ animationDelay: '1s' }}>
                <Package className="w-8 h-8 text-primary" />
              </div>
              <div className="absolute bottom-10 left-0 bg-card rounded-xl p-3 shadow-xl animate-float" style={{ animationDelay: '3s' }}>
                <MapPin className="w-8 h-8 text-secondary" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;

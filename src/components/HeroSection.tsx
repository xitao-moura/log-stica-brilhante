import { Truck, Package, ArrowRight, MapPin, Shield, Clock } from "lucide-react";
import { Button } from "./ui/button";

const HeroSection = () => {
  return (
    <section className="hero-gradient min-h-screen flex items-center pt-20 relative overflow-hidden">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-32 right-[10%] w-[500px] h-[500px] bg-accent/15 rounded-full blur-[100px] animate-float-slow" />
        <div className="absolute bottom-20 left-[5%] w-[600px] h-[600px] bg-secondary/12 rounded-full blur-[120px] animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary-foreground/5 rounded-full blur-[150px]" />
        
        {/* Grid pattern overlay */}
        <div className="absolute inset-0 pattern-grid opacity-30" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div className="text-primary-foreground space-y-8">
            {/* Badge */}
            <div className="animate-slide-down inline-flex items-center gap-2 bg-primary-foreground/10 backdrop-blur-md rounded-full px-5 py-2.5 border border-primary-foreground/20">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-secondary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-secondary"></span>
              </span>
              <span className="text-sm font-medium">Entrega rápida em todo Brasil</span>
            </div>
            
            {/* Headline */}
            <div className="space-y-4 animate-slide-up">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.1] tracking-tight">
                Logística{" "}
                <span className="relative inline-block">
                  <span className="text-accent">Inteligente</span>
                  <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none">
                    <path d="M2 10C50 4 150 4 198 10" stroke="hsl(var(--accent))" strokeWidth="3" strokeLinecap="round" opacity="0.5"/>
                  </svg>
                </span>{" "}
                <br className="hidden sm:block" />
                para seu Negócio
              </h1>
              
              <p className="text-lg sm:text-xl text-primary-foreground/80 max-w-xl leading-relaxed">
                Soluções completas de coleta e entrega com rastreamento em tempo real. 
                Sua encomenda segura, do início ao fim.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 animate-slide-up-delayed">
              <Button variant="hero" size="xl" className="group">
                <Package className="w-5 h-5" />
                Solicitar Coleta
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button variant="heroOutline" size="xl">
                Rastrear Encomenda
              </Button>
            </div>

            {/* Trust indicators */}
            <div className="flex flex-wrap items-center gap-6 pt-4 animate-fade-in-delayed">
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Shield className="w-5 h-5 text-secondary" />
                <span className="text-sm">Seguro incluso</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <Clock className="w-5 h-5 text-accent" />
                <span className="text-sm">Suporte 24h</span>
              </div>
              <div className="flex items-center gap-2 text-primary-foreground/70">
                <MapPin className="w-5 h-5 text-secondary" />
                <span className="text-sm">Todo Brasil</span>
              </div>
            </div>

            {/* Stats */}
            <div className="flex flex-wrap gap-8 sm:gap-12 pt-8 border-t border-primary-foreground/15">
              {[
                { value: "10K+", label: "Entregas/mês" },
                { value: "98%", label: "Satisfação" },
                { value: "500+", label: "Cidades" },
              ].map((stat, i) => (
                <div key={i} className="animate-bounce-in" style={{ animationDelay: `${0.4 + i * 0.1}s` }}>
                  <div className="text-3xl sm:text-4xl font-extrabold text-accent">{stat.value}</div>
                  <div className="text-sm text-primary-foreground/60">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Illustration */}
          <div className="hidden lg:flex justify-center items-center">
            <div className="relative animate-fade-in">
              {/* Main circle */}
              <div className="w-[400px] h-[400px] xl:w-[480px] xl:h-[480px] rounded-full bg-gradient-to-br from-primary-foreground/10 to-transparent backdrop-blur-sm flex items-center justify-center border border-primary-foreground/10">
                <div className="w-[300px] h-[300px] xl:w-[360px] xl:h-[360px] rounded-full bg-gradient-to-br from-primary-foreground/15 to-transparent flex items-center justify-center">
                  <div className="w-[180px] h-[180px] xl:w-[220px] xl:h-[220px] accent-gradient rounded-full flex items-center justify-center shadow-2xl animate-float btn-glow-accent">
                    <Truck className="w-24 h-24 xl:w-28 xl:h-28 text-accent-foreground" />
                  </div>
                </div>
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 right-8 glass-card-strong rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '0.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center">
                    <Package className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Pacote</div>
                    <div className="text-sm font-semibold text-foreground">Em trânsito</div>
                  </div>
                </div>
              </div>
              
              <div className="absolute bottom-12 -left-4 glass-card-strong rounded-2xl p-4 shadow-xl animate-float" style={{ animationDelay: '1.5s' }}>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-secondary flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Destino</div>
                    <div className="text-sm font-semibold text-foreground">São Paulo, SP</div>
                  </div>
                </div>
              </div>

              <div className="absolute top-1/2 -right-8 glass-card-strong rounded-2xl p-3 shadow-xl animate-float-fast" style={{ animationDelay: '2.5s' }}>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
                    <Clock className="w-4 h-4 text-accent-foreground" />
                  </div>
                  <div className="text-sm font-bold text-foreground">2h restantes</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full">
          <path 
            d="M0 120L60 110C120 100 240 80 360 70C480 60 600 60 720 65C840 70 960 80 1080 85C1200 90 1320 90 1380 90L1440 90V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" 
            fill="hsl(var(--background))"
          />
        </svg>
      </div>
    </section>
  );
};

export default HeroSection;
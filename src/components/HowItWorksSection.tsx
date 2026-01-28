import { ClipboardList, Package, Truck, CheckCircle2 } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Solicite a Coleta",
    description: "Faça seu pedido online ou pelo app informando os detalhes da encomenda.",
    color: "primary",
  },
  {
    icon: Package,
    number: "02",
    title: "Preparamos Tudo",
    description: "Nossa equipe organiza a rota e agenda o melhor horário para coleta.",
    color: "secondary",
  },
  {
    icon: Truck,
    number: "03",
    title: "Coletamos e Entregamos",
    description: "Buscamos sua encomenda e levamos até o destino com total segurança.",
    color: "accent",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Confirmação",
    description: "Você recebe a confirmação de entrega em tempo real no seu celular.",
    color: "primary",
  },
];

const colorMap = {
  primary: {
    bg: "bg-primary",
    text: "text-primary",
    light: "bg-primary/10",
    border: "border-primary/20",
    number: "text-primary/15",
    line: "bg-primary",
  },
  secondary: {
    bg: "bg-secondary",
    text: "text-secondary",
    light: "bg-secondary/10",
    border: "border-secondary/20",
    number: "text-secondary/15",
    line: "bg-secondary",
  },
  accent: {
    bg: "bg-accent",
    text: "text-accent-foreground",
    light: "bg-accent/20",
    border: "border-accent/30",
    number: "text-accent/30",
    line: "bg-accent",
  },
};

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="section-padding bg-muted relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 pattern-dots opacity-40" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 bg-secondary/10 text-secondary px-5 py-2 rounded-full text-sm font-semibold mb-6">
            <Truck className="w-4 h-4" />
            Processo Simples
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
            Como <span className="text-secondary">Funciona</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Em apenas 4 passos simples, sua encomenda estará a caminho do destino 
            com toda segurança e rastreamento.
          </p>
        </div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line - desktop */}
          <div className="hidden lg:block absolute top-24 left-[12.5%] right-[12.5%] h-0.5 bg-gradient-to-r from-primary via-secondary to-accent opacity-20" />

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6">
            {steps.map((step, index) => {
              const colors = colorMap[step.color as keyof typeof colorMap];
              return (
                <div key={index} className="relative group">
                  {/* Card */}
                  <div className="bg-card rounded-2xl p-6 lg:p-7 shadow-md border border-border h-full card-hover text-center lg:text-left">
                    {/* Step number background */}
                    <div className={`absolute top-4 right-4 text-6xl font-extrabold ${colors.number} select-none`}>
                      {step.number}
                    </div>
                    
                    {/* Icon */}
                    <div className={`relative w-14 h-14 rounded-2xl ${colors.bg} flex items-center justify-center mb-5 mx-auto lg:mx-0 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                      <step.icon className="w-7 h-7 text-primary-foreground" />
                      
                      {/* Pulse ring */}
                      <div className={`absolute inset-0 rounded-2xl ${colors.bg} animate-ping opacity-20`} />
                    </div>
                    
                    {/* Content */}
                    <h3 className="text-lg font-bold text-foreground mb-2 relative">
                      {step.title}
                    </h3>
                    <p className="text-muted-foreground text-sm leading-relaxed relative">
                      {step.description}
                    </p>
                  </div>
                  
                  {/* Arrow connector - desktop */}
                  {index < steps.length - 1 && (
                    <div className="hidden lg:flex absolute top-[90px] -right-3 z-10">
                      <div className={`w-6 h-6 rounded-full ${colors.bg} flex items-center justify-center shadow-md`}>
                        <svg className="w-3 h-3 text-primary-foreground" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
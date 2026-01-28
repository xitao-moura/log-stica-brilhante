import { ClipboardList, Package, Truck, CheckCircle2, ArrowRight } from "lucide-react";

const steps = [
  {
    icon: ClipboardList,
    number: "01",
    title: "Solicite a Coleta",
    description: "Faça seu pedido online ou pelo app informando os detalhes da encomenda.",
  },
  {
    icon: Package,
    number: "02",
    title: "Preparamos Tudo",
    description: "Nossa equipe organiza a rota e agenda o melhor horário para coleta.",
  },
  {
    icon: Truck,
    number: "03",
    title: "Coletamos e Entregamos",
    description: "Buscamos sua encomenda e levamos até o destino com segurança.",
  },
  {
    icon: CheckCircle2,
    number: "04",
    title: "Confirmação",
    description: "Você recebe a confirmação de entrega em tempo real no seu celular.",
  },
];

const HowItWorksSection = () => {
  return (
    <section id="como-funciona" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-secondary/10 text-secondary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Processo Simples
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Como <span className="text-secondary">Funciona</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Em apenas 4 passos simples, sua encomenda estará a caminho do destino.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              <div className="bg-card rounded-2xl p-6 shadow-md border border-border h-full">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                    <step.icon className="w-6 h-6 text-primary-foreground" />
                  </div>
                  <span className="text-4xl font-bold text-primary/20">{step.number}</span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
              
              {/* Arrow connector */}
              {index < steps.length - 1 && (
                <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                  <ArrowRight className="w-6 h-6 text-primary/40" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;

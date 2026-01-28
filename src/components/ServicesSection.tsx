import { Package, Truck, Clock, Shield, MapPin, Headphones } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Coleta Expressa",
    description: "Coletamos sua encomenda no endereço desejado com agilidade e segurança.",
    color: "primary" as const,
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Entregas em tempo recorde para todo o Brasil com rastreamento em tempo real.",
    color: "secondary" as const,
  },
  {
    icon: Clock,
    title: "Agendamento Flexível",
    description: "Escolha o melhor horário para coleta e entrega conforme sua disponibilidade.",
    color: "accent" as const,
  },
  {
    icon: Shield,
    title: "Seguro Incluso",
    description: "Todas as encomendas são protegidas com seguro durante todo o trajeto.",
    color: "primary" as const,
  },
  {
    icon: MapPin,
    title: "Rastreamento GPS",
    description: "Acompanhe sua encomenda em tempo real pelo app ou site.",
    color: "secondary" as const,
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Equipe de atendimento disponível 24 horas para ajudar você.",
    color: "accent" as const,
  },
];

const colorClasses = {
  primary: "bg-primary text-primary-foreground",
  secondary: "bg-secondary text-secondary-foreground",
  accent: "bg-accent text-accent-foreground",
};

const ServicesSection = () => {
  return (
    <section id="servicos" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="inline-block bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-semibold mb-4">
            Nossos Serviços
          </span>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Soluções Completas em <span className="text-primary">Logística</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Oferecemos uma gama completa de serviços para atender todas as suas necessidades de coleta e entrega.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-300 border border-border hover:border-primary/30 hover:-translate-y-1"
            >
              <div className={`w-14 h-14 rounded-xl ${colorClasses[service.color]} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <service.icon className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">
                {service.title}
              </h3>
              <p className="text-muted-foreground">
                {service.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;

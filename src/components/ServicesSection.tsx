import { Package, Truck, Clock, Shield, MapPin, Headphones } from "lucide-react";

const services = [
  {
    icon: Package,
    title: "Coleta Expressa",
    description: "Coletamos sua encomenda no endereço desejado com agilidade e máxima segurança.",
    gradient: "from-primary to-primary-foreground/80",
    bgColor: "bg-primary",
  },
  {
    icon: Truck,
    title: "Entrega Rápida",
    description: "Entregas em tempo recorde para todo o Brasil com rastreamento em tempo real.",
    gradient: "from-secondary to-secondary-foreground/80",
    bgColor: "bg-secondary",
  },
  {
    icon: Clock,
    title: "Agendamento Flexível",
    description: "Escolha o melhor horário para coleta e entrega conforme sua disponibilidade.",
    gradient: "from-accent to-accent/80",
    bgColor: "bg-accent",
    iconColor: "text-accent-foreground",
  },
  {
    icon: Shield,
    title: "Seguro Incluso",
    description: "Todas as encomendas são protegidas com seguro completo durante todo o trajeto.",
    gradient: "from-primary to-primary-foreground/80",
    bgColor: "bg-primary",
  },
  {
    icon: MapPin,
    title: "Rastreamento GPS",
    description: "Acompanhe sua encomenda em tempo real pelo app ou site, a qualquer momento.",
    gradient: "from-secondary to-secondary-foreground/80",
    bgColor: "bg-secondary",
  },
  {
    icon: Headphones,
    title: "Suporte 24h",
    description: "Equipe de atendimento disponível 24 horas por dia para ajudar você.",
    gradient: "from-accent to-accent/80",
    bgColor: "bg-accent",
    iconColor: "text-accent-foreground",
  },
];

const ServicesSection = () => {
  return (
    <section id="servicos" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 mesh-background opacity-50" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-16 lg:mb-20">
          <span className="inline-flex items-center gap-2 bg-primary/10 text-primary px-5 py-2 rounded-full text-sm font-semibold mb-6">
            <Package className="w-4 h-4" />
            Nossos Serviços
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
            Soluções Completas em{" "}
            <span className="text-gradient">Logística</span>
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
            Oferecemos uma gama completa de serviços para atender todas as suas 
            necessidades de coleta e entrega com excelência.
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-card rounded-2xl p-7 shadow-md border border-border card-hover"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Icon */}
              <div className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                <service.icon className={`w-7 h-7 ${service.iconColor || 'text-primary-foreground'}`} />
              </div>
              
              {/* Content */}
              <h3 className="text-xl font-bold text-foreground mb-3 group-hover:text-primary transition-colors">
                {service.title}
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {service.description}
              </p>

              {/* Hover accent line */}
              <div className="mt-5 h-1 w-0 group-hover:w-16 bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-300" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ServicesSection;
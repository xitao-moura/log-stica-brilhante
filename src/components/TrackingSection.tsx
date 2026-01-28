import { useState } from "react";
import { Search, Package, MapPin, Clock, CheckCircle2, Truck, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";

const TrackingSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleTrack = () => {
    if (trackingCode.trim()) {
      setShowDemo(true);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleTrack();
    }
  };

  const demoSteps = [
    { status: "Pedido Recebido", time: "10:30", date: "24/01", completed: true, icon: Package },
    { status: "Coletado", time: "14:15", date: "24/01", completed: true, icon: Package },
    { status: "Em Trânsito", time: "08:00", date: "25/01", completed: true, icon: Truck },
    { status: "Saiu para Entrega", time: "09:30", date: "25/01", completed: false, icon: MapPin },
    { status: "Entregue", time: "--:--", date: "--/--", completed: false, icon: CheckCircle2 },
  ];

  return (
    <section id="rastreio" className="section-padding bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-20 right-0 w-[500px] h-[500px] bg-accent/5 rounded-full blur-[120px]" />
      <div className="absolute bottom-20 left-0 w-[400px] h-[400px] bg-primary/5 rounded-full blur-[100px]" />
      
      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12 lg:mb-16">
            <span className="inline-flex items-center gap-2 bg-accent text-accent-foreground px-5 py-2 rounded-full text-sm font-semibold mb-6 shadow-md">
              <MapPin className="w-4 h-4" />
              Rastreamento
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-foreground mb-5">
              Rastreie sua <span className="text-primary">Encomenda</span>
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Insira o código de rastreio para acompanhar sua entrega em tempo real, 
              a qualquer momento.
            </p>
          </div>

          {/* Tracking Card */}
          <div className="bg-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl border border-border">
            {/* Input */}
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Digite o código de rastreio (ex: BRC123456789)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="pl-12 h-14 text-base rounded-xl border-2 border-border focus:border-primary transition-colors"
                />
              </div>
              <Button 
                size="lg" 
                onClick={handleTrack} 
                className="h-14 px-8 rounded-xl font-semibold gap-2 btn-glow"
              >
                <MapPin className="w-5 h-5" />
                Rastrear
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            {/* Demo Result */}
            {showDemo && (
              <div className="mt-10 pt-10 border-t border-border animate-slide-up">
                {/* Status Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">Código de Rastreio</p>
                    <p className="text-xl font-bold text-foreground">{trackingCode.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-4 py-2 rounded-full">
                    <div className="relative">
                      <Truck className="w-5 h-5" />
                      <span className="absolute -top-1 -right-1 w-2 h-2 bg-secondary rounded-full animate-pulse" />
                    </div>
                    <span className="font-semibold">Em Trânsito</span>
                  </div>
                </div>

                {/* Timeline */}
                <div className="space-y-0">
                  {demoSteps.map((step, index) => (
                    <div key={index} className="flex gap-4">
                      {/* Timeline column */}
                      <div className="flex flex-col items-center">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${
                          step.completed 
                            ? 'bg-secondary text-secondary-foreground shadow-md' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          <step.icon className="w-5 h-5" />
                        </div>
                        {index < demoSteps.length - 1 && (
                          <div className={`w-0.5 h-12 ${
                            step.completed ? 'bg-secondary' : 'bg-border'
                          }`} />
                        )}
                      </div>
                      
                      {/* Content column */}
                      <div className="flex-1 pb-8">
                        <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 ${
                          step.completed ? '' : 'opacity-50'
                        }`}>
                          <p className={`font-semibold ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                            {step.status}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {step.date} às {step.time}
                          </p>
                        </div>
                        {index === 2 && step.completed && (
                          <p className="text-sm text-muted-foreground mt-1">
                            Pacote em trânsito para São Paulo, SP
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Info cards */}
                <div className="grid sm:grid-cols-3 gap-4 mt-8 pt-8 border-t border-border">
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Clock className="w-5 h-5 text-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Previsão</p>
                    <p className="font-bold text-foreground">Hoje, 18:00</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <MapPin className="w-5 h-5 text-secondary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Destino</p>
                    <p className="font-bold text-foreground">São Paulo, SP</p>
                  </div>
                  <div className="bg-muted/50 rounded-xl p-4 text-center">
                    <Truck className="w-5 h-5 text-accent mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Transportadora</p>
                    <p className="font-bold text-foreground">BRCLog Express</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrackingSection;
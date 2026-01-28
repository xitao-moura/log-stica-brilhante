import { useState } from "react";
import { Search, Package, MapPin, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const TrackingSection = () => {
  const [trackingCode, setTrackingCode] = useState("");
  const [showDemo, setShowDemo] = useState(false);

  const handleTrack = () => {
    if (trackingCode.trim()) {
      setShowDemo(true);
    }
  };

  const demoSteps = [
    { status: "Pedido Recebido", time: "10:30", date: "24/01", completed: true },
    { status: "Coletado", time: "14:15", date: "24/01", completed: true },
    { status: "Em Trânsito", time: "08:00", date: "25/01", completed: true },
    { status: "Saiu para Entrega", time: "09:30", date: "25/01", completed: false },
    { status: "Entregue", time: "--:--", date: "--/--", completed: false },
  ];

  return (
    <section id="rastreio" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <span className="inline-block bg-accent/20 text-accent-foreground px-4 py-2 rounded-full text-sm font-semibold mb-4 bg-accent">
              Rastreamento
            </span>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Rastreie sua <span className="text-primary">Encomenda</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Insira o código de rastreio para acompanhar sua entrega em tempo real.
            </p>
          </div>

          {/* Tracking Input */}
          <div className="bg-card rounded-2xl p-6 md:p-8 shadow-lg border border-border">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Digite o código de rastreio (ex: BRC123456789)"
                  value={trackingCode}
                  onChange={(e) => setTrackingCode(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl"
                />
              </div>
              <Button size="lg" onClick={handleTrack} className="h-14 px-8">
                <MapPin className="w-5 h-5" />
                Rastrear
              </Button>
            </div>

            {/* Demo Tracking Result */}
            {showDemo && (
              <div className="mt-8 pt-8 border-t border-border animate-slide-up">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <p className="text-sm text-muted-foreground">Código de Rastreio</p>
                    <p className="text-lg font-bold text-foreground">{trackingCode.toUpperCase()}</p>
                  </div>
                  <div className="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1 rounded-full">
                    <Clock className="w-4 h-4" />
                    <span className="text-sm font-medium">Em Trânsito</span>
                  </div>
                </div>

                <div className="space-y-4">
                  {demoSteps.map((step, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex flex-col items-center">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                          step.completed 
                            ? 'bg-secondary text-secondary-foreground' 
                            : 'bg-muted text-muted-foreground'
                        }`}>
                          {step.completed ? (
                            <CheckCircle2 className="w-5 h-5" />
                          ) : (
                            <Package className="w-4 h-4" />
                          )}
                        </div>
                        {index < demoSteps.length - 1 && (
                          <div className={`w-0.5 h-8 ${
                            step.completed ? 'bg-secondary' : 'bg-muted'
                          }`} />
                        )}
                      </div>
                      <div className="flex-1 pb-4">
                        <p className={`font-medium ${step.completed ? 'text-foreground' : 'text-muted-foreground'}`}>
                          {step.status}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {step.date} às {step.time}
                        </p>
                      </div>
                    </div>
                  ))}
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

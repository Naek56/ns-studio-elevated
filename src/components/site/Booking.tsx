import { useEffect, useState } from "react";
import { z } from "zod";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon, Check, Clock, Loader2, Mail, Phone, Tag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const TIME_SLOTS = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00", "17:00"];

const getNextDates = (count = 10) => {
  const dates: Date[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  let i = 1;
  while (dates.length < count) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    if (d.getDay() !== 0) dates.push(d);
    i++;
  }
  return dates;
};

const bookingSchema = z.object({
  name: z.string().trim().min(2, "Nom trop court").max(100),
  email: z.string().trim().email("Email invalide").max(255),
  phone: z.string().trim().min(6, "Numéro invalide").max(30),
  message: z.string().trim().max(1000).optional(),
});

const Booking = () => {
  const [date, setDate] = useState<Date>();
  const [time, setTime] = useState<string>();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [website, setWebsite] = useState(""); // honeypot anti-spam

  useEffect(() => {
    const stored = sessionStorage.getItem("selectedPlan");
    if (stored) setSelectedPlan(stored);
    const handler = (e: Event) => setSelectedPlan((e as CustomEvent<string>).detail);
    window.addEventListener("plan-selected", handler);
    return () => window.removeEventListener("plan-selected", handler);
  }, []);

  const clearPlan = () => {
    sessionStorage.removeItem("selectedPlan");
    setSelectedPlan(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (website) return; // bot detected, silent fail

    if (!date || !time) {
      toast.error("Choisissez une date et un horaire");
      return;
    }

    const parsed = bookingSchema.safeParse({ name, email, phone, message });
    if (!parsed.success) {
      toast.error(parsed.error.errors[0].message);
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("bookings").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone,
        message: parsed.data.message || null,
        appointment_date: format(date, "yyyy-MM-dd"),
        appointment_time: time,
      });

      if (error) throw error;

      setSuccess(true);
      toast.success("Rendez-vous confirmé !");
    } catch (err) {
      console.error(err);
      toast.error("Une erreur est survenue. Réessayez.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <section id="booking" className="relative py-24 md:py-32">
        <div className="container max-w-2xl">
          <div className="glass rounded-3xl p-10 md:p-14 text-center animate-scale-in">
            <div className="w-20 h-20 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center mx-auto mb-6 shadow-glow">
              <Check className="w-10 h-10 text-primary" strokeWidth={2.5} />
            </div>
            <h2 className="font-display text-3xl md:text-4xl font-bold mb-4 text-gradient">
              C'est confirmé !
            </h2>
            <p className="text-muted-foreground mb-2">
              Votre rendez-vous est prévu le
            </p>
            <p className="text-xl font-display font-semibold mb-6">
              {date && format(date, "EEEE d MMMM yyyy", { locale: fr })} à {time}
            </p>
            <p className="text-sm text-muted-foreground">
              Un email de confirmation vient d'être envoyé à <span className="text-foreground font-medium">{email}</span>.
              <br />Nous vous appellerons au <span className="text-foreground font-medium">{phone}</span>.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section id="booking" className="relative py-24 md:py-32 overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] rounded-full bg-primary/15 blur-[120px]" />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-background to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-background to-transparent" />

      <div className="container relative z-10 max-w-3xl">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-block px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <span className="text-xs font-medium text-primary uppercase tracking-wider">Réserver</span>
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 text-gradient">
            Discutons de votre projet
          </h2>
          <p className="text-muted-foreground text-lg">
            Choisissez un créneau, recevez votre confirmation par email.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="glass rounded-3xl p-6 md:p-10 space-y-6">
          {selectedPlan && (
            <div className="flex items-center justify-between gap-3 px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 animate-fade-in">
              <div className="flex items-center gap-2 text-sm">
                <Tag className="w-4 h-4 text-primary" />
                <span className="text-muted-foreground">Plan choisi :</span>
                <span className="font-semibold text-foreground">{selectedPlan}</span>
              </div>
              <button
                type="button"
                onClick={clearPlan}
                className="text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Retirer le plan"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2 text-sm">
                <User className="w-3.5 h-3.5 text-primary" /> Nom complet
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jean Dupont"
                required
                maxLength={100}
                className="bg-input/50 border-border/60 h-11"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2 text-sm">
                <Mail className="w-3.5 h-3.5 text-primary" /> Email
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                required
                maxLength={255}
                className="bg-input/50 border-border/60 h-11"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="phone" className="flex items-center gap-2 text-sm">
                <Phone className="w-3.5 h-3.5 text-primary" /> Téléphone
              </Label>
              <Input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+33 6 12 34 56 78"
                required
                maxLength={30}
                className="bg-input/50 border-border/60 h-11"
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-sm">
                <CalendarIcon className="w-3.5 h-3.5 text-primary" /> Date
              </Label>
              <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1 snap-x">
                {getNextDates(10).map((d) => {
                  const isSelected = date && d.toDateString() === date.toDateString();
                  return (
                    <button
                      key={d.toISOString()}
                      type="button"
                      onClick={() => setDate(d)}
                      className={cn(
                        "snap-start flex-shrink-0 flex flex-col items-center justify-center w-16 h-20 rounded-xl border transition-all",
                        isSelected
                          ? "bg-primary border-primary text-primary-foreground shadow-glow-sm"
                          : "bg-input/50 border-border/60 hover:border-primary/40 hover:text-primary"
                      )}
                    >
                      <span className="text-[10px] uppercase tracking-wider opacity-80">
                        {format(d, "EEE", { locale: fr })}
                      </span>
                      <span className="text-xl font-semibold leading-none mt-1">
                        {format(d, "d")}
                      </span>
                      <span className="text-[10px] opacity-70 mt-1">
                        {format(d, "MMM", { locale: fr })}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label className="flex items-center gap-2 text-sm">
                <Clock className="w-3.5 h-3.5 text-primary" /> Horaire
              </Label>
              <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
                {TIME_SLOTS.map((slot) => (
                  <button
                    key={slot}
                    type="button"
                    onClick={() => setTime(slot)}
                    className={cn(
                      "h-11 rounded-lg text-xs font-medium border transition-all",
                      time === slot
                        ? "bg-primary border-primary text-primary-foreground shadow-glow-sm"
                        : "bg-input/50 border-border/60 hover:border-primary/40 hover:text-primary"
                    )}
                  >
                    {slot}
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="message" className="text-sm">
                Parlez-nous de votre projet (optionnel)
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Quelques mots sur ce que vous avez en tête..."
                maxLength={1000}
                rows={4}
                className="bg-input/50 border-border/60 resize-none"
              />
            </div>
          </div>

          <Button type="submit" variant="hero" size="xl" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Confirmation en cours...
              </>
            ) : (
              "Confirmer le rendez-vous"
            )}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            Vous recevrez un email de confirmation immédiatement après réservation.
          </p>
        </form>
      </div>
    </section>
  );
};

export default Booking;

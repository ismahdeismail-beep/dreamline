import React from 'react';
import { 
  ShieldCheck, 
  Wifi, 
  Armchair, 
  Radio, 
  Clock, 
  Sparkles, 
  Check, 
  MessageSquare, 
  Tv, 
  Zap, 
  Coffee,
  Users
} from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface FleetAndSafetyProps {
  onOpenWhatsAppHub: (msg?: string) => void;
}

export const FleetAndSafety: React.FC<FleetAndSafetyProps> = ({ onOpenWhatsAppHub }) => {
  const coaches = [
    {
      name: 'Scania Marcopolo G7 Royal VIP',
      type: 'VIP 2x1 Luxury Recliner',
      capacity: '37 VIP Passengers',
      corridors: 'Nairobi ↔ Mombasa & Kisumu',
      features: [
        'Single VIP Recliner row for maximum privacy',
        'Custom plush memory foam with leg supports',
        'High-speed 4G/5G Wi-Fi onboard',
        'Dual USB-A & Type-C fast charging per seat',
        'Chilled complimentary mineral water'
      ],
      badge: 'Flagship Luxury'
    },
    {
      name: 'Mercedes-Benz Actros Executive',
      type: 'Executive 2x2 Cruiser',
      capacity: '45 Passengers',
      corridors: 'Nairobi ↔ Nakuru, Kisii & Busia',
      features: [
        'Ergonomic semi-recline luxury seating',
        'Full air conditioning climate control',
        'Overhead personal reading lights',
        'Large secure undercarriage luggage hold',
        'Smooth air-suspension for Rift Valley roads'
      ],
      badge: 'Popular Choice'
    },
    {
      name: 'King Long Night Falcon Sleeper',
      type: 'First-Class Sleeper Coach',
      capacity: '33 Berths',
      corridors: 'Overnight Nairobi ↔ Mombasa',
      features: [
        'Full flat-bed bunk with fresh linens & pillow',
        'Individual privacy curtains & ambient light',
        'Onboard certified security escort',
        'Free breakfast snack upon morning arrival',
        'Zero road-fatigue arrival at sunrise'
      ],
      badge: 'Overnight Sleeper'
    }
  ];

  const handleCharterInquiry = () => {
    const msg = `Habari Dreamline! I would like to inquire about private bus charter and hire services for a corporate / group trip. Please share quotes and fleet options.`;
    const link = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="fleet" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-16">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <Armchair className="w-4 h-4" />
            <span>Modern Coach Engineering</span>
            <span aria-hidden="true">·</span>
            <span>Safety First Protocol</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] text-white">
            The Dreamline Luxury Fleet
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Every coach in our fleet is built to provide maximum comfort, whisper-quiet cabin acoustics, and uncompromising safety across Kenyan highways.
          </p>
        </div>

        {/* Coaches Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {coaches.map((c, i) => (
            <div
              key={i}
              className="bg-slate-950 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-amber-500/40 transition-all shadow-xl group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold font-mono px-2.5 py-1 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    {c.badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {c.capacity}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold font-['Outfit'] text-white group-hover:text-amber-400 transition-colors">
                    {c.name}
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    {c.type} • {c.corridors}
                  </p>
                </div>

                <div className="space-y-2 pt-2 border-t border-slate-900">
                  {c.features.map((feat, fIdx) => (
                    <div key={fIdx} className="flex items-start gap-2 text-xs text-slate-300">
                      <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800/80">
                <button
                  onClick={() => onOpenWhatsAppHub(`Habari Dreamline! Could you share availability and fares for the ${c.name}?`)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-emerald-400 text-emerald-400" />
                  <span>Ask about this Coach on WhatsApp</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Safety First Protocol Banner */}
        <div className="bg-slate-950 rounded-3xl border border-slate-800 p-8 sm:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-widest">
              <ShieldCheck className="w-4 h-4" />
              <span>Uncompromised Road Safety</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold font-['Outfit'] text-white">
              NTSA Certified "Safety First" Protocol
            </h3>
            <p className="text-sm text-slate-400 leading-relaxed">
              Your safety is our highest priority. All Dreamline coaches feature satellite speed limiters strictly governed to 80 km/h, dual vetted senior drivers for journeys over 5 hours, breathalyzer screening before every dispatch, and live 24/7 video and telemetry monitoring from our Nairobi operations center.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-400" />
                <span>24/7 GPS Speed Limiter</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-amber-400" />
                <span>Dual Relief Drivers</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                <span>Comprehensive Insurance</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-slate-900/90 border border-slate-800 rounded-2xl p-6 space-y-4 text-center">
            <h4 className="text-base font-bold font-['Outfit'] text-white">
              Private Group Charter & Tours
            </h4>
            <p className="text-xs text-slate-400">
              Hire a full Dreamline VIP coach for corporate retreats, family events, weddings, or safari transport across Kenya.
            </p>
            <button
              onClick={handleCharterInquiry}
              className="w-full py-3 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4 fill-slate-950" />
              <span>Charter Quote via WhatsApp</span>
            </button>
          </div>
        </div>

      </div>
    </section>
  );
};

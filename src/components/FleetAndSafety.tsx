import React from 'react';
import { ShieldCheck, Check, MessageSquare } from 'lucide-react';

interface FleetAndSafetyProps {
  onOpenWhatsAppHub: (msg?: string) => void;
}

export const FleetAndSafety: React.FC<FleetAndSafetyProps> = ({ onOpenWhatsAppHub }) => {
  const coaches = [
    {
      img: '/amenities/vip.png',
      photo: '/images/hero-1.jpg',
      name: 'Royal VIP 2x1',
      type: '37 seats · Nairobi ↔ Mombasa / Kisumu',
      features: ['Private single recliners', 'Wi-Fi + USB charging', 'Bottled water included'],
    },
    {
      img: '/amenities/seats.png',
      photo: '/images/hero-3.jpg',
      name: 'Executive 2x2',
      type: '45 seats · Nakuru, Kisii, Busia',
      features: ['Ergonomic recline seats', 'Air conditioning', 'Large luggage hold'],
    },
    {
      img: '/amenities/power.png',
      photo: '/images/hero-2.jpg',
      name: 'Night Sleeper',
      type: '33 berths · Overnight Mombasa',
      features: ['Flat-bed bunks + linens', 'Privacy curtains', 'Onboard security'],
    }
  ];

  return (
    <section id="fleet" className="py-14 px-4 sm:px-6 lg:px-8 bg-white border-y border-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase text-[#34398e]">Our fleet</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">Travel in comfort</h2>
          <p className="text-sm text-slate-500 mt-1">Modern coaches with safety-first operations.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {coaches.map((c) => (
            <div key={c.name} className="bg-[#f9f8fc] border border-slate-200 rounded-2xl overflow-hidden flex flex-col justify-between hover:border-[#34398e]/40 transition-colors">
              <div>
                {/* Photo band bleeds to the card edges; the official amenity icon
                    rides on top of it so the card still reads at a glance. */}
                <div className="relative h-36 bg-slate-200">
                  <img
                    src={c.photo}
                    alt={`${c.name} coach`}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <span className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-slate-950/10 to-transparent" aria-hidden="true" />
                  <img
                    src={c.img}
                    alt=""
                    aria-hidden="true"
                    loading="lazy"
                    className="absolute left-4 bottom-3 w-11 h-11 object-contain drop-shadow-lg"
                  />
                </div>
                <div className="p-6 pt-4">
                  <h3 className="text-lg font-black text-slate-900">{c.name}</h3>
                  <p className="text-xs text-slate-500">{c.type}</p>
                  <div className="space-y-1.5 mt-3 pt-3 border-t border-slate-200">
                    {c.features.map((f) => (
                      <div key={f} className="flex items-start gap-2 text-xs text-slate-600">
                        <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-[#34398e] rounded-2xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-4 text-white">
          <div className="flex items-start gap-3">
            <ShieldCheck className="w-8 h-8 shrink-0" />
            <div>
              <h3 className="text-lg font-black">Safety-first, always</h3>
              <p className="text-sm text-white/80">Speed-limited at 80 km/h · dual drivers · GPS monitored 24/7.</p>
            </div>
          </div>
          <button
            onClick={() => onOpenWhatsAppHub('Habari! Private charter quote please.')}
            className="px-5 py-2.5 rounded-xl bg-[#e52421] hover:bg-[#c11e1c] text-white font-bold text-xs shrink-0 cursor-pointer"
          >
            Charter quote
          </button>
        </div>
      </div>
    </section>
  );
};

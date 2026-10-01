import React from 'react';
import { MapPin, Phone, Clock, MessageSquare } from 'lucide-react';
import { OFFICE_LOCATIONS, buildWhatsAppLink } from '../data/dreamlineData';

export const OfficeContacts: React.FC = () => {
  const handleOfficeWhatsApp = (office: typeof OFFICE_LOCATIONS[0]) => {
    window.open(
      buildWhatsAppLink(office.whatsapp, `Habari Dreamline ${office.city}! Departures at ${office.stationName}?`),
      '_blank', 'noopener,noreferrer'
    );
  };

  return (
    <section id="offices" className="py-14 px-4 sm:px-6 lg:px-8 bg-[#f9f8fc]">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <p className="text-xs font-black tracking-widest uppercase text-[#34398e]">Terminals</p>
          <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-slate-900 mt-1">Find an office</h2>
          <p className="text-sm text-slate-500 mt-1">Counter tickets and parcels nationwide.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {OFFICE_LOCATIONS.map((office, idx) => (
            <div key={idx} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col justify-between hover:border-[#34398e]/40 transition-colors">
              <div>
                <p className="text-[11px] uppercase font-black text-[#34398e] tracking-wider">{office.city}</p>
                <h3 className="text-base font-black text-slate-900">{office.stationName}</h3>
                <div className="space-y-1.5 text-xs text-slate-600 mt-3">
                  <div className="flex items-start gap-2"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" /><span>{office.address}</span></div>
                  <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span>{office.operatingHours}</span></div>
                  <div className="flex items-center gap-2"><Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" /><span className="font-bold">{office.phone}</span></div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleOfficeWhatsApp(office)}
                className="mt-4 w-full py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 border border-emerald-600 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <MessageSquare className="w-3.5 h-3.5" /> Chat with {office.city}
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

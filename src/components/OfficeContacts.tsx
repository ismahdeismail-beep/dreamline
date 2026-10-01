import React from 'react';
import { 
  MapPin, 
  Phone, 
  Clock, 
  MessageSquare, 
  Building2, 
  ArrowUpRight 
} from 'lucide-react';
import { OFFICE_LOCATIONS, buildWhatsAppLink } from '../data/dreamlineData';

export const OfficeContacts: React.FC = () => {
  const handleOfficeWhatsApp = (office: typeof OFFICE_LOCATIONS[0]) => {
    const msg = `Habari Dreamline ${office.city} Office! I am inquiring about departures, boarding stage, and parcels at your ${office.stationName} branch.`;
    const link = buildWhatsAppLink(office.whatsapp, msg);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="offices" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto space-y-12">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="flex items-center justify-center gap-2 text-xs font-semibold tracking-wider uppercase text-amber-400">
            <Building2 className="w-4 h-4" />
            <span>Nationwide Booking Terminals</span>
          </div>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight font-['Outfit'] text-white">
            Terminals & Physical Offices
          </h2>
          <p className="text-sm sm:text-base text-slate-400">
            Visit our physical booking offices or chat directly with the local station agent on WhatsApp for instant counter ticketing and parcel logistics.
          </p>
        </div>

        {/* Offices Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {OFFICE_LOCATIONS.map((office, idx) => (
            <div
              key={idx}
              className="bg-slate-900 border border-slate-800 rounded-3xl p-6 flex flex-col justify-between hover:border-slate-700 transition-all shadow-lg group"
            >
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-xs uppercase font-bold text-amber-400 font-mono tracking-wider">
                      {office.city} Main Hub
                    </span>
                    <h3 className="text-lg font-bold font-['Outfit'] text-white mt-0.5">
                      {office.stationName}
                    </h3>
                  </div>

                  <span className="p-2 rounded-xl bg-slate-800 text-slate-400 group-hover:text-amber-400 group-hover:bg-slate-700 transition-colors">
                    <MapPin className="w-4 h-4" />
                  </span>
                </div>

                <div className="space-y-2 text-xs text-slate-300">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 shrink-0 mt-0.5" />
                    <span>{office.address}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Hours: {office.operatingHours}</span>
                  </div>

                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-mono text-slate-200">{office.phone}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-800 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => handleOfficeWhatsApp(office)}
                  className="w-full py-2.5 px-3 rounded-xl bg-slate-950 hover:bg-slate-800 text-amber-400 border border-amber-500/40 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <MessageSquare className="w-3.5 h-3.5 fill-amber-400" />
                  <span>Chat with {office.city} Desk</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
};

import React from 'react';
import { 
  Bus, 
  Phone, 
  Mail, 
  MapPin, 
  MessageSquare, 
  ShieldCheck, 
  CreditCard, 
  Clock 
} from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface FooterProps {
  onOpenManageTicket: () => void;
  onOpenWhatsAppHub: (msg?: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  onOpenManageTicket,
  onOpenWhatsAppHub,
  onNavigateSection
}) => {
  const directWhatsApp = buildWhatsAppLink(
    DEFAULT_WHATSAPP_NUMBER,
    'Habari Dreamline! I would like general assistance regarding routes, bookings, and parcel delivery.'
  );

  return (
    <footer className="bg-slate-950 text-slate-400 border-t border-slate-800 text-xs">
      
      {/* Top Value Strip */}
      <div className="border-b border-slate-900 bg-slate-900/60 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center md:text-left">
          <div className="flex items-center gap-3 justify-center md:justify-start">
            <ShieldCheck className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Safety First Certified</p>
              <p className="text-[11px] text-slate-500">NTSA Speed Governed & Insured</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <CreditCard className="w-6 h-6 text-emerald-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">Instant M-PESA STK</p>
              <p className="text-[11px] text-slate-500">Pay directly from your phone</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <Clock className="w-6 h-6 text-amber-400 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">On-Time Departures</p>
              <p className="text-[11px] text-slate-500">Strict scheduled dispatch</p>
            </div>
          </div>

          <div className="flex items-center gap-3 justify-center md:justify-start">
            <MessageSquare className="w-6 h-6 text-emerald-400 fill-emerald-400/20 shrink-0" />
            <div>
              <p className="font-bold text-white text-xs">24/7 WhatsApp Desk</p>
              <p className="text-[11px] text-slate-500">{DISPLAY_WHATSAPP_NUMBER}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
        
        {/* Brand Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-slate-950 flex items-center justify-center font-bold">
              <Bus className="w-5 h-5 stroke-[2.3]" />
            </div>
            <div>
              <span className="text-lg font-bold font-['Outfit'] text-white tracking-tight">
                DREAMLINE EXPRESS
              </span>
              <p className="text-[10px] text-amber-400 uppercase tracking-widest font-semibold">
                Kenya Luxury Coach Travel
              </p>
            </div>
          </div>

          <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
            Providing reliable, safe, and comfortable intercity passenger transport and courier logistics across Kenya. Connecting the Coast, Nairobi, Rift Valley, and Western Kenya.
          </p>

          <div className="pt-1 flex items-center gap-3">
            <a
              href={directWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors"
            >
              <MessageSquare className="w-3.5 h-3.5 fill-white" />
              <span>WhatsApp Helpline</span>
            </a>
          </div>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Quick Navigation
          </h4>
          <ul className="space-y-2">
            <li>
              <button 
                onClick={() => onNavigateSection('hero')} 
                className="hover:text-amber-400 transition-colors"
              >
                Search & Book Buses
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateSection('next-buses')} 
                className="hover:text-amber-400 transition-colors"
              >
                Next Available Departures
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateSection('routes')} 
                className="hover:text-amber-400 transition-colors"
              >
                All Routes & Fares
              </button>
            </li>
            <li>
              <button 
                onClick={() => onNavigateSection('fleet')} 
                className="hover:text-amber-400 transition-colors"
              >
                VIP Fleet & Amenities
              </button>
            </li>
            <li>
              <button 
                onClick={onOpenManageTicket} 
                className="hover:text-amber-400 transition-colors text-amber-300 font-semibold"
              >
                Manage / Print Ticket
              </button>
            </li>
          </ul>
        </div>

        {/* Key Corridors */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Popular Corridors
          </h4>
          <ul className="space-y-2 text-slate-400">
            <li>Nairobi ↔ Mombasa Luxury</li>
            <li>Nairobi ↔ Kisumu Express</li>
            <li>Nairobi ↔ Nakuru Shuttles</li>
            <li>Nairobi ↔ Kisii & Narok</li>
            <li>Nairobi ↔ Busia & Western</li>
            <li>Mombasa ↔ Malindi & Kilifi</li>
          </ul>
        </div>

        {/* Contact & Support */}
        <div className="space-y-3">
          <h4 className="font-bold text-white text-xs uppercase tracking-wider">
            Head Office Contact
          </h4>
          <ul className="space-y-2.5">
            <li className="flex items-start gap-2">
              <MapPin className="w-3.5 h-3.5 text-slate-500 shrink-0 mt-0.5" />
              <span>River Road Terminal, Nairobi CBD</span>
            </li>
            <li className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <span className="font-mono">+254 712 345 678</span>
            </li>
            <li className="flex items-center gap-2">
              <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
              <a href="mailto:info@dreamline.co.ke" className="hover:text-white">
                info@dreamline.co.ke
              </a>
            </li>
            <li className="flex items-center gap-2">
              <MessageSquare className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="font-mono text-emerald-300">WhatsApp: +254 712 345 678</span>
            </li>
          </ul>
        </div>

      </div>

      {/* Bottom Copyright & Policy Strip */}
      <div className="border-t border-slate-900 py-6 px-4 sm:px-6 lg:px-8 text-[11px] text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Dreamline Express Ltd (Kenya). All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Luggage Policy (20kg free)</span>
            <span aria-hidden="true">·</span>
            <span>Terms & Conditions</span>
            <span aria-hidden="true">·</span>
            <span>Safety Guidelines</span>
          </div>
        </div>
      </div>

    </footer>
  );
};

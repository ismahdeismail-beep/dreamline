import React, { useState } from 'react';
import { MessageSquare, Ticket, Menu, X } from 'lucide-react';
import { DISPLAY_WHATSAPP_NUMBER, DEFAULT_WHATSAPP_NUMBER, buildWhatsAppLink } from '../data/dreamlineData';

interface NavbarProps {
  onOpenManageTicket: () => void;
  onOpenWhatsAppHub: (defaultMsg?: string) => void;
  onNavigateSection: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenManageTicket,
  onOpenWhatsAppHub,
  onNavigateSection
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const directWhatsAppLink = buildWhatsAppLink(
    DEFAULT_WHATSAPP_NUMBER,
    'Habari Dreamline! I would like to make an inquiry about bus tickets.'
  );

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      {/* Slim top bar */}
      <div className="bg-[#34398e] text-white text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-2">
          <span className="font-semibold tracking-wide">Daily departures across Kenya</span>
          <a
            href={directWhatsAppLink}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 bg-white/15 px-2.5 py-0.5 rounded-full hover:bg-white/25 transition-colors font-semibold"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            WhatsApp Desk Active
          </a>
        </div>
      </div>

      {/* Main bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => handleNavClick('hero')} className="flex items-center gap-2.5 cursor-pointer">
            <img src="/logo.png" alt="Dreamline Express" className="h-10 w-auto object-contain" />
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-[#34398e]">DREAMLINE</span>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">Express Kenya</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <button onClick={() => handleNavClick('hero')} className="hover:text-[#34398e] transition-colors cursor-pointer">Book</button>
            <button onClick={() => handleNavClick('next-buses')} className="hover:text-[#34398e] transition-colors cursor-pointer flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Next Buses
            </button>
            <button onClick={() => handleNavClick('routes')} className="hover:text-[#34398e] transition-colors cursor-pointer">Routes</button>
            <button onClick={() => handleNavClick('fleet')} className="hover:text-[#34398e] transition-colors cursor-pointer">Fleet</button>
            <button onClick={() => handleNavClick('offices')} className="hover:text-[#34398e] transition-colors cursor-pointer">Offices</button>
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            <button
              onClick={onOpenManageTicket}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-[#34398e] bg-[#34398e]/5 hover:bg-[#34398e]/10 border border-[#34398e]/20 rounded-lg transition-colors cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5" />
              My Ticket
            </button>
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="p-2 text-emerald-600 bg-emerald-50 border border-emerald-200 rounded-lg"
              aria-label="WhatsApp Desk"
            >
              <MessageSquare className="w-5 h-5" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 text-sm font-bold text-slate-700">
          {[
            ['hero', 'Book'],
            ['next-buses', 'Next Buses'],
            ['routes', 'Routes & Fares'],
            ['fleet', 'Fleet'],
            ['offices', 'Offices'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => handleNavClick(id)} className="block w-full text-left py-2 px-3 rounded-md hover:bg-slate-100">
              {label}
            </button>
          ))}
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenManageTicket(); }}
              className="w-full py-2.5 text-xs font-bold text-[#34398e] bg-[#34398e]/5 border border-[#34398e]/20 rounded-lg"
            >
              My Ticket
            </button>
            <button
              onClick={() => { setMobileMenuOpen(false); onOpenWhatsAppHub(); }}
              className="w-full py-2.5 text-xs font-bold text-white bg-emerald-600 rounded-lg"
            >
              Chat on WhatsApp ({DISPLAY_WHATSAPP_NUMBER})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

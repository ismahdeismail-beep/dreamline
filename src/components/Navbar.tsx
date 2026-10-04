import React, { useState } from 'react';
import { MessageSquare, Phone, Ticket, Menu, X } from 'lucide-react';
import { DISPLAY_WHATSAPP_NUMBER, TEL_LINK } from '../data/dreamlineData';
import Button from './Button';

interface NavbarProps {
  onOpenManageTicket: () => void;
  onOpenWhatsAppHub: (defaultMsg?: string) => void;
  onNavigateSection: (sectionId: string) => void;
  onBook: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenManageTicket,
  onOpenWhatsAppHub,
  onNavigateSection,
  onBook
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-xl border-b border-white/60 shadow-sm px-4 sm:px-6 lg:px-8">
      {/* Main bar */}
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between h-16">
          <div onClick={() => handleNavClick('hero')} className="flex items-center gap-2.5 cursor-pointer">
            <img src="/logo.png" alt="Dreamline Express" className="h-10 w-auto object-contain" />
            <div className="leading-tight">
              <span className="text-lg font-black tracking-tight text-[#34398e]">DREAMLINE</span>
              <p className="text-[10px] text-slate-500 tracking-widest uppercase font-bold">Express Kenya</p>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-sm font-bold text-slate-700">
            <button onClick={() => { setMobileMenuOpen(false); onBook(); }} className="hover:text-[#34398e] transition-colors cursor-pointer">Book</button>
            <button onClick={() => handleNavClick('next-buses')} className="hover:text-[#34398e] transition-colors cursor-pointer flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Next Buses
            </button>
            <button onClick={() => handleNavClick('routes')} className="hover:text-[#34398e] transition-colors cursor-pointer">Routes</button>
            <button onClick={() => handleNavClick('fleet')} className="hover:text-[#34398e] transition-colors cursor-pointer">Fleet</button>
            <button onClick={() => handleNavClick('offices')} className="hover:text-[#34398e] transition-colors cursor-pointer">Offices</button>
          </nav>

          <div className="hidden sm:flex items-center gap-2.5">
            {/* Polymorphic Button renders an <a> for tel: links, a <button> for
                actions, and a <Link> when `as={Link}` — one visual language. */}
            <Button as="a" href={TEL_LINK} variant="subtle" size="sm">
              <Phone className="w-3.5 h-3.5" />
              Call
            </Button>
            <Button onClick={onOpenManageTicket} variant="subtle" size="sm">
              <Ticket className="w-3.5 h-3.5" />
              My Ticket
            </Button>
            <Button
              onClick={() => onOpenWhatsAppHub()}
              variant="whatsapp"
              size="sm"
            >
              <MessageSquare className="w-4 h-4" />
              <span>WhatsApp</span>
            </Button>
          </div>

          <div className="lg:hidden flex items-center gap-2">
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
        <div className="lg:hidden border-t border-white/60 bg-white/80 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1 text-sm font-bold text-slate-700">
          {[
            ['next-buses', 'Next Buses'],
            ['routes', 'Routes & Fares'],
            ['fleet', 'Fleet'],
            ['offices', 'Offices'],
          ].map(([id, label]) => (
            <button key={id} onClick={() => handleNavClick(id)} className="block w-full text-left py-2 px-3 rounded-md hover:bg-slate-100">
              {label}
            </button>
          ))}
          <button onClick={() => { setMobileMenuOpen(false); onBook(); }} className="block w-full text-left py-2 px-3 rounded-md bg-[#34398e] text-white hover:bg-[#2a2e73] transition-colors mt-1">
            Book a Seat
          </button>
          <div className="pt-3 border-t border-slate-200 flex flex-col gap-2">
            <Button as="a" href={TEL_LINK} variant="subtle" fullWidth>
              <Phone className="w-3.5 h-3.5" /> Call {DISPLAY_WHATSAPP_NUMBER}
            </Button>
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

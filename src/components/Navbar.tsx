import React, { useState } from 'react';
import {
  Bus,
  MessageSquare,
  Ticket,
  Menu,
  X,
  ShieldCheck,
  Clock
} from 'lucide-react';
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
    'Habari Dreamline! I would like to make an inquiry about bus tickets, schedules, and fares.'
  );

  const handleNavClick = (sectionId: string) => {
    setMobileMenuOpen(false);
    onNavigateSection(sectionId);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-950 text-white border-b border-slate-800/80 backdrop-blur-md bg-opacity-95 shadow-lg">
      {/* Top micro-bar */}
      <div className="bg-amber-500 text-slate-950 text-xs py-1.5 px-4 font-medium">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1 font-semibold tracking-wide">
              <ShieldCheck className="w-3.5 h-3.5" />
              NTSA Verified & Safety First Protocol
            </span>
            <span className="hidden sm:inline opacity-60">|</span>
            <span className="hidden sm:flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              Daily Luxury Departures Across Kenya
            </span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold">
            <span className="hidden md:inline">Customer Helpline: 0788256042</span>
            <a 
              href={directWhatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 bg-slate-950 text-amber-400 px-2.5 py-0.5 rounded-full hover:bg-slate-900 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></span>
              WhatsApp Booking Desk Active
            </a>
          </div>
        </div>
      </div>

      {/* Main navigation bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand */}
          <div 
            onClick={() => handleNavClick('hero')} 
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-amber-400 flex items-center justify-center text-slate-950 shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform">
              <Bus className="w-6 h-6 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold tracking-tight text-white font-['Outfit']">
                  DREAMLINE
                </span>
                <span className="text-xs uppercase px-1.5 py-0.5 rounded font-bold tracking-widest bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  EXPRESS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 tracking-wider uppercase font-medium">
                The Royal Coach Experience • Kenya
              </p>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-300">
            <button 
              onClick={() => handleNavClick('hero')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Home & Booking
            </button>
            <button 
              onClick={() => handleNavClick('next-buses')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1 flex items-center gap-1.5"
            >
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping"></span>
              Next Buses
            </button>
            <button 
              onClick={() => handleNavClick('routes')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Routes & Fares
            </button>
            <button 
              onClick={() => handleNavClick('fleet')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              VIP Fleet & Safety
            </button>
            <button 
              onClick={() => handleNavClick('offices')}
              className="hover:text-amber-400 transition-colors cursor-pointer py-1"
            >
              Offices & Terminals
            </button>
          </nav>

          {/* Action CTAs */}
          <div className="hidden sm:flex items-center gap-3">
            <button
              onClick={onOpenManageTicket}
              className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-slate-200 bg-slate-900 hover:bg-slate-800 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            >
              <Ticket className="w-3.5 h-3.5 text-amber-400" />
              Manage / Print Ticket
            </button>

            {/* Direct WhatsApp Action Button */}
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-white bg-amber-600 hover:bg-amber-500 active:bg-amber-700 shadow-md shadow-amber-950/40 rounded-lg transition-all transform hover:-translate-y-0.5 cursor-pointer"
              title="Chat with Dreamline Booking Agent on WhatsApp"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              <span>WhatsApp Inquiry</span>
            </button>
          </div>

          {/* Mobile hamburger */}
          <div className="lg:hidden flex items-center gap-2">
            <button
              onClick={() => onOpenWhatsAppHub()}
              className="p-2 text-amber-400 bg-amber-950/60 border border-amber-800/80 rounded-lg"
              aria-label="WhatsApp Desk"
            >
              <MessageSquare className="w-5 h-5 fill-amber-400" />
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white rounded-lg focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-800 bg-slate-950 px-4 pt-4 pb-6 space-y-3">
          <div className="flex flex-col space-y-2 text-sm font-medium text-slate-200">
            <button 
              onClick={() => handleNavClick('hero')} 
              className="text-left py-2 px-3 rounded-md hover:bg-slate-900"
            >
              Home & Search Buses
            </button>
            <button 
              onClick={() => handleNavClick('next-buses')} 
              className="text-left py-2 px-3 rounded-md hover:bg-slate-900 flex items-center justify-between"
            >
              <span>Next Available Buses</span>
              <span className="text-[10px] bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded font-bold">LIVE</span>
            </button>
            <button 
              onClick={() => handleNavClick('routes')} 
              className="text-left py-2 px-3 rounded-md hover:bg-slate-900"
            >
              All Routes & Fares
            </button>
            <button 
              onClick={() => handleNavClick('fleet')} 
              className="text-left py-2 px-3 rounded-md hover:bg-slate-900"
            >
              VIP Fleet & Amenities
            </button>
            <button 
              onClick={() => handleNavClick('offices')} 
              className="text-left py-2 px-3 rounded-md hover:bg-slate-900"
            >
              Terminals & Offices
            </button>
          </div>

          <div className="pt-3 border-t border-slate-800 flex flex-col gap-2.5">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenManageTicket();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-200 bg-slate-900 border border-slate-700 rounded-lg"
            >
              <Ticket className="w-4 h-4 text-amber-400" />
              Manage / Print Ticket
            </button>

            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenWhatsAppHub();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-bold text-white bg-amber-600 rounded-lg"
            >
              <MessageSquare className="w-4 h-4 fill-white" />
              Chat on WhatsApp ({DISPLAY_WHATSAPP_NUMBER})
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

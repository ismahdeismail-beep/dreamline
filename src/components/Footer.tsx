import React from 'react';
import { MessageSquare } from 'lucide-react';
import { DEFAULT_WHATSAPP_NUMBER, DISPLAY_WHATSAPP_NUMBER, TEL_LINK, buildWhatsAppLink } from '../data/dreamlineData';

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
  const directWhatsApp = buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, 'Habari Dreamline! General assistance please.');

  return (
    <footer className="bg-[#23265e] text-white/80 text-sm px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3">
          <div className="flex items-center gap-2.5">
            <img src="/logo.png" alt="Dreamline" className="h-9 w-auto object-contain bg-white rounded-lg px-1.5 py-0.5" />
            <span className="text-lg font-black tracking-tight text-white">DREAMLINE</span>
          </div>
          <p className="text-xs text-white/60">Luxury coach travel across Kenya. Coast, Nairobi, Rift Valley, Western.</p>
          <a href={directWhatsApp} target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors">
            <MessageSquare className="w-3.5 h-3.5" /> {DISPLAY_WHATSAPP_NUMBER}
          </a>
        </div>

        <div>
          <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">Book</h4>
          <ul className="space-y-2 text-xs">
            <li><button onClick={() => onNavigateSection('hero')} className="hover:text-white">Search buses</button></li>
            <li><button onClick={() => onNavigateSection('next-buses')} className="hover:text-white">Next departures</button></li>
            <li><button onClick={() => onNavigateSection('routes')} className="hover:text-white">Routes & fares</button></li>
            <li><button onClick={onOpenManageTicket} className="hover:text-white font-bold">My ticket</button></li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">Popular</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li>Nairobi ↔ Mombasa</li>
            <li>Nairobi ↔ Kisumu</li>
            <li>Nairobi ↔ Nakuru</li>
            <li>Nairobi ↔ Kisii / Busia</li>
          </ul>
        </div>

        <div>
          <h4 className="font-black text-white text-xs uppercase tracking-wider mb-3">Contact</h4>
          <ul className="space-y-2 text-xs text-white/60">
            <li>River Road Terminal, Nairobi</li>
            <li><a href={TEL_LINK} className="hover:text-white">{DISPLAY_WHATSAPP_NUMBER}</a></li>
            <li><a href="mailto:info@dreamline.co.ke" className="hover:text-white">info@dreamline.co.ke</a></li>
            <li>
              <a href={`${buildWhatsAppLink(DEFAULT_WHATSAPP_NUMBER, 'Habari Dreamline! I would like to make a booking.')}`}
                 target="_blank" rel="noopener noreferrer" className="hover:text-white">
                WhatsApp us
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 px-4 text-[11px] text-white/50">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 Dreamline Express Ltd. All rights reserved.</p>
          <p>20kg luggage free · Terms apply</p>
        </div>
      </div>
    </footer>
  );
};

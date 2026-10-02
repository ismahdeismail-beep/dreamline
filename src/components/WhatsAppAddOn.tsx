import React, { useState } from 'react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Copy, 
  Check, 
  Clock, 
  Bus, 
  Tag, 
  HelpCircle, 
  PhoneCall, 
  ExternalLink,
  ChevronRight,
  Shield,
  Settings
} from 'lucide-react';
import { 
  KENYAN_CITIES, 
  DEFAULT_WHATSAPP_NUMBER, 
  DISPLAY_WHATSAPP_NUMBER, 
  OFFICE_LOCATIONS, 
  buildWhatsAppLink,
  TEL_LINK
} from '../data/dreamlineData';

interface WhatsAppAddOnProps {
  isOpen: boolean;
  onClose: () => void;
  onOpen: () => void;
  initialMessage?: string;
  selectedRoute?: { from: string; to: string; date?: string; time?: string };
}

export const WhatsAppAddOn: React.FC<WhatsAppAddOnProps> = ({
  isOpen,
  onClose,
  onOpen,
  initialMessage,
  selectedRoute
}) => {
  const [activeTab, setActiveTab] = useState<'quick' | 'builder' | 'offices'>('quick');
  const [customPhone, setCustomPhone] = useState(DEFAULT_WHATSAPP_NUMBER);
  const [showSettings, setShowSettings] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form builder state
  const [builderFrom, setBuilderFrom] = useState(selectedRoute?.from || 'Nairobi');
  const [builderTo, setBuilderTo] = useState(selectedRoute?.to || 'Mombasa');
  const [builderDate, setBuilderDate] = useState('Tomorrow');
  const [builderPassengers, setBuilderPassengers] = useState('1 Passenger');
  const [builderClass, setBuilderClass] = useState('VIP 2x1 Recliner');
  const [builderInquiryType, setBuilderInquiryType] = useState<'availability' | 'price' | 'nextBus' | 'custom'>('availability');
  const [customNote, setCustomNote] = useState('');

  // Quick preset templates
  const quickTemplates = [
    {
      title: 'Next Available Bus',
      subtitle: 'Ask about the upcoming departure times and vacant seats',
      icon: Clock,
      message: `Habari Dreamline! Please let me know the NEXT AVAILABLE BUS today between Nairobi and Mombasa. How many seats are left and what is the fare?`
    },
    {
      title: 'Route Fare & VIP Pricing',
      subtitle: 'Instant fare quotation for VIP vs Executive luxury coaches',
      icon: Tag,
      message: `Hello Dreamline Booking Desk, what are the current ticket prices for VIP 2x1 Recliners vs Executive coaches from Nairobi to Mombasa?`
    },
    {
      title: 'Seat Reservation Assistance',
      subtitle: 'Get human assistant help reserving a specific seat or group',
      icon: Bus,
      message: `Habari Dreamline Team, I would like to reserve a VIP seat for travel from Nairobi to Mombasa. Please advise on available seat numbers and M-Pesa payment.`
    },
    {
      title: 'Luggage / Courier Parcel',
      subtitle: 'Inquire on parcel sending rates and drop-off stations',
      icon: HelpCircle,
      message: `Hello Dreamline Express Logistics, I have a parcel inquiry. What are your parcel rates and dispatch times from Nairobi to Western/Coast?`
    }
  ];

  // Dynamic message based on builder
  const generatedMessage = (() => {
    if (builderInquiryType === 'availability') {
      return `Habari Dreamline! I am checking bus availability from ${builderFrom} to ${builderTo} for ${builderDate}. Travel party: ${builderPassengers}, preferred class: ${builderClass}.${customNote ? ` Note: ${customNote}` : ''} Please share available coaches and departures.`;
    } else if (builderInquiryType === 'price') {
      return `Hello Dreamline Booking Desk, could you please quote the current fare from ${builderFrom} to ${builderTo} for ${builderClass} on ${builderDate}?`;
    } else if (builderInquiryType === 'nextBus') {
      return `Habari Dreamline! What is the NEXT BUS departing from ${builderFrom} to ${builderTo}? Are there available seats right now?`;
    } else {
      return `Hello Dreamline Team! I have an inquiry regarding travel from ${builderFrom} to ${builderTo}. ${customNote || 'Please assist with schedule and booking.'}`;
    }
  })();

  const currentWhatsAppLink = buildWhatsAppLink(
    customPhone,
    initialMessage || generatedMessage
  );

  const handleLaunchWhatsApp = (msgToSend?: string) => {
    const text = msgToSend || initialMessage || generatedMessage;
    const link = buildWhatsAppLink(customPhone, text);
    window.open(link, '_blank', 'noopener,noreferrer');
  };

  const handleCopyMessage = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <>
      {/* 1. FLOATING ALWAYS-VISIBLE WHATSAPP BUTTON (Prompt specification: bottom-right) */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center gap-3">
        {!isOpen && (
          <button
            onClick={onOpen}
            className="hidden md:flex items-center gap-2 bg-slate-900/70 text-white px-3 py-1.5 rounded-full border border-white/20 shadow-lg backdrop-blur-xl text-xs font-semibold hover:bg-slate-800 transition-all backdrop-blur-sm cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Live WhatsApp Desk</span>
            <span className="text-emerald-400">Online</span>
          </button>
        )}

        {/* Call button sits beside WhatsApp so reaching the desk never requires
            scrolling back up to the header on a phone. */}
        <a
          href={TEL_LINK}
          aria-label={`Call the desk on ${DISPLAY_WHATSAPP_NUMBER}`}
          className="w-14 h-14 rounded-full bg-[#34398e]/85 backdrop-blur-xl text-white flex items-center justify-center shadow-xl shadow-indigo-950/30 hover:bg-[#34398e] hover:scale-105 active:scale-95 transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-[#34398e]/30 border border-white/25"
        >
          <PhoneCall className="w-6 h-6" />
        </a>

        <button
          onClick={() => (isOpen ? onClose() : onOpen())}
          className="relative group flex items-center justify-center w-14 h-14 rounded-full bg-[#25D366] text-white shadow-xl shadow-emerald-950/40 hover:bg-[#20ba59] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-400/40"
          aria-label="Open WhatsApp Desk"
        >
          {isOpen ? (
            <X className="w-7 h-7" />
          ) : (
            <>
              <MessageSquare className="w-7 h-7 fill-white" />
              <span className="absolute -top-1 -right-1 flex h-4 w-4">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500 border-2 border-white"></span>
              </span>
            </>
          )}
        </button>
      </div>

      {/* 2. EXPANDABLE WHATSAPP ASSISTANT & ENQUIRY HUB MODAL */}
      {isOpen && (
        <div className="fixed bottom-24 right-4 sm:right-6 z-50 w-[calc(100vw-2rem)] sm:w-[440px] max-h-[82vh] flex flex-col bg-white/85 backdrop-blur-2xl rounded-2xl shadow-2xl border border-white/60 overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#075E54] text-white p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#25D366] flex items-center justify-center text-white shadow-inner">
                  <MessageSquare className="w-5 h-5 fill-white" />
                </div>
                <div>
                  <h3 className="font-bold text-base tracking-tight font-['Lato'] flex items-center gap-1.5">
                    Dreamline WhatsApp Desk
                    <span className="text-[10px] font-semibold bg-emerald-700/80 text-emerald-200 px-2 py-0.5 rounded-full">
                      Official
                    </span>
                  </h3>
                  <p className="text-xs text-emerald-100 flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-[#25D366] inline-block animate-pulse"></span>
                    Human Booking Assistant Online (<span className="font-mono text-emerald-200">{customPhone === DEFAULT_WHATSAPP_NUMBER ? DISPLAY_WHATSAPP_NUMBER : customPhone}</span>)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  title="Configure WhatsApp Phone Number"
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition-colors"
                >
                  <Settings className="w-4 h-4" />
                </button>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-800/60 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Config drawer for testing or changing phone */}
            {showSettings && (
              <div className="mt-3 pt-3 border-t border-emerald-600/50 text-xs">
                <label className="block text-emerald-100 mb-1 font-medium">
                  Support WhatsApp Line (international format, digits only):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={customPhone}
                    onChange={(e) => setCustomPhone(e.target.value)}
                    className="flex-1 px-2.5 py-1.5 rounded bg-emerald-800 text-white placeholder-emerald-300 text-xs font-mono border border-emerald-600 focus:outline-none focus:ring-1 focus:ring-amber-400"
                    placeholder="254788256042"
                  />
                  <button
                    onClick={() => {
                      setCustomPhone(DEFAULT_WHATSAPP_NUMBER);
                      setShowSettings(false);
                    }}
                    className="px-2 py-1.5 bg-emerald-700 text-[11px] rounded text-white hover:bg-emerald-600 font-medium"
                  >
                    Reset
                  </button>
                </div>
              </div>
            )}

            {/* Navigation Tabs inside Hub */}
            <div className="flex items-center gap-1 mt-3 bg-emerald-800/60 p-1 rounded-lg text-xs font-medium">
              <button
                onClick={() => setActiveTab('quick')}
                className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                  activeTab === 'quick' 
                    ? 'bg-white text-emerald-950 font-bold shadow-sm' 
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                Instant Enquiries
              </button>
              <button
                onClick={() => setActiveTab('builder')}
                className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                  activeTab === 'builder' 
                    ? 'bg-white text-emerald-950 font-bold shadow-sm' 
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                Custom Route Inquiry
              </button>
              <button
                onClick={() => setActiveTab('offices')}
                className={`flex-1 py-1.5 rounded-md transition-all text-center ${
                  activeTab === 'offices' 
                    ? 'bg-white text-emerald-950 font-bold shadow-sm' 
                    : 'text-emerald-100 hover:text-white'
                }`}
              >
                Station Desks
              </button>
            </div>
          </div>

          {/* Content Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-slate-800 max-h-[50vh]">
            
            {/* TAB 1: QUICK ENQUIRIES */}
            {activeTab === 'quick' && (
              <div className="space-y-3">
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-900 flex items-start gap-2.5">
                  <Shield className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <p>
                    Tap any option below to immediately open WhatsApp with your inquiry pre-composed. Our booking team responds in real time!
                  </p>
                </div>

                <div className="space-y-2">
                  {quickTemplates.map((template, idx) => {
                    const IconComp = template.icon;
                    return (
                      <div
                        key={idx}
                        className="group p-3 rounded-xl border border-slate-200 hover:border-emerald-500 hover:bg-emerald-50/40 transition-all cursor-pointer bg-white"
                        onClick={() => handleLaunchWhatsApp(template.message)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                              <IconComp className="w-4 h-4" />
                            </div>
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 group-hover:text-emerald-700">
                                {template.title}
                              </h4>
                              <p className="text-[11px] text-slate-500">
                                {template.subtitle}
                              </p>
                            </div>
                          </div>
                          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 group-hover:translate-x-0.5 transition-transform" />
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Direct Action */}
                <div className="pt-2">
                  <button
                    onClick={() => handleLaunchWhatsApp('Habari Dreamline! I would like to make an inquiry with a customer assistant.')}
                    className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa50] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                  >
                    <MessageSquare className="w-4 h-4 fill-white" />
                    <span>Open Direct WhatsApp Conversation</span>
                  </button>
                </div>
              </div>
            )}

            {/* TAB 2: ROUTE INQUIRY BUILDER */}
            {activeTab === 'builder' && (
              <div className="space-y-3 text-xs">
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">
                    What would you like to inquire about?
                  </label>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      type="button"
                      onClick={() => setBuilderInquiryType('availability')}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                        builderInquiryType === 'availability'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Availability
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuilderInquiryType('price')}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                        builderInquiryType === 'price'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Pricing / Fares
                    </button>
                    <button
                      type="button"
                      onClick={() => setBuilderInquiryType('nextBus')}
                      className={`py-1.5 px-2 rounded-lg border text-center font-medium transition-colors ${
                        builderInquiryType === 'nextBus'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold'
                          : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      Next Bus
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Travelling From</label>
                    <select
                      value={builderFrom}
                      onChange={(e) => setBuilderFrom(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    >
                      {KENYAN_CITIES.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Travelling To</label>
                    <select
                      value={builderTo}
                      onChange={(e) => setBuilderTo(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500 font-medium"
                    >
                      {KENYAN_CITIES.filter(c => c !== builderFrom).map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Date</label>
                    <select
                      value={builderDate}
                      onChange={(e) => setBuilderDate(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="Today">Today (Immediate)</option>
                      <option value="Tomorrow">Tomorrow</option>
                      <option value="This Weekend">This Weekend</option>
                      <option value="Next Week">Next Week</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">Class</label>
                    <select
                      value={builderClass}
                      onChange={(e) => setBuilderClass(e.target.value)}
                      className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    >
                      <option value="VIP 2x1 Recliner">VIP 2x1 Recliner</option>
                      <option value="Executive Luxury 2x2">Executive Luxury 2x2</option>
                      <option value="First Class Sleeper">First Class Sleeper</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-600 font-medium mb-1">Any specific requirement / seat preference?</label>
                  <input
                    type="text"
                    value={customNote}
                    onChange={(e) => setCustomNote(e.target.value)}
                    placeholder="e.g. Window seat, travelling with kids, excess luggage"
                    className="w-full p-2 border border-slate-300 rounded-lg text-xs bg-slate-50 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>

                {/* Live Message Preview */}
                <div className="p-3 bg-slate-100 rounded-xl border border-slate-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                      Pre-filled WhatsApp Message
                    </span>
                    <button
                      onClick={() => handleCopyMessage(generatedMessage)}
                      className="text-[11px] text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1 cursor-pointer"
                    >
                      {copied ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                      <span>{copied ? 'Copied' : 'Copy Text'}</span>
                    </button>
                  </div>
                  <p className="text-xs text-slate-700 font-mono bg-white p-2 rounded border border-slate-200 whitespace-pre-wrap leading-relaxed">
                    {generatedMessage}
                  </p>
                </div>

                <button
                  onClick={() => handleLaunchWhatsApp(generatedMessage)}
                  className="w-full py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#20ba59] active:bg-[#1caa50] text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-950/20 transition-all cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Inquiry to WhatsApp Assistant</span>
                </button>
              </div>
            )}

            {/* TAB 3: STATION OFFICES & CONTACTS */}
            {activeTab === 'offices' && (
              <div className="space-y-2.5 text-xs">
                <p className="text-slate-500 text-[11px]">
                  Directly contact Dreamline booking terminals in Kenya for parcels, local pickups, or physical boarding support:
                </p>

                {OFFICE_LOCATIONS.map((office, idx) => {
                  const stationMsg = `Habari Dreamline ${office.city} Office! I am inquiring about boarding at ${office.stationName}.`;
                  return (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-white hover:border-emerald-400 transition-colors flex items-center justify-between"
                    >
                      <div>
                        <div className="font-bold text-slate-900 flex items-center gap-1.5">
                          <span>{office.city} Terminal</span>
                          <span className="text-[10px] text-slate-500 font-normal">({office.operatingHours})</span>
                        </div>
                        <p className="text-[11px] text-slate-600">{office.stationName}</p>
                        <p className="text-[10px] text-slate-400 font-mono">{office.phone}</p>
                      </div>

                      <button
                        onClick={() => handleLaunchWhatsApp(stationMsg)}
                        className="px-2.5 py-1.5 rounded-lg bg-emerald-600 text-white font-semibold text-[11px] hover:bg-emerald-500 flex items-center gap-1 shadow-sm shrink-0 cursor-pointer"
                      >
                        <MessageSquare className="w-3 h-3 fill-white" />
                        <span>Chat</span>
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

          </div>

          {/* Footer note */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-[11px] text-slate-500">
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
              Human Agents 24/7
            </span>
            <span className="text-slate-400">
              Dreamline Express Kenya
            </span>
          </div>
        </div>
      )}
    </>
  );
};

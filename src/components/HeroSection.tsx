import React, { useEffect, useState } from 'react';
import { MapPin, Calendar, Users, ArrowRightLeft, Search } from 'lucide-react';
import { KENYAN_CITIES } from '../data/dreamlineData';

interface HeroSectionProps {
  onSearch: (params: { origin: string; destination: string; date: string; passengers: number }) => void;
  onSelectRouteQuick: (from: string, to: string) => void;
}

const BENEFITS = [
  { img: '/amenities/vip.png', title: 'VIP Recliners', desc: '2x1 wide seats' },
  { img: '/amenities/wi-fi.png', title: 'Free Wi-Fi', desc: 'Wi-Fi + charging' },
  { img: '/amenities/seats.png', title: 'Comfort', desc: 'Extra legroom' },
  { img: '/amenities/power.png', title: 'Power Onboard', desc: 'USB at every seat' },
];

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onSelectRouteQuick
}) => {
  const [origin, setOrigin] = useState('Nairobi');
  const [destination, setDestination] = useState('Mombasa');
  const [travelDate, setTravelDate] = useState('2026-10-02');
  const [passengers, setPassengers] = useState(1);

  // Background slideshow + a coach watermark, both decorative.
  const [activeSlide, setActiveSlide] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const heroSlides = ['/coaches/royal-star-vip.jpg', '/coaches/executive-cruiser.jpg', '/coaches/highlands-vip.jpg'];

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (reducedMotion) return;
    const id = window.setInterval(
      () => setActiveSlide((i) => (i + 1) % heroSlides.length),
      6000
    );
    return () => window.clearInterval(id);
  }, [reducedMotion]);

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch({ origin, destination, date: travelDate, passengers });
  };

  const topCorridors = [
    { from: 'Nairobi', to: 'Mombasa' },
    { from: 'Nairobi', to: 'Kisumu' },
    { from: 'Nairobi', to: 'Nakuru' },
    { from: 'Nairobi', to: 'Kisii' },
  ];

  const selectCls =
    'w-full bg-white border border-slate-300 rounded-xl py-3 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/20 cursor-pointer';

  return (
<section className="relative bg-[#f9f8fc] pt-10 pb-14 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Soft crossfading coach photos behind the hero. Decorative only, and it
          stops entirely for visitors who ask for reduced motion. */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {heroSlides.map((src, i) => (
          <img
            key={src}
            src={src}
            alt=""
            aria-hidden="true"
            loading="lazy"
            decoding="async"
            className="absolute inset-0 h-full w-full object-cover opacity-[0.07] blur-[2px] transition-opacity duration-[1600ms] ease-in-out"
            style={{ opacity: i === activeSlide && !reducedMotion ? 0.11 : 0.05 }}
          />
        ))}
        <div className="absolute inset-0 bg-gradient-to-b from-[#f9f8fc] via-[#f9f8fc]/80 to-[#f9f8fc]" />
      </div>

      <div className="relative max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto space-y-3">
          <p className="text-xs font-black tracking-widest uppercase text-[#34398e]">Kenya's luxury coach operator</p>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-slate-900 leading-tight">
            Book your bus in <span className="text-[#34398e]">minutes.</span>
          </h1>
          <p className="text-base text-slate-600">
            VIP coaches across Kenya. Pay with M-Pesa, get help on WhatsApp.
          </p>
        </div>

        {/* Search card */}
        <div className="mt-8 bg-white border border-slate-200 rounded-2xl shadow-lg shadow-[#34398e]/5 p-5 sm:p-6">
          <form onSubmit={handleSearchSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-11 gap-3 items-end">
              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#34398e]" /> From
                </label>
                <select value={origin} onChange={(e) => setOrigin(e.target.value)} className={selectCls}>
                  {KENYAN_CITIES.map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-1 flex justify-center pb-0.5">
                <button
                  type="button"
                  onClick={handleSwap}
                  className="w-10 h-10 rounded-xl bg-[#34398e]/5 hover:bg-[#34398e]/10 text-[#34398e] flex items-center justify-center border border-[#34398e]/20 transition-colors cursor-pointer"
                  aria-label="Swap cities"
                >
                  <ArrowRightLeft className="w-4 h-4" />
                </button>
              </div>

              <div className="md:col-span-3 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-[#34398e]" /> To
                </label>
                <select value={destination} onChange={(e) => setDestination(e.target.value)} className={selectCls}>
                  {KENYAN_CITIES.filter((c) => c !== origin).map((city) => (
                    <option key={city} value={city}>{city}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-[#34398e]" /> Date
                </label>
                <input
                  type="date"
                  value={travelDate}
                  min="2026-10-01"
                  onChange={(e) => setTravelDate(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl py-2.5 px-3.5 text-sm font-bold text-slate-900 focus:outline-none focus:border-[#34398e] focus:ring-2 focus:ring-[#34398e]/20 cursor-pointer"
                />
              </div>

              <div className="md:col-span-2 space-y-1.5">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-[#34398e]" /> Seats
                </label>
                <select value={passengers} onChange={(e) => setPassengers(Number(e.target.value))} className={selectCls}>
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                className="w-full flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-[#e52421] hover:bg-[#c11e1c] text-white font-bold text-sm shadow-md transition-colors cursor-pointer"
              >
                <Search className="w-4 h-4" />
                <span>Search Buses</span>
              </button>
            </div>
          </form>
        </div>

        {/* Popular routes */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-slate-500 font-bold text-xs">Popular:</span>
          {topCorridors.map((c) => (
            <button
              key={`${c.from}-${c.to}`}
              onClick={() => { setOrigin(c.from); setDestination(c.to); onSelectRouteQuick(c.from, c.to); }}
              className="px-3 py-1.5 rounded-full bg-white text-slate-700 hover:text-[#34398e] border border-slate-300 text-xs font-bold transition-colors cursor-pointer"
            >
              {c.from} → {c.to}
            </button>
          ))}
        </div>

        {/* Benefits with official icons */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-3">
          {BENEFITS.map((b) => (
            <div key={b.title} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
              <img src={b.img} alt={b.title} className="w-10 h-10 mx-auto object-contain" loading="lazy" />
              <h4 className="text-sm font-black text-slate-900 mt-2">{b.title}</h4>
              <p className="text-xs text-slate-500">{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export interface BusSchedule {
  id: string;
  busNumber: string;
  coachName: string;
  coachType: 'VIP 2x1 Recliner' | 'Executive Luxury 2x2' | 'First Class Sleeper';
  /** Optional photo of the coach type. Falls back to a branded placeholder when missing. */
  coachImage?: string;
  origin: string;
  destination: string;
  departureTime: string;
  arrivalTime: string;
  duration: string;
  regularPrice: number;
  vipPrice: number;
  totalSeats: number;
  availableSeats: number;
  amenities: string[];
  pickupPoints: string[];
  dropoffPoints: string[];
  departureDate: string;
  liveStatus: string;
  rating: number;
}

export type TimeOfDay = 'Morning' | 'Afternoon' | 'Night';

/**
 * Groups a departure time such as "06:30 AM" into a Morning / Afternoon / Night
 * bucket, so the coach board can be narrowed with one filter instead of a long
 * list of unfiltered cards.
 */
export function getTimeOfDayCategory(departureTime: string): TimeOfDay {
  const match = departureTime.match(/(\d{1,2})(?::(\d{2}))?\s*(AM|PM)/i);
  if (!match) return 'Morning';
  let hour = parseInt(match[1], 10);
  const meridiem = match[3].toUpperCase();
  if (meridiem === 'PM' && hour !== 12) hour += 12;
  if (meridiem === 'AM' && hour === 12) hour = 0;
  if (hour < 12) return 'Morning';
  if (hour < 17) return 'Afternoon';
  return 'Night';
}

export interface RouteDetail {
  id: string;
  from: string;
  to: string;
  region: 'Inter-City' | 'Western Kenya' | 'Rift Valley' | 'Coast';
  distanceKm: number;
  estimatedHours: string;
  dailyDepartures: number;
  standardFare: number;
  vipFare: number;
  popularPickup: string;
  popularDropoff: string;
  nextDeparture: string;
  highlight: string;
}

export interface OfficeLocation {
  city: string;
  stationName: string;
  address: string;
  phone: string;
  whatsapp: string;
  operatingHours: string;
}

export interface BookingTicket {
  ticketId: string;
  bookingRef: string;
  busScheduleId: string;
  coachName: string;
  busNumber: string;
  coachType: string;
  origin: string;
  destination: string;
  departureDate: string;
  departureTime: string;
  arrivalTime: string;
  pickupPoint: string;
  dropoffPoint: string;
  seats: string[];
  passengerName: string;
  passengerPhone: string;
  passengerEmail: string;
  idNumber: string;
  totalAmount: number;
  paymentMethod: 'M-PESA' | 'WhatsApp Booking Desk' | 'Card';
  paymentStatus: 'PAID' | 'PENDING' | 'RESERVED';
  mpesaReceiptNo?: string;
  bookedAt: string;
}

export const KENYAN_CITIES = [
  'Nairobi',
  'Mombasa',
  'Kisumu',
  'Nakuru',
  'Kisii',
  'Busia',
  'Narok',
  'Oyugis',
  'Keroka',
  'Kendu Bay',
  'Homabay',
  'Luanda',
  'Yala',
  'Butere',
  'Malindi',
  'Kilifi'
];

export const DEFAULT_WHATSAPP_NUMBER = '254788256042';
export const DISPLAY_WHATSAPP_NUMBER = '+254 788 256 042';
/** Click-to-call link, derived from the one contact number so it can't drift. */
export const TEL_LINK = `tel:+${DEFAULT_WHATSAPP_NUMBER}`;

/**
 * Coach photography keyed by coach type.
 *
 * Set these to your own licensed product shots before going live. The photos
 * referenced here must be ones Dreamline has the right to publish — the three
 * Wikimedia Commons files considered during prototyping were rejected because
 * Wikimedia's robot policy forbids automated download of their media, and the
 * CC BY / CC BY-SA licences would additionally require visible attribution.
 *
 * Leaving an entry undefined renders a branded placeholder instead of a broken
 * image, so the UI is safe to deploy either way.
 */
export const COACH_IMAGES: Partial<Record<BusSchedule['coachType'], string>> = {
  // 'VIP 2x1 Recliner': '/coaches/vip-2x1-recliner.jpg',
  // 'Executive Luxury 2x2': '/coaches/executive-2x2.jpg',
  // 'First Class Sleeper': '/coaches/first-class-sleeper.jpg'
};

/** Short badge text shown on the placeholder when no photo is configured. */
export const COACH_TYPE_BADGE: Record<BusSchedule['coachType'], string> = {
  'VIP 2x1 Recliner': '2+1',
  'Executive Luxury 2x2': '2+2',
  'First Class Sleeper': 'Sleeper'
};

export function coachImageFor(coachType: BusSchedule['coachType']): string | undefined {
  return COACH_IMAGES[coachType];
}

export const POPULAR_ROUTES: RouteDetail[] = [
  {
    id: 'nbo-msa',
    from: 'Nairobi',
    to: 'Mombasa',
    region: 'Inter-City',
    distanceKm: 485,
    estimatedHours: '7h 30m',
    dailyDepartures: 8,
    standardFare: 1400,
    vipFare: 2200,
    popularPickup: 'River Road Main Terminal / South C',
    popularDropoff: 'Mwembe Tayari / Nyali',
    nextDeparture: '06:00 AM & 10:30 AM',
    highlight: 'Scenic highway travel with VIP recliner luxury & high-speed Wi-Fi'
  },
  {
    id: 'msa-nbo',
    from: 'Mombasa',
    to: 'Nairobi',
    region: 'Inter-City',
    distanceKm: 485,
    estimatedHours: '7h 30m',
    dailyDepartures: 8,
    standardFare: 1400,
    vipFare: 2200,
    popularPickup: 'Mwembe Tayari Dreamline Offices',
    popularDropoff: 'River Road / OTC Terminal',
    nextDeparture: '07:00 AM & 09:30 PM',
    highlight: 'Overnight & morning luxury cruise across the Tsavo plains'
  },
  {
    id: 'nbo-ksm',
    from: 'Nairobi',
    to: 'Kisumu',
    region: 'Western Kenya',
    distanceKm: 350,
    estimatedHours: '6h 15m',
    dailyDepartures: 6,
    standardFare: 1300,
    vipFare: 1900,
    popularPickup: 'River Road / Naivasha Road Stage',
    popularDropoff: 'Patel Flats Stage / Kisumu Bus Park',
    nextDeparture: '08:00 AM & 02:00 PM',
    highlight: 'Smooth ride through Rift Valley via Kericho tea country'
  },
  {
    id: 'nbo-nkr',
    from: 'Nairobi',
    to: 'Nakuru',
    region: 'Rift Valley',
    distanceKm: 160,
    estimatedHours: '2h 45m',
    dailyDepartures: 12,
    standardFare: 700,
    vipFare: 1000,
    popularPickup: 'River Road Terminal',
    popularDropoff: 'Nakuru Posta / Free Area Stage',
    nextDeparture: 'Hourly departures from 06:00 AM',
    highlight: 'Quick frequent shuttles with onboard AC & charging ports'
  },
  {
    id: 'nbo-ksi',
    from: 'Nairobi',
    to: 'Kisii',
    region: 'Western Kenya',
    distanceKm: 310,
    estimatedHours: '5h 45m',
    dailyDepartures: 5,
    standardFare: 1200,
    vipFare: 1750,
    popularPickup: 'River Road / South B Shell',
    popularDropoff: 'Kisii Town Main Terminus',
    nextDeparture: '07:30 AM & 09:00 PM',
    highlight: 'Direct route via Narok & Bomet highlands with experienced drivers'
  },
  {
    id: 'nbo-bsa',
    from: 'Nairobi',
    to: 'Busia',
    region: 'Western Kenya',
    distanceKm: 440,
    estimatedHours: '8h 00m',
    dailyDepartures: 4,
    standardFare: 1500,
    vipFare: 2100,
    popularPickup: 'River Road Main Terminal',
    popularDropoff: 'Busia Border Stage',
    nextDeparture: '07:00 AM & 08:30 PM',
    highlight: 'Cross-country express serving Luanda, Yala, Butere & Busia border'
  },
  {
    id: 'nbo-nrk',
    from: 'Nairobi',
    to: 'Narok',
    region: 'Rift Valley',
    distanceKm: 140,
    estimatedHours: '2h 30m',
    dailyDepartures: 6,
    standardFare: 650,
    vipFare: 950,
    popularPickup: 'River Road OTC',
    popularDropoff: 'Narok Town Center',
    nextDeparture: '07:00 AM & 11:00 AM',
    highlight: 'Direct gateway to Maasai Mara region and southern Rift Valley'
  },
  {
    id: 'nbo-hmb',
    from: 'Nairobi',
    to: 'Homabay',
    region: 'Western Kenya',
    distanceKm: 375,
    estimatedHours: '6h 45m',
    dailyDepartures: 4,
    standardFare: 1350,
    vipFare: 1950,
    popularPickup: 'River Road Main Terminal',
    popularDropoff: 'Homabay Pier / Bus Park',
    nextDeparture: '07:15 AM & 08:45 PM',
    highlight: 'Lake Victoria South Shore express connecting Oyugis & Kendu Bay'
  },
  {
    id: 'msa-mld',
    from: 'Mombasa',
    to: 'Malindi',
    region: 'Coast',
    distanceKm: 120,
    estimatedHours: '2h 15m',
    dailyDepartures: 7,
    standardFare: 600,
    vipFare: 900,
    popularPickup: 'Mwembe Tayari / Nyali Bridge',
    popularDropoff: 'Malindi Airport / Town Stage',
    nextDeparture: '08:00 AM & 01:00 PM',
    highlight: 'Breezy coastal executive shuttle stopping at Kilifi'
  }
];

export const SAMPLE_SCHEDULES: BusSchedule[] = [
  {
    id: 'sch-001',
    busNumber: 'KDB 892M',
    coachName: 'Dreamline Royal Star VIP',
    coachType: 'VIP 2x1 Recliner',
    origin: 'Nairobi',
    destination: 'Mombasa',
    departureTime: '06:00 AM',
    arrivalTime: '01:30 PM',
    duration: '7h 30m',
    regularPrice: 1500,
    vipPrice: 2200,
    totalSeats: 37,
    availableSeats: 6,
    amenities: ['2x1 Ultra Recliners', 'Free High-Speed Wi-Fi', 'USB Fast Ports', 'Safety GPS Tracking', 'Bottled Mineral Water', 'AC Climate Control'],
    pickupPoints: ['River Road Terminal (05:30 AM)', 'South C Caltex (05:45 AM)', 'JKIA Turnoff (06:10 AM)'],
    dropoffPoints: ['Voi Junction', 'Mwembe Tayari Terminal', 'Nyali Cinemax', 'Bamburi'],
    departureDate: 'Today',
    liveStatus: 'Boarding Gate Open at River Road',
    rating: 4.9
  },
  {
    id: 'sch-002',
    busNumber: 'KCR 419P',
    coachName: 'Dreamline Executive Cruiser',
    coachType: 'Executive Luxury 2x2',
    origin: 'Nairobi',
    destination: 'Mombasa',
    departureTime: '10:30 AM',
    arrivalTime: '06:00 PM',
    duration: '7h 30m',
    regularPrice: 1400,
    vipPrice: 2000,
    totalSeats: 45,
    availableSeats: 14,
    amenities: ['Ergonomic Recliners', 'Free Wi-Fi', 'Audio/Video Entertainment', 'USB Charging', 'Live Speed Tracking'],
    pickupPoints: ['River Road Terminal (10:00 AM)', 'Syokimau Gateway (10:45 AM)'],
    dropoffPoints: ['Mtito Andei', 'Mwembe Tayari Terminal'],
    departureDate: 'Today',
    liveStatus: 'Scheduled On Time',
    rating: 4.8
  },
  {
    id: 'sch-003',
    busNumber: 'KDD 104X',
    coachName: 'Dreamline Night Falcon Sleeper',
    coachType: 'First Class Sleeper',
    origin: 'Nairobi',
    destination: 'Mombasa',
    departureTime: '10:00 PM',
    arrivalTime: '05:30 AM',
    duration: '7h 30m',
    regularPrice: 1600,
    vipPrice: 2500,
    totalSeats: 33,
    availableSeats: 4,
    amenities: ['Full Sleeper Berth', 'Reading Lamp', 'Free Wi-Fi', 'Charging Socket', 'Warm Blanket & Water', 'Security Guard on-board'],
    pickupPoints: ['River Road Terminal (09:30 PM)', 'Capital Centre Mombasa Rd (10:15 PM)'],
    dropoffPoints: ['Mwembe Tayari Terminal', 'Likoni Ferry Stage'],
    departureDate: 'Today',
    liveStatus: 'Few Seats Left (High Demand)',
    rating: 5.0
  },
  {
    id: 'sch-004',
    busNumber: 'KCS 612T',
    coachName: 'Dreamline Rift Express',
    coachType: 'Executive Luxury 2x2',
    origin: 'Nairobi',
    destination: 'Nakuru',
    departureTime: '07:30 AM',
    arrivalTime: '10:15 AM',
    duration: '2h 45m',
    regularPrice: 700,
    vipPrice: 1000,
    totalSeats: 41,
    availableSeats: 19,
    amenities: ['Comfort Recliners', 'Free Wi-Fi', 'Fast USB Ports', 'Professional Driver'],
    pickupPoints: ['River Road Terminal (07:00 AM)', 'Westlands Stage (07:45 AM)'],
    dropoffPoints: ['Naivasha Flyover', 'Nakuru Posta Terminal'],
    departureDate: 'Today',
    liveStatus: 'Ready for Boarding',
    rating: 4.7
  },
  {
    id: 'sch-005',
    busNumber: 'KDB 308J',
    coachName: 'Dreamline Western Monarch',
    coachType: 'VIP 2x1 Recliner',
    origin: 'Nairobi',
    destination: 'Kisumu',
    departureTime: '08:00 AM',
    arrivalTime: '02:15 PM',
    duration: '6h 15m',
    regularPrice: 1300,
    vipPrice: 1900,
    totalSeats: 37,
    availableSeats: 8,
    amenities: ['VIP 2x1 Layout', 'Free Wi-Fi', 'AC', 'Entertainment Screens', 'Complimentary Snack & Water'],
    pickupPoints: ['River Road Terminal (07:30 AM)', 'Uthiru Stage (08:15 AM)'],
    dropoffPoints: ['Kericho Green Square', 'Ahero Junction', 'Patel Flats Stage Kisumu'],
    departureDate: 'Today',
    liveStatus: 'Scheduled On Time',
    rating: 4.9
  },
  {
    id: 'sch-006',
    busNumber: 'KDA 771L',
    coachName: 'Dreamline Highlands VIP',
    coachType: 'VIP 2x1 Recliner',
    origin: 'Nairobi',
    destination: 'Kisii',
    departureTime: '07:30 AM',
    arrivalTime: '01:15 PM',
    duration: '5h 45m',
    regularPrice: 1200,
    vipPrice: 1750,
    totalSeats: 37,
    availableSeats: 5,
    amenities: ['VIP Reclining Comfort', 'GPS Speed Monitored', 'Free Wi-Fi', 'USB Charging'],
    pickupPoints: ['River Road Terminal (07:00 AM)', 'Dagoretti Corner (07:45 AM)'],
    dropoffPoints: ['Narok Town', 'Bomet Stage', 'Kisii Main Terminus'],
    departureDate: 'Today',
    liveStatus: 'Boarding Commencing',
    rating: 4.8
  },
  {
    id: 'sch-007',
    busNumber: 'KDB 955R',
    coachName: 'Dreamline Border Eagle',
    coachType: 'Executive Luxury 2x2',
    origin: 'Nairobi',
    destination: 'Busia',
    departureTime: '07:00 AM',
    arrivalTime: '03:00 PM',
    duration: '8h 00m',
    regularPrice: 1500,
    vipPrice: 2100,
    totalSeats: 45,
    availableSeats: 11,
    amenities: ['Reclining Seats', 'Wi-Fi', 'Luggage Compartment', 'Air Suspension'],
    pickupPoints: ['River Road Terminal (06:30 AM)'],
    dropoffPoints: ['Luanda', 'Yala', 'Butere', 'Busia Custom Post'],
    departureDate: 'Today',
    liveStatus: 'Scheduled On Time',
    rating: 4.8
  },
  {
    id: 'sch-008',
    busNumber: 'KCR 902E',
    coachName: 'Dreamline Coastal Breeze',
    origin: 'Mombasa',
    destination: 'Nairobi',
    coachType: 'VIP 2x1 Recliner',
    departureTime: '08:30 AM',
    arrivalTime: '04:00 PM',
    duration: '7h 30m',
    regularPrice: 1500,
    vipPrice: 2200,
    totalSeats: 37,
    availableSeats: 7,
    amenities: ['2x1 Plush Recliner', 'Free Wi-Fi', 'Bottled Water', 'AC', 'GPS Monitored'],
    pickupPoints: ['Mwembe Tayari (08:00 AM)', 'Changamwe (08:45 AM)'],
    dropoffPoints: ['Machakos Junction', 'Nairobi River Road'],
    departureDate: 'Today',
    liveStatus: 'Scheduled On Time',
    rating: 4.9
  }
];

export const OFFICE_LOCATIONS: OfficeLocation[] = [
  {
    city: 'Nairobi',
    stationName: 'River Road Main Booking Terminal',
    address: 'Dreamline Plaza, River Road opposite Accra Road Junction, Nairobi CBD',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '24 Hours Daily'
  },
  {
    city: 'Mombasa',
    stationName: 'Mwembe Tayari Executive Terminal',
    address: 'Kenyatta Avenue, Near Mwembe Tayari Roundabout, Mombasa Island',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '05:00 AM - 11:00 PM Daily'
  },
  {
    city: 'Kisumu',
    stationName: 'Patel Flats Booking Office',
    address: 'Oginga Odinga Street, Patel Flats Complex, Kisumu City',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '06:00 AM - 10:00 PM'
  },
  {
    city: 'Nakuru',
    stationName: 'Nakuru Posta Booking Center',
    address: 'Geoffrey Kamau Way, Next to General Post Office, Nakuru',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '06:00 AM - 09:30 PM'
  },
  {
    city: 'Kisii',
    stationName: 'Kisii Central Terminus',
    address: 'Hospital Road, Behind Main Bus Park, Kisii Town',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '06:00 AM - 09:00 PM'
  },
  {
    city: 'Busia',
    stationName: 'Busia Customs Terminal',
    address: 'Customs Road, Near One-Stop Border Post, Busia',
    phone: DISPLAY_WHATSAPP_NUMBER,
    whatsapp: DEFAULT_WHATSAPP_NUMBER,
    operatingHours: '06:30 AM - 08:30 PM'
  }
];

export const DEMO_TICKETS: BookingTicket[] = [
  {
    ticketId: 'TKT-89204',
    bookingRef: 'DL-89204-KE',
    busScheduleId: 'sch-001',
    coachName: 'Dreamline Royal Star VIP',
    busNumber: 'KDB 892M',
    coachType: 'VIP 2x1 Recliner',
    origin: 'Nairobi',
    destination: 'Mombasa',
    departureDate: 'Today',
    departureTime: '06:00 AM',
    arrivalTime: '01:30 PM',
    pickupPoint: 'River Road Terminal (05:30 AM)',
    dropoffPoint: 'Mwembe Tayari Terminal',
    seats: ['A2 (VIP Single)'],
    passengerName: 'Kennedy Mwangi',
    passengerPhone: DISPLAY_WHATSAPP_NUMBER,
    passengerEmail: 'kmwangi@example.com',
    idNumber: '29841203',
    totalAmount: 2200,
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    mpesaReceiptNo: 'QDJ7829KLM',
    bookedAt: '2026-10-01 07:14 AM'
  },
  {
    ticketId: 'TKT-55192',
    bookingRef: 'DL-55192-KE',
    busScheduleId: 'sch-005',
    coachName: 'Dreamline Western Monarch',
    busNumber: 'KDB 308J',
    coachType: 'VIP 2x1 Recliner',
    origin: 'Nairobi',
    destination: 'Kisumu',
    departureDate: 'Tomorrow',
    departureTime: '08:00 AM',
    arrivalTime: '02:15 PM',
    pickupPoint: 'River Road Terminal (07:30 AM)',
    dropoffPoint: 'Patel Flats Stage Kisumu',
    seats: ['B1', 'B2'],
    passengerName: 'Amina Hassan',
    passengerPhone: DISPLAY_WHATSAPP_NUMBER,
    passengerEmail: 'amina.h@example.com',
    idNumber: '31289401',
    totalAmount: 3800,
    paymentMethod: 'M-PESA',
    paymentStatus: 'PAID',
    mpesaReceiptNo: 'QEK9940ZXP',
    bookedAt: '2026-10-01 08:30 AM'
  }
];

export function buildWhatsAppLink(phone: string, message: string): string {
  const cleanPhone = phone.replace(/[^0-9]/g, '');
  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}

import React, { useState, useEffect } from 'react';
import {
  X,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  ArrowRight
} from 'lucide-react';
import { BusSchedule } from '../data/dreamlineData';

interface MpesaModalProps {
  bookingData: {
    bus: BusSchedule;
    seats: string[];
    passengerName: string;
    passengerPhone: string;
    passengerEmail: string;
    idNumber: string;
    pickupPoint: string;
    dropoffPoint: string;
    totalAmount: number;
  } | null;
  onClose: () => void;
  onPaymentSuccess: (receiptData: {
    bookingRef: string;
    mpesaReceipt: string;
    paidAt: string;
  }) => void;
}

export const MpesaModal: React.FC<MpesaModalProps> = ({
  bookingData,
  onClose,
  onPaymentSuccess
}) => {
  if (!bookingData) return null;

  const [phone, setPhone] = useState(bookingData.passengerPhone);
  const [status, setStatus] = useState<'idle' | 'sending' | 'prompt_sent' | 'success'>('idle');
  const [countdown, setCountdown] = useState(12);

  // Generate random Kenyan M-Pesa receipt format e.g. QEK849201L
  const generateMpesaCode = () => {
    const letters = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
    const l1 = letters[Math.floor(Math.random() * letters.length)];
    const l2 = letters[Math.floor(Math.random() * letters.length)];
    const l3 = letters[Math.floor(Math.random() * letters.length)];
    const num = Math.floor(100000 + Math.random() * 900000);
    return `Q${l1}${l2}${num}${l3}`;
  };

  const handleSendSTK = () => {
    setStatus('sending');
    setTimeout(() => {
      setStatus('prompt_sent');
      setCountdown(10);
    }, 1200);
  };

  useEffect(() => {
    let timer: any;
    if (status === 'prompt_sent' && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (status === 'prompt_sent' && countdown === 0) {
      // Auto confirm for seamless test
      handleConfirmPayment();
    }
    return () => clearTimeout(timer);
  }, [status, countdown]);

  const handleConfirmPayment = () => {
    setStatus('success');
    const code = generateMpesaCode();
    const ref = `DL-${Math.floor(10000 + Math.random() * 90000)}-KE`;
    setTimeout(() => {
      onPaymentSuccess({
        bookingRef: ref,
        mpesaReceipt: code,
        paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full text-slate-900 shadow-2xl overflow-hidden animate-in fade-in duration-200">
        
        {/* M-PESA Header */}
        <div className="bg-[#008000] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#008000] font-black text-lg shadow-md">
              M
            </div>
            <div>
              <h3 className="font-extrabold text-base tracking-tight">
                M-PESA Express Checkout
              </h3>
              <p className="text-xs text-emerald-100">
                Safaricom STK Push • Paybill 522123
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-emerald-100 hover:text-white hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          {/* Order Summary */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Merchant:</span>
              <span className="font-bold text-slate-900">DREAMLINE BUS SERVICES LTD</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Journey:</span>
              <span className="font-semibold text-slate-900">
                {bookingData.bus.origin} → {bookingData.bus.destination}
              </span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Seats Selected:</span>
              <span className="font-mono font-bold text-slate-900">
                {bookingData.seats.join(', ')}
              </span>
            </div>
            <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
              <span className="font-bold text-slate-900">Total Amount:</span>
              <span className="text-lg font-black text-[#008000] font-mono">
                KSh {bookingData.totalAmount.toLocaleString()}
              </span>
            </div>
          </div>

          {/* STATES */}
          {status === 'idle' && (
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Confirm Safaricom Phone Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  An automatic STK prompt will appear on this handset to input your secret M-Pesa PIN.
                </p>
              </div>

              <button
                type="button"
                onClick={handleSendSTK}
                className="w-full py-3.5 px-4 rounded-xl bg-[#008000] hover:bg-[#007000] active:bg-[#006000] text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-emerald-950/20 transition-all cursor-pointer"
              >
                <span>Send M-Pesa STK Push Prompt</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {status === 'sending' && (
            <div className="py-8 text-center space-y-3">
              <Loader2 className="w-10 h-10 text-[#008000] animate-spin mx-auto" />
              <p className="text-sm font-bold text-slate-800">
                Initiating Safaricom STK Push...
              </p>
              <p className="text-xs text-slate-500">
                Contacting M-Pesa gateway for phone {phone}
              </p>
            </div>
          )}

          {status === 'prompt_sent' && (
            <div className="py-4 space-y-4 text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-[#008000] flex items-center justify-center mx-auto animate-pulse">
                <Smartphone className="w-7 h-7" />
              </div>

              <div className="space-y-1">
                <h4 className="font-extrabold text-slate-900 text-sm">
                  STK Push Sent to Your Phone!
                </h4>
                <p className="text-xs text-slate-600 max-w-xs mx-auto">
                  Please unlock your phone <span className="font-bold font-mono">{phone}</span> and enter your secret M-Pesa PIN for KSh {bookingData.totalAmount.toLocaleString()}.
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono">
                Listening for Safaricom confirmation... ({countdown}s)
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={handleConfirmPayment}
                  className="px-4 py-2 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-colors cursor-pointer"
                >
                  Simulate PIN Entered (Instant Confirm)
                </button>
              </div>
            </div>
          )}

          {status === 'success' && (
            <div className="py-6 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-[#008000] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="font-extrabold text-slate-900 text-base">
                Payment Authorized Successfully!
              </h4>
              <p className="text-xs text-slate-500">
                Generating your official Dreamline e-Ticket and boarding pass...
              </p>
            </div>
          )}

          {/* Safaricom security footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008000]" />
            <span>256-bit Encrypted Safaricom Daraja API</span>
          </div>
        </div>

      </div>
    </div>
  );
};

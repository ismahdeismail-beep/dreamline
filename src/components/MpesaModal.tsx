import React, { useEffect, useRef, useState } from 'react';
import { useModalA11y } from '../hooks/useModalA11y';
import {
  X,
  Smartphone,
  CheckCircle2,
  Loader2,
  ShieldCheck,
  AlertCircle,
  ArrowRight,
} from 'lucide-react';
import {
  BusSchedule,
  DEFAULT_WHATSAPP_NUMBER,
  buildWhatsAppLink,
} from '../data/dreamlineData';

interface MpesaModalProps {
  // Non-nullable: App renders this component only when a checkout is pending.
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
  };
  onClose: () => void;
  onPaymentSuccess: (receiptData: {
    bookingRef: string;
    mpesaReceipt: string;
    paidAt: string;
  }) => void;
}

type Status = 'idle' | 'sending' | 'prompt_sent' | 'success' | 'error';

/** 07XX / 01XX / 7XX → 254XXXXXXXXX, the format Daraja requires. */
function toMsisdn(raw: string): string {
  const digits = raw.replace(/\D/g, '');
  if (digits.startsWith('254')) return digits;
  if (digits.startsWith('0')) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

const POLL_INTERVAL_MS = 3000;
const MAX_POLLS = 20; // ~60s, then we stop waiting on Safaricom

/**
 * M-PESA Express (STK push) checkout.
 *
 * Talks to the `api/mpesa.js` server function: it holds the Daraja credentials
 * (never shipped to the browser), initiates the push and answers status polls
 * with the Daraja STK-query API. Nothing is confirmed client-side — a ticket is
 * only issued when Safaricom reports the payment as successful.
 */
export const MpesaModal: React.FC<MpesaModalProps> = ({
  bookingData,
  onClose,
  onPaymentSuccess,
}) => {
  // Mounted only while a checkout is in flight, so it is always "open".
  const dialogRef = useModalA11y<HTMLDivElement>(true, onClose);

  const [phone, setPhone] = useState(bookingData.passengerPhone);
  const [status, setStatus] = useState<Status>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
  // One reference per checkout, stable across retries of the same payment.
  const [bookingRef] = useState(
    () => `DL-${Math.floor(10000 + Math.random() * 90000)}-KE`
  );

  const polls = useRef(0);
  const finished = useRef(false);

  const describeError = (message: string) => {
    setErrorMsg(message);
    setStatus('error');
  };

  const handleSendSTK = async () => {
    const msisdn = toMsisdn(phone);
    if (msisdn.length !== 12 || !msisdn.startsWith('254')) {
      setErrorMsg('Enter a Safaricom number like 0712 345 678.');
      return;
    }

    setStatus('sending');
    setErrorMsg('');

    try {
      const response = await fetch('/api/mpesa', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'stkpush',
          phone: msisdn,
          amount: Math.max(1, Math.round(bookingData.totalAmount)),
          reference: bookingRef,
          description: `Dreamline ${bookingData.bus.origin}-${bookingData.bus.destination}`,
        }),
      });
      const data: { ok?: boolean; error?: string; checkoutRequestId?: string } =
        await response.json().catch(() => ({}));

      if (!response.ok || !data.ok || !data.checkoutRequestId) {
        if (data.error?.includes('not configured') || response.status === 501) {
          describeError(
            'M-PESA checkout is not configured yet. Set the Daraja credentials, or reserve on WhatsApp instead.'
          );
        } else {
          describeError(data.error || 'The payment prompt could not be sent. Please try again.');
        }
        return;
      }

      polls.current = 0;
      setCheckoutRequestId(data.checkoutRequestId);
      setStatus('prompt_sent');
    } catch {
      describeError('Could not reach the payment service. Check your connection and try again.');
    }
  };

  // Poll the server for Safaricom's verdict on this push.
  useEffect(() => {
    if (status !== 'prompt_sent' || !checkoutRequestId) return;

    let cancelled = false;
    let timer: ReturnType<typeof setTimeout>;

    const poll = async () => {
      try {
        const response = await fetch('/api/mpesa', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'query', checkoutRequestId }),
        });
        const data: {
          ok?: boolean;
          state?: 'pending' | 'success' | 'failed';
          mpesaReceipt?: string;
          error?: string;
        } = await response.json().catch(() => ({}));

        if (cancelled || finished.current) return;

        if (data.state === 'success' && data.mpesaReceipt) {
          finished.current = true;
          setStatus('success');
          setTimeout(() => {
            onPaymentSuccess({
              bookingRef,
              mpesaReceipt: data.mpesaReceipt as string,
              paidAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            });
          }, 1200);
          return;
        }
        if (data.state === 'failed') {
          finished.current = true;
          describeError(
            data.error || 'The M-PESA payment was not completed. No money was deducted.'
          );
          return;
        }
      } catch {
        // Transient network blip — keep polling until the budget runs out.
      }

      polls.current += 1;
      if (polls.current >= MAX_POLLS) {
        finished.current = true;
        describeError(
          'Safaricom has not confirmed the payment yet. If you entered your PIN, the ticket will be confirmed on WhatsApp — quote this reference: ' +
            bookingRef
        );
        return;
      }
      timer = setTimeout(poll, POLL_INTERVAL_MS);
    };

    timer = setTimeout(poll, POLL_INTERVAL_MS);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [status, checkoutRequestId, bookingRef, onPaymentSuccess]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="mpesa-modal-title"
        tabIndex={-1}
        className="bg-white rounded-3xl max-w-md w-full text-slate-900 shadow-2xl overflow-hidden animate-in fade-in duration-200"
      >
        {/* M-PESA Header */}
        <div className="bg-[#008000] text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-[#008000] font-black text-lg shadow-md">
              M
            </div>
            <div>
              <h3 id="mpesa-modal-title" className="font-extrabold text-base tracking-tight">
                M-PESA Express Checkout
              </h3>
              <p className="text-xs text-emerald-100">
                Safaricom STK Push • Ref {bookingRef}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close checkout"
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
              <span>Seats:</span>
              <span className="font-mono font-bold text-slate-900">
                {bookingData.seats.length ? bookingData.seats.join(', ') : 'Desk assigned'}
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
              <img
                src="/brand/wallet.webp"
                alt=""
                aria-hidden="true"
                className="w-14 h-14 mx-auto object-contain drop-shadow"
              />
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5" htmlFor="mpesa-phone">
                  Confirm Safaricom Phone Number:
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    id="mpesa-phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="0712 345 678"
                    className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-300 rounded-xl text-base sm:text-sm font-mono font-bold text-slate-900 focus:outline-none focus:border-[#008000] focus:ring-1 focus:ring-[#008000]"
                  />
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  An STK prompt will appear on this handset — enter your secret M-PESA PIN to
                  pay KSh {bookingData.totalAmount.toLocaleString()}.
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
              <p className="text-xs text-slate-500">Contacting M-Pesa gateway for {phone}</p>
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
                  Unlock <span className="font-bold font-mono">{phone}</span> and enter your
                  M-PESA PIN for KSh {bookingData.totalAmount.toLocaleString()}.
                </p>
              </div>

              <div className="text-xs text-slate-400 font-mono flex items-center justify-center gap-2">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                Waiting for Safaricom confirmation...
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

          {status === 'error' && (
            <div className="space-y-4">
              <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    finished.current = false;
                    setCheckoutRequestId(null);
                    setErrorMsg('');
                    setStatus('idle');
                  }}
                  className="flex-1 py-3 rounded-xl bg-[#008000] hover:bg-[#007000] text-white text-xs font-bold transition-colors cursor-pointer"
                >
                  Try again
                </button>
                <a
                  href={buildWhatsAppLink(
                    DEFAULT_WHATSAPP_NUMBER,
                    `Habari Dreamline! I hit a problem paying with M-PESA (ref ${bookingRef}) for ${bookingData.bus.origin} → ${bookingData.bus.destination}. Please help.`
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-3 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 hover:border-[#25D366] hover:text-[#128C4A] transition-colors"
                >
                  Ask the desk
                </a>
              </div>
            </div>
          )}

          {/* Safaricom security footer */}
          <div className="pt-3 border-t border-slate-100 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-[#008000]" />
            <span>Safaricom Daraja API — credentials never reach your browser</span>
          </div>
        </div>
      </div>
    </div>
  );
};

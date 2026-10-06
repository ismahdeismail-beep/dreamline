/**
 * M-PESA STK push — Safaricom Daraja.
 *
 * The single server-side endpoint in this repo. It exists because the Daraja
 * consumer secret and paybill passkey must never reach the browser: the client
 * posts here, this function talks to Safaricom, and the browser only ever sees
 * a checkout request id and, later, a payment verdict.
 *
 * Actions:
 *   GET  ?action=probe                 → { configured, environment }
 *   POST { action: 'stkpush', ... }    → { ok, checkoutRequestId }
 *   POST { action: 'query', ... }      → { ok, state, mpesaReceipt?, error? }
 *
 * Required environment variables (Vercel → Project → Settings → Environment
 * Variables). Until every one of them is set, `probe` reports `configured:false`
 * and the UI keeps its "coming soon" button:
 *   DARAJA_CONSUMER_KEY, DARAJA_CONSUMER_SECRET,
 *   DARAJA_SHORTCODE,    DARAJA_PASSKEY,
 *   DARAJA_CALLBACK_URL  (https URL Safaricom may notify; must be public)
 * Optional:
 *   DARAJA_ENV  'sandbox' (default) | 'production'
 */

const SANDBOX = 'https://sandbox.safaricom.co.ke';
const PRODUCTION = 'https://api.safaricom.co.ke';

const MISSING = ['DARAJA_CONSUMER_KEY', 'DARAJA_CONSUMER_SECRET', 'DARAJA_SHORTCODE', 'DARAJA_PASSKEY', 'DARAJA_CALLBACK_URL'];

function settings() {
  const env = process.env.DARAJA_ENV === 'production' ? 'production' : 'sandbox';
  const values = {
    consumerKey: process.env.DARAJA_CONSUMER_KEY,
    consumerSecret: process.env.DARAJA_CONSUMER_SECRET,
    shortcode: process.env.DARAJA_SHORTCODE,
    passkey: process.env.DARAJA_PASSKEY,
    callbackUrl: process.env.DARAJA_CALLBACK_URL,
  };
  const missing = MISSING.filter((name) => !process.env[name]);
  return {
    ...values,
    env,
    base: env === 'production' ? PRODUCTION : SANDBOX,
    missing,
    configured: missing.length === 0,
  };
}

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-store');
  res.end(JSON.stringify(body));
}

/** Daraja wants YYYYMMDDHHmmss in East Africa time. */
function timestamp() {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Nairobi',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).formatToParts(new Date());
  const get = (type) => parts.find((part) => part.type === type)?.value ?? '00';
  return `${get('year')}${get('month')}${get('day')}${get('hour')}${get('minute')}${get('second')}`;
}

// Daraja tokens live 3599s; cache one per warm lambda instead of buying a new
// one on every request.
let tokenCache = { token: null, expiresAt: 0 };

async function accessToken(config) {
  if (tokenCache.token && Date.now() < tokenCache.expiresAt) return tokenCache.token;

  const credentials = Buffer.from(`${config.consumerKey}:${config.consumerSecret}`).toString('base64');
  const response = await fetch(`${config.base}/oauth/v1/generate?grant_type=client_credentials`, {
    headers: { Authorization: `Basic ${credentials}` },
  });
  if (!response.ok) throw new Error(`Daraja auth failed (${response.status})`);

  const data = await response.json();
  tokenCache = {
    token: data.access_token,
    expiresAt: Date.now() + (Number(data.expires_in) || 3599) * 1000 - 30000,
  };
  return tokenCache.token;
}

function passwordFor(config, stamp) {
  return Buffer.from(`${config.shortcode}${config.passkey}${stamp}`).toString('base64');
}

async function stkPush(config, { phone, amount, reference, description }) {
  const stamp = timestamp();
  const token = await accessToken(config);
  const response = await fetch(`${config.base}/mpesa/stkpush/v1/processrequest`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: passwordFor(config, stamp),
      Timestamp: stamp,
      TransactionType: 'CustomerPayBillOnline',
      Amount: amount,
      PartyA: phone,
      PartyB: config.shortcode,
      PhoneNumber: phone,
      CallBackURL: config.callbackUrl,
      AccountReference: reference,
      TransactionDesc: description,
    }),
  });
  return { status: response.status, data: await response.json().catch(() => ({})) };
}

async function stkQuery(config, checkoutRequestId) {
  const stamp = timestamp();
  const token = await accessToken(config);
  const response = await fetch(`${config.base}/mpesa/stkpushquery/v1/query`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      BusinessShortCode: config.shortcode,
      Password: passwordFor(config, stamp),
      Timestamp: stamp,
      CheckoutRequestID: checkoutRequestId,
    }),
  });
  return { status: response.status, data: await response.json().catch(() => ({})) };
}

/** Daraja result codes we surface to a passenger in plain language. */
const RESULT_ERRORS = {
  1: 'The payment was rejected by Safaricom.',
  1032: 'The M-PESA prompt was cancelled on the handset. No money was deducted.',
  1037: 'The M-PESA prompt expired before it was entered. No money was deducted.',
  2001: 'The phone number is not registered for M-PESA.',
  1001: 'Unable to lock subscriber, a transaction is already in process for this number.',
};

function receiptFrom(data) {
  const items = data?.CallbackMetadata?.Item ?? [];
  const found = items.find((item) => item.Name === 'MpesaReceiptNumber');
  return found?.Value ?? data?.MpesaReceiptNumber ?? null;
}

export default async function handler(req, res) {
  const config = settings();

  if (req.method === 'GET') {
    send(res, 200, { configured: config.configured, environment: config.env });
    return;
  }

  if (req.method !== 'POST') {
    send(res, 405, { ok: false, error: 'Method not allowed' });
    return;
  }

  if (!config.configured) {
    send(res, 501, {
      ok: false,
      error: `M-PESA is not configured: missing ${config.missing.join(', ')}`,
    });
    return;
  }

  const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
  const action = body.action;

  try {
    if (action === 'stkpush') {
      const phone = String(body.phone ?? '');
      const amount = Math.round(Number(body.amount));
      if (!/^254\d{9}$/.test(phone)) {
        send(res, 400, { ok: false, error: 'Phone must look like 254712345678.' });
        return;
      }
      if (!Number.isFinite(amount) || amount < 1 || amount > 150000) {
        send(res, 400, { ok: false, error: 'Amount must be between KSh 1 and KSh 150,000.' });
        return;
      }

      const { status, data } = await stkPush(config, {
        phone,
        amount,
        reference: String(body.reference ?? 'DREAMLINE').slice(0, 12),
        description: String(body.description ?? 'Dreamline ticket').slice(0, 13),
      });

      if (data.CheckoutRequestID && (data.ResponseCode === '0' || status === 200)) {
        send(res, 200, { ok: true, checkoutRequestId: data.CheckoutRequestID });
        return;
      }
      send(res, 502, {
        ok: false,
        error: data.errorMessage || data.ResponseDescription || 'Safaricom rejected the request.',
      });
      return;
    }

    if (action === 'query') {
      const checkoutRequestId = String(body.checkoutRequestId ?? '');
      if (!checkoutRequestId) {
        send(res, 400, { ok: false, error: 'checkoutRequestId is required.' });
        return;
      }

      const { data } = await stkQuery(config, checkoutRequestId);
      const resultCode = data.ResultCode ?? data.resultCode;

      if (resultCode === undefined || resultCode === null || resultCode === '') {
        // Safaricom has not decided yet — the client keeps polling.
        send(res, 200, { ok: true, state: 'pending' });
        return;
      }

      if (String(resultCode) === '0') {
        send(res, 200, { ok: true, state: 'success', mpesaReceipt: receiptFrom(data) });
        return;
      }

      send(res, 200, {
        ok: true,
        state: 'failed',
        error: RESULT_ERRORS[Number(resultCode)] || data.ResultDesc || 'The payment did not complete.',
      });
      return;
    }

    send(res, 400, { ok: false, error: 'Unknown action.' });
  } catch (error) {
    send(res, 502, { ok: false, error: `Payment service error: ${error.message}` });
  }
}

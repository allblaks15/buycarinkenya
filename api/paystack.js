// Paystack webhook: https://buycarinkenya.co.ke/api/paystack (set in Paystack → Settings → API Keys & Webhooks).
// Puts a listing live even if the seller closed the browser before returning to the site.
import { createHmac, timingSafeEqual } from 'node:crypto';
import { db, paystack, settlePayment } from './_lib.js';

export async function POST(req) {
  const raw = await req.text();
  const sig = req.headers.get('x-paystack-signature') || '';
  const good = createHmac('sha512', process.env.PAYSTACK_SECRET_KEY || '').update(raw).digest('hex');
  if (!process.env.PAYSTACK_SECRET_KEY || sig.length !== good.length || !timingSafeEqual(Buffer.from(sig), Buffer.from(good))) return new Response('bad signature', { status: 401 });
  try {
    const event = JSON.parse(raw);
    if (event.event === 'charge.success' && event.data?.reference) {
      await db();
      // Re-check with Paystack rather than trusting the payload alone
      await settlePayment(await paystack(`/transaction/verify/${encodeURIComponent(event.data.reference)}`));
    }
  } catch (e) { console.error('paystack webhook', e); return new Response('error', { status: 500 }); }
  return new Response('ok');
}

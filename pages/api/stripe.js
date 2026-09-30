import Stripe from 'stripe';

import { liveClient, urlFor } from '../../lib/client';
import { CheckoutError, buildLineItems, parseCart, resolveSiteUrl } from '../../lib/checkout';
import { clientIp, createRateLimiter } from '../../lib/rateLimit';

const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

const allowCheckout = createRateLimiter({ limit: 10, windowMs: 60 * 1000 });

const PRODUCTS_QUERY = '*[_type == "product" && _id in $ids && !(_id in path("drafts.**"))]{ _id, name, price, image }';

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '8kb',
    },
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
    return;
  }

  if (!allowCheckout(clientIp(req))) {
    res.setHeader('Retry-After', '60');
    res.status(429).json({ error: 'Too many checkout attempts. Please try again shortly.' });
    return;
  }

  try {
    const siteUrl = resolveSiteUrl(req.headers, process.env.SITE_URL);
    const cart = parseCart(req.body);
    const products = await liveClient.fetch(PRODUCTS_QUERY, { ids: cart.map(({ id }) => id) });

    const params = {
      submit_type: 'pay',
      mode: 'payment',
      payment_method_types: ['card'],
      billing_address_collection: 'auto',
      shipping_options: [
        { shipping_rate: 'shr_1Kn3IaEnylLNWUqj5rqhg9oV' },
      ],
      line_items: buildLineItems(cart, products, (image) => urlFor(image).url()),
      success_url: `${siteUrl}/success`,
      cancel_url: `${siteUrl}/canceled`,
    };

    const session = await stripe.checkout.sessions.create(params);

    res.status(200).json({ id: session.id });
  } catch (err) {
    if (err instanceof CheckoutError) {
      res.status(err.statusCode).json({ error: err.message });
      return;
    }

    console.error('Failed to create checkout session', err);
    res.status(500).json({ error: 'Unable to start checkout.' });
  }
}

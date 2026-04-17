import Stripe from 'stripe';
import { z } from 'zod';
import { client } from '../../lib/client';
import { createImageUrlBuilder } from '@sanity/image-url';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2026-03-25.dahlia',
});

const builder = createImageUrlBuilder(client);

const cartItemSchema = z.object({
  name: z.string(),
  price: z.number().positive(),
  quantity: z.number().int().positive(),
  image: z.array(
    z.object({
      asset: z.object({
        _ref: z.string(),
      }),
    })
  ).min(1),
});

const cartSchema = z.array(cartItemSchema).min(1);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const result = cartSchema.safeParse(req.body);

    if (!result.success) {
      return res.status(400).json({ error: result.error.message });
    }

    try {
      const params = {
        submit_type: 'pay',
        mode: 'payment',
        payment_method_types: ['card'],
        billing_address_collection: 'auto',
        shipping_options: [
          { shipping_rate: 'shr_1Kn3IaEnylLNWUqj5rqhg9oV' },
        ],
        line_items: result.data.map((item) => {
          const imageUrl = builder.image(item.image[0].asset._ref).url();

          return {
            price_data: {
              currency: 'usd',
              product_data: {
                name: item.name,
                images: [imageUrl],
              },
              unit_amount: Math.round(item.price * 100),
            },
            adjustable_quantity: {
              enabled: true,
              minimum: 1,
            },
            quantity: item.quantity
          }
        }),
        success_url: `${req.headers.origin}/success`,
        cancel_url: `${req.headers.origin}/canceled`,
      }

      // Create Checkout Sessions from body params.
      const session = await stripe.checkout.sessions.create(params);

      res.status(200).json(session);
    } catch (err) {
      res.status(err.statusCode || 500).json({ error: err.message });
    }
  } else {
    res.setHeader('Allow', 'POST');
    res.status(405).end('Method Not Allowed');
  }
}

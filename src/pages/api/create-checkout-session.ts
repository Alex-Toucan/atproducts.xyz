export const prerender = false;

import type { APIRoute } from "astro";
import Stripe from "stripe";
import { products } from "../../data/products";

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request }) => {
  try {
    const { items } = await request.json();

    if (!Array.isArray(items) || items.length === 0) {
      return new Response(JSON.stringify({ error: "No items provided" }), { status: 400 });
    }

    const lineItems: any[] = [];

    for (const cartItem of items) {
      const product = products.find((p) => p.id === cartItem.id);
      if (!product) {
        return new Response(JSON.stringify({ error: `Invalid product ID: ${cartItem.id}` }), { status: 400 });
      }

      const quantity = cartItem.quantity ?? 1;

      if (product.type === "donation") {
        if (!cartItem.amount || cartItem.amount < 1) {
          return new Response(JSON.stringify({ error: "Donation amount missing or invalid" }), { status: 400 });
        }

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: "Donation",
              tax_code: "txcd_20030000"
            },
            unit_amount: cartItem.amount
          },
          quantity: 1
        });

        continue;
      }

      if (product.type === "one-time") {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: {
              name: product.name,
              tax_code: "txcd_20030000"
            },
            unit_amount: product.price
          },
          quantity
        });

        continue;
      }

      if (product.type === "subscription") {
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: product.price,
          recurring: {
            interval: product.interval,
            interval_count: product.interval_count ?? 1
          },
          product_data: {
            name: product.name,
            tax_code: "txcd_20030000" // digital service
          }
        });

        lineItems.push({
          price: price.id,
          quantity
        });

        continue;
      }
    }

    const hasSubscription = lineItems.some((i) => i.price);
    const mode = hasSubscription ? "subscription" : "payment";

    const isDonationOnly = items.every((i) => i.id === "donation");

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],

      ...(mode === "payment" && { customer_creation: "always" }),

      line_items: lineItems,

      automatic_tax: { enabled: true },

      ...(isDonationOnly
        ? {}
        : { allow_promotion_codes: true }),

      success_url: isDonationOnly
        ? `https://pay.atproducts.xyz/donation-success?amount=${items[0].amount}`
        : `https://pay.atproducts.xyz/success`,
      cancel_url: "https://pay.atproducts.xyz/cancel"
    });


    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });

  } catch (err: any) {
    console.error("STRIPE ERROR:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
};

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

      // -----------------------------
      // DONATION (dynamic amount)
      // -----------------------------
      if (product.type === "donation") {
        if (!cartItem.amount || cartItem.amount < 1) {
          return new Response(JSON.stringify({ error: "Donation amount missing or invalid" }), { status: 400 });
        }

        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: "Donation" },
            unit_amount: cartItem.amount
          },
          quantity: 1
        });

        continue;
      }

      // -----------------------------
      // ONE-TIME PRODUCT
      // -----------------------------
      if (product.type === "one-time") {
        lineItems.push({
          price_data: {
            currency: "usd",
            product_data: { name: product.name },
            unit_amount: product.price
          },
          quantity
        });

        continue;
      }

      // -----------------------------
      // SUBSCRIPTION PRODUCT
      // -----------------------------
      if (product.type === "subscription") {
        const price = await stripe.prices.create({
          currency: "usd",
          unit_amount: product.price,
          recurring: {
            interval: product.interval,
            interval_count: product.interval_count ?? 1
          },
          product_data: { name: product.name }
        });

        lineItems.push({
          price: price.id,
          quantity
        });

        continue;
      }
    }

    // Determine checkout mode
    const hasSubscription = lineItems.some((i) => i.price);
    const mode = hasSubscription ? "subscription" : "payment";

    const session = await stripe.checkout.sessions.create({
      mode,
      payment_method_types: ["card"],
      ...(mode === "payment" && { customer_creation: "always" }),
      line_items: lineItems,
      success_url: "http://localhost:4322/success",
      cancel_url: "http://localhost:4322/cancel"
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

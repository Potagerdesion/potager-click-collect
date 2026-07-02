const Stripe = require("stripe");
const { getStore } = require("@netlify/blobs");

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }

  let stripeEvent;
  try {
    const signature = event.headers["stripe-signature"];
    stripeEvent = stripe.webhooks.constructEvent(
      event.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("Signature webhook invalide :", err.message);
    return { statusCode: 400, body: `Webhook Error: ${err.message}` };
  }

  if (stripeEvent.type === "checkout.session.completed") {
    const session = stripeEvent.data.object;
    const cartEncoded = session.metadata?.cart || "";

    if (cartEncoded) {
      const store = getStore({
        name: "products",
        siteID: process.env.NETLIFY_SITE_ID,
        token: process.env.NETLIFY_API_TOKEN,
      });
      const products = (await store.get("list", { type: "json" })) || [];

      const cartItems = cartEncoded.split(",").filter(Boolean).map((pair) => {
        const [id, qty] = pair.split(":");
        return { id: Number(id), qty: Number(qty) };
      });

      const updated = products.map((p) => {
        const item = cartItems.find((c) => c.id === p.id);
        if (!item) return p;
        return { ...p, stock: Math.max(0, p.stock - item.qty) };
      });

      await store.setJSON("list", updated);
    }
  }

  return { statusCode: 200, body: JSON.stringify({ received: true }) };
};

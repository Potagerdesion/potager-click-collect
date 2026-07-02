const Stripe = require("stripe");
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      body: "Method Not Allowed",
    };
  }

  try {
    console.log("Mode Live :", process.env.STRIPE_SECRET_KEY.startsWith("sk_live"));

    const { amount, customerEmail, customerName, slot, items, cartItems } = JSON.parse(event.body);

    const cartEncoded = Array.isArray(cartItems)
      ? cartItems.map((i) => `${i.id}:${i.qty}`).join(",")
      : "";

    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            unit_amount: Math.round(amount * 100),
            product_data: {
              name: "Commande — Le Potager de la Colline de Sion",
              description: `Retrait : ${slot} | ${items}`,
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        cart: cartEncoded,
        customerName: customerName || "",
        slot: slot || "",
      },
      success_url: `${event.headers.origin}/success`,
      cancel_url: `${event.headers.origin}`,
    });

    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      body: JSON.stringify({
        error: err.message,
      }),
    };
  }
};

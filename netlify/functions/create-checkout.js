const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
 
exports.handler = async (event) => {
  if (event.httpMethod !== "POST") {
    return { statusCode: 405, body: "Method Not Allowed" };
  }
 
  try {
    const { amount, customerEmail, customerName, slot, items } = JSON.parse(event.body);
 
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      customer_email: customerEmail,
      line_items: [
        {
          price_data: {
            currency: "eur",
            product_data: {
              name: "Commande — Le Potager de la Colline de Sion",
              description: `Retrait : ${slot} | ${items}`,
            },
            unit_amount: Math.round(amount * 100),
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${event.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}&name=${encodeURIComponent(customerName)}&slot=${encodeURIComponent(slot)}`,
      cancel_url: `${event.headers.origin}`,
    });
 
    return {
      statusCode: 200,
      body: JSON.stringify({ url: session.url }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: error.message }),
    };
  }
};

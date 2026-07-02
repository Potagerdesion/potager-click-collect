const { getStore } = require("@netlify/blobs");

// Liste de produits utilisée uniquement au tout premier lancement,
// pour initialiser le stockage si celui-ci est encore vide.
const SEED_PRODUCTS = [
  { id: 1, name: "Courgettes", category: "Légumes", price: 0.9, stock: 15, unit: "pièce", emoji: "🥒" },
  { id: 2, name: "Courgettes rondes", category: "Légumes", price: 0.9, stock: 9, unit: "pièce", emoji: "🥒" },
  { id: 3, name: "Courgettes jaunes", category: "Légumes", price: 0.7, stock: 4, unit: "pièce", emoji: "🥒" },
  { id: 4, name: "Petite salade verte", category: "Légumes", price: 1.2, stock: 14, unit: "pièce", emoji: "🥗", desc: "Batavia, laitue, mesclun selon saison" },
  { id: 5, name: "Épinards", category: "Légumes", price: 2, stock: 1, unit: "botte", emoji: "🥬", desc: "Botte d'environ 10 branches" },
  { id: 6, name: "Poirées", category: "Légumes", price: 2, stock: 1, unit: "botte", emoji: "🥬", desc: "Botte d'environ 10 branches" },
  { id: 7, name: "Radis noirs", category: "Légumes", price: 0.85, stock: 2, unit: "pièce", emoji: "🫜" },
  { id: 8, name: "Navets", category: "Légumes", price: 0.4, stock: 5, unit: "pièce", emoji: "🫜" },
  { id: 9, name: "Petits concombres", category: "Légumes", price: 0.5, stock: 13, unit: "pièce", emoji: "🥒" },
  { id: 10, name: "Concombres ovales", category: "Légumes", price: 0.5, stock: 15, unit: "pièce", emoji: "🥒" },
  { id: 11, name: "Céléris branches", category: "Légumes", price: 2, stock: 1, unit: "botte", emoji: "🌿" },
  { id: 12, name: "Persil plat", category: "Légumes", price: 1.5, stock: 10, unit: "botte", emoji: "🌿" },
  { id: 13, name: "Petits oignons blancs", category: "Légumes", price: 1.7, stock: 2, unit: "botte", emoji: "🧅" },
];

const store = getStore({
  name: "products",
  siteID: process.env.NETLIFY_SITE_ID,
  token: process.env.NETLIFY_API_TOKEN,
});

exports.handler = async (event) => {

  if (event.httpMethod === "GET") {
    let products = await store.get("list", { type: "json" });
    if (!products) {
      products = SEED_PRODUCTS;
      await store.setJSON("list", products);
    }
    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(products),
    };
  }

  if (event.httpMethod === "POST") {
    const pin = event.headers["x-admin-pin"];
    const expectedPin = process.env.ADMIN_PIN || "1234";
    if (pin !== expectedPin) {
      return { statusCode: 401, body: JSON.stringify({ error: "PIN invalide" }) };
    }

    try {
      const products = JSON.parse(event.body);
      if (!Array.isArray(products)) throw new Error("Format invalide");
      await store.setJSON("list", products);
      return {
        statusCode: 200,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(products),
      };
    } catch (err) {
      return { statusCode: 400, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { statusCode: 405, body: "Method Not Allowed" };
};

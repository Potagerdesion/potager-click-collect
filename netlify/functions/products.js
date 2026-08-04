const { getStore } = require(“@netlify/blobs”);

// Liste de produits utilisée comme source de vérité. // Les
informations (nom, prix, unité, catégorie, emoji, description) //
proviennent toujours de cette liste. // Seul le STOCK est conservé
depuis Netlify Blobs.

const SEED_PRODUCTS = [
  { id: 1, name: "Courgettes vertes", category: "Légumes", price: 2.5, stock: 10, unit: "kg", emoji: "🥒" },
  { id: 2, name: "Courgettes rondes", category: "Légumes", price: 3, stock: 8, unit: "kg", emoji: "🥒" },
  { id: 3, name: "Courgettes jaunes", category: "Légumes", price: 2.5, stock: 2, unit: "kg", emoji: "🥒" },
  { id: 4, name: "Salades vertes", category: "Légumes", price: 1.8, stock: 0, unit: "pièce", emoji: "🥗", desc: "Batavia, laitue, mesclun selon saison" },
  { id: 5, name: "Tétragone cornue (épinard d'été)", category: "Légumes", price: 10, stock: 10, unit: "kg", emoji: "🥬" },
  { id: 20, name: "Poirées", category: "Légumes", price: 2, stock: 10, unit: "botte", emoji: "🥬" },
  { id: 6, name: "Concombres Nova", category: "Légumes", price: 0.8, stock: 6, unit: "pièce", emoji: "🥒" },
  { id: 7, name: "Moyens concombres", category: "Légumes", price: 0.8, stock: 45, unit: "pièce", emoji: "🥒" },
  { id: 8, name: "Oignons blancs", category: "Légumes", price: 1.2, stock: 10, unit: "pièce", emoji: "🧅" },
  { id: 22, name: "Oignons jaunes", category: "Légumes", price: 1.2, stock: 10, unit: "pièce", emoji: "🧅" },
  { id: 9, name: "Oignons rouges", category: "Légumes", price: 1.2, stock: 10, unit: "pièce", emoji: "🧅" },
  { id: 10, name: "Tomates petit calibre", category: "Légumes", price: 4.5, stock: 4, unit: "kg", emoji: "🍅" },
  { id: 11, name: "Tomates moyen calibre", category: "Légumes", price: 4.5, stock: 30, unit: "kg", emoji: "🍅" },
  { id: 12, name: "Tomates gros calibre", category: "Légumes", price: 4.5, stock: 4, unit: "kg", emoji: "🍅" },
  { id: 13, name: "Tomates coeur de boeuf", category: "Légumes", price: 5, stock: 2, unit: "kg", emoji: "🍅" },
  { id: 14, name: "Persil plat", category: "Autres", price: 1.5, stock: 5, unit: "botte", emoji: "🌿" },
  { id: 15, name: "Laurier feuilles", category: "Autres", price: 1, stock: 5, unit: "branche", emoji: "🌿" },
  { id: 16, name: "Estragon", category: "Autres", price: 1.5, stock: 5, unit: "bouquet", emoji: "🌿" },
  { id: 17, name: "Basilic", category: "Autres", price: 1.5, stock: 5, unit: "bouquet", emoji: "🌿" },
  { id: 18, name: "Miel de printemps de la Colline, 250g", category: "Autres", price: 5, stock: 20, unit: "pièce", emoji: "🍯" },
  { id: 19, name: "Miel de printemps de la Colline, 500g", category: "Autres", price: 9, stock: 20, unit: "pièce", emoji: "🍯" },
  { id: 21, name: "Miel de fleurs de la Colline, 500g", category: "Autres", price: 10, stock: 20, unit: "pièce", emoji: "🍯" },
];

const store = getStore({ name: “products”, siteID:
process.env.NETLIFY_SITE_ID, token: process.env.NETLIFY_API_TOKEN, });

exports.handler = async (event) => { if (event.httpMethod === “GET”) {
let products = await store.get(“list”, { type: “json” });

    if (!products) {
      products = SEED_PRODUCTS;
      await store.setJSON("list", products);
      console.log("Store initialisé avec SEED_PRODUCTS");
    } else {
      const existingById = new Map(products.map((p) => [p.id, p]));

      products = SEED_PRODUCTS.map((seed) => {
        const existing = existingById.get(seed.id);

        return {
          ...seed,
          stock: existing ? existing.stock : seed.stock,
        };
      });

      await store.setJSON("list", products);
    }

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(products),
    };

}

if (event.httpMethod === “POST”) { const pin =
event.headers[“x-admin-pin”]; const expectedPin = process.env.ADMIN_PIN
|| “1234”;

    if (pin !== expectedPin) {
      return {
        statusCode: 401,
        body: JSON.stringify({ error: "PIN invalide" }),
      };
    }

    try {
      const products = JSON.parse(event.body);

      if (!Array.isArray(products)) {
        throw new Error("Format invalide");
      }

      await store.setJSON("list", products);

      return {
        statusCode: 200,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(products),
      };
    } catch (err) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: err.message }),
      };
    }

}

return { statusCode: 405, body: “Method Not Allowed”, }; };

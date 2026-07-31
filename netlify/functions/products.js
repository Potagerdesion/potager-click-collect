const { getStore } = require("@netlify/blobs");

// Liste de produits utilisée pour initialiser le stockage au tout premier
// lancement, ET comme source de vérité pour le nom/prix/unité/emoji de
// chaque produit. Le STOCK, lui, n'est JAMAIS pris depuis cette liste une
// fois le produit créé : il vient toujours de Netlify Blobs (ventes,
// ajustements admin...).
//
// -> Pour AJOUTER un produit : ajoute une ligne avec un nouvel id (jamais
//    utilisé auparavant).
// -> Pour MODIFIER un produit existant (nom, prix, unité, emoji,
//    catégorie) : modifie directement sa ligne ici, le changement sera
//    pris en compte au prochain chargement.
// -> Pour changer le STOCK d'un produit existant : passe par le panneau
//    admin, pas par ce fichier (sinon ça n'aura aucun effet).
const SEED_PRODUCTS = [
  { id: 1, name: "Courgettes vertes", category: "Légumes", price: 2.5, stock: 14, unit: "kg", emoji: "🥒"},
  { id: 2, name: "Courgettes rondes", category: "Légumes", price: 3, stock: 13, unit: "kg", emoji: "🥒"},
  { id: 3, name: "Courgettes jaunes", category: "Légumes", price: 2.5, stock: 2, unit: "kg", emoji: "🥒"},
  { id: 4, name: "Salades vertes", category: "Légumes", price: 1.8, stock: 3, unit: "pièce", emoji: "🥗", desc: "Batavia, laitue, mesclun selon saison" },
  { id: 5, name: "Tétragone cornue (épinard d'été)", category: "Légumes", price: 12, stock: 10, unit: "kg", emoji: "🥬" },
  { id: 20, name: "Poirées", category: "Légumes", price: 2, stock: 10, unit: "botte", emoji: "🥬" },
  { id: 6, name: "Petits concombres", category: "Légumes", price: 0.5, stock: 12, unit: "pièce", emoji: "🥒"},
  { id: 7, name: "Moyens concombres", category: "Légumes", price: 0.8, stock: 45, unit: "pièce", emoji: "🥒"},
  { id: 8, name: "Oignons blancs", category: "Légumes", price: 1.2, stock: 10, unit: "pièce", emoji: "🧅"},
  { id: 9, name: "Oignons rouges", category: "Légumes", price: 1.2, stock: 10, unit: "pièce", emoji: "🧅"},
  { id: 10, name: "Tomates petit calibre", category: "Légumes", price: 4.5, stock: 6, unit: "kg", emoji: "🍅"},
  { id: 11, name: "Tomates moyen calibre", category: "Légumes", price: 4.5, stock: 30, unit: "kg", emoji: "🍅"},
  { id: 12, name: "Tomates gros calibre", category: "Légumes", price: 4.5, stock: 6, unit: "kg", emoji: "🍅"},
  { id: 13, name: "Tomates coeur de boeuf", category: "Légumes", price: 5, stock: 5, unit: "kg", emoji: "🍅"},
  { id: 14, name: "Persil plat", category: "Autres", price: 1.5, stock: 5, unit: "botte", emoji: "🌿"},
  { id: 15, name: "Laurier feuilles", category: "Autres", price: 1, stock: 5, unit: "branche", emoji: "🌿"},
  { id: 16, name: "Estragon", category: "Autres", price: 1.5, stock: 5, unit: "bouquet", emoji: "🌿"},
  { id: 17, name: "Basilic", category: "Autres", price: 1.5, stock: 5, unit: "bouquet", emoji: "🌿"},
  { id: 18, name: "Pot de miel de la Colline, 250g", category: "Autres", price: 5, stock: 50, unit: "pièce", emoji: "🍯"},
  { id: 19, name: "Pot de miel de la Colline, 500g", category: "Autres", price: 9, stock: 50, unit: "pièce", emoji: "🍯"},
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
      // Tout premier lancement : le store est vide, on l'initialise.
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

// On remplace complètement la liste par celle du code
// tout en conservant les stocks existants.
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

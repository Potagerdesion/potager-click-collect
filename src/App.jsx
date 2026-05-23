import { useState, useEffect } from "react";

// ─── Mock Data ────────────────────────────────────────────────────────────────
const INITIAL_PRODUCTS = [
  { id: 1, name: "Tomates cerises", category: "Légumes", price: 3.5, stock: 20, unit: "barquette 250g", emoji: "🍅", desc: "Variétés anciennes, récoltées à maturité" },
  { id: 2, name: "Courgettes", category: "Légumes", price: 1.2, stock: 15, unit: "pièce", emoji: "🥒", desc: "Vertes et jaunes, fraîchement cueillies" },
  { id: 3, name: "Fraises Gariguette", category: "Fruits", price: 4.5, stock: 10, unit: "barquette 500g", emoji: "🍓", desc: "Sucrées et parfumées, ramassées le matin" },
  { id: 4, name: "Salade verte", category: "Légumes", price: 1.0, stock: 25, unit: "pièce", emoji: "🥬", desc: "Batavia, laitue, mesclun selon saison" },
  { id: 5, name: "Pommes de terre", category: "Légumes", price: 2.0, stock: 30, unit: "kg", emoji: "🥔", desc: "Variétés Charlotte et Ratte" },
  { id: 6, name: "Framboises", category: "Fruits", price: 5.0, stock: 8, unit: "barquette 250g", emoji: "🫐", desc: "Cueillette du jour, très fragiles" },
  { id: 7, name: "Haricots verts", category: "Légumes", price: 2.5, stock: 18, unit: "500g", emoji: "🫘", desc: "Fins et croquants, récoltés à la main" },
  { id: 8, name: "Abricots", category: "Fruits", price: 3.8, stock: 12, unit: "kg", emoji: "🍑", desc: "Variété Bergeron, très sucrés" },
];

const SLOTS = [
  { id: "mar-9", label: "Mardi 9h–12h" },
  { id: "mar-16", label: "Mardi 16h–19h" },
  { id: "ven-9", label: "Vendredi 9h–12h" },
  { id: "ven-16", label: "Vendredi 16h–19h" },
  { id: "sam-9", label: "Samedi 9h–13h" },
];

// ─── Stripe-like mock payment ─────────────────────────────────────────────────
function fakeCharge() {
  return new Promise((res) => setTimeout(() => res({ success: true, id: "pi_" + Math.random().toString(36).slice(2, 10) }), 1800));
}

// ─── Utility ──────────────────────────────────────────────────────────────────
const fmt = (n) => n.toFixed(2).replace(".", ",") + " €";

// ─── Components ───────────────────────────────────────────────────────────────
function Badge({ children, color = "green" }) {
  const colors = {
    green: "bg-[#d6f0d6] text-[#2d6a2d]",
    orange: "bg-[#fde8c8] text-[#a05a00]",
    red: "bg-[#fde0e0] text-[#a02020]",
    gray: "bg-[#eee] text-[#666]",
  };
  return <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colors[color]}`}>{children}</span>;
}

function ProductCard({ product, qty, onAdd, onRemove, adminMode, onStockChange }) {
  const stockColor = product.stock === 0 ? "red" : product.stock < 5 ? "orange" : "green";
  const stockLabel = product.stock === 0 ? "Épuisé" : product.stock < 5 ? `Plus que ${product.stock}` : `${product.stock} dispo`;

  return (
    <div
      style={{
        background: "#fffdf8",
        border: "1.5px solid #e8e0d0",
        borderRadius: 18,
        padding: "18px 20px",
        display: "flex",
        flexDirection: "column",
        gap: 10,
        transition: "box-shadow .2s",
        boxShadow: qty > 0 ? "0 0 0 2px #6aaa6a" : "none",
        opacity: product.stock === 0 && !adminMode ? 0.55 : 1,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 38 }}>{product.emoji}</span>
        <Badge color={stockColor}>{stockLabel}</Badge>
      </div>

      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#2a2a1a" }}>
          {product.name}
        </div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{product.unit}</div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4, lineHeight: 1.4 }}>{product.desc}</div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#3a6e3a" }}>
          {fmt(product.price)}
        </span>

        {adminMode ? (
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, color: "#888" }}>Stock :</span>
            <button onClick={() => onStockChange(product.id, -1)} style={btnSmall}>−</button>
            <span style={{ minWidth: 28, textAlign: "center", fontWeight: 700 }}>{product.stock}</span>
            <button onClick={() => onStockChange(product.id, 1)} style={btnSmall}>+</button>
          </div>
        ) : (
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            {qty > 0 && (
              <button onClick={() => onRemove(product.id)} style={btnRound("#f5ede0", "#a05a00")}>−</button>
            )}
            {qty > 0 && (
              <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{qty}</span>
            )}
            <button
              onClick={() => onAdd(product.id)}
              disabled={product.stock === 0 || qty >= product.stock}
              style={btnRound(qty > 0 ? "#e8f5e8" : "#3a6e3a", qty > 0 ? "#2d6a2d" : "#fff", product.stock === 0 || qty >= product.stock)}
            >
              {qty > 0 ? "+" : "Ajouter"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

const btnSmall = {
  width: 26, height: 26, borderRadius: 6, border: "1.5px solid #ccc",
  background: "#fff", cursor: "pointer", fontSize: 16, display: "flex",
  alignItems: "center", justifyContent: "center", fontWeight: 700,
};

function btnRound(bg, color, disabled = false) {
  return {
    background: disabled ? "#ddd" : bg,
    color: disabled ? "#aaa" : color,
    border: "none",
    borderRadius: 99,
    padding: "6px 14px",
    fontWeight: 700,
    fontSize: 14,
    cursor: disabled ? "not-allowed" : "pointer",
    transition: "opacity .15s",
  };
}

// ─── Checkout Form ─────────────────────────────────────────────────────────────
function CheckoutForm({ cart, products, total, onSuccess, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", slot: "", card: "", expiry: "", cvc: "" });
  const [errors, setErrors] = useState({});
  const [paying, setPaying] = useState(false);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (!form.slot) e.slot = "Choisissez un créneau";
    if (form.card.replace(/\s/g, "").length < 16) e.card = "Numéro invalide";
    if (!form.expiry.match(/^\d{2}\/\d{2}$/)) e.expiry = "MM/AA";
    if (form.cvc.length < 3) e.cvc = "CVC invalide";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = async () => {
    if (!validate()) return;
    setPaying(true);
    const result = await fakeCharge();
    setPaying(false);
    if (result.success) onSuccess({ ...form, transactionId: result.id });
  };

  const cartItems = Object.entries(cart)
    .filter(([, q]) => q > 0)
    .map(([id, qty]) => ({ ...products.find((p) => p.id === +id), qty }));

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 4px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a6e3a", cursor: "pointer", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>
        ← Retour au panier
      </button>

      {/* Order summary */}
      <div style={card}>
        <h3 style={sectionTitle}>Récapitulatif</h3>
        {cartItems.map((item) => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe0", fontSize: 14 }}>
            <span>{item.emoji} {item.name} × {item.qty}</span>
            <span style={{ fontWeight: 700 }}>{fmt(item.price * item.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#3a6e3a" }}>
          <span>Total</span>
          <span>{fmt(total)}</span>
        </div>
      </div>

      {/* Contact */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={sectionTitle}>Vos coordonnées</h3>
        {[["name", "Nom complet", "text"], ["email", "Email", "email"], ["phone", "Téléphone (optionnel)", "tel"]].map(([k, label, type]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={form[k]} onChange={(e) => set(k, e.target.value)}
              style={{ ...inputStyle, borderColor: errors[k] ? "#e55" : "#d5cfc0" }} />
            {errors[k] && <span style={{ color: "#e55", fontSize: 12 }}>{errors[k]}</span>}
          </div>
        ))}
      </div>

      {/* Slot */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={sectionTitle}>🗓 Créneau de retrait</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SLOTS.map((s) => (
            <button key={s.id} onClick={() => set("slot", s.id)}
              style={{
                padding: "10px 8px", borderRadius: 10, border: `2px solid ${form.slot === s.id ? "#3a6e3a" : "#ddd"}`,
                background: form.slot === s.id ? "#e8f5e8" : "#fff", cursor: "pointer",
                fontWeight: form.slot === s.id ? 700 : 400, fontSize: 13, color: "#333",
              }}>
              {s.label}
            </button>
          ))}
        </div>
        {errors.slot && <span style={{ color: "#e55", fontSize: 12, marginTop: 4, display: "block" }}>{errors.slot}</span>}
        <p style={{ fontSize: 12, color: "#888", marginTop: 10 }}>📍 Retrait à la ferme — 42 chemin des Oliviers, Saint-Martin-de-Crau</p>
      </div>

      {/* Payment */}
      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={sectionTitle}>💳 Paiement sécurisé</h3>
        <div style={{ background: "#f5f9f5", border: "1px solid #c8e0c8", borderRadius: 8, padding: "8px 12px", marginBottom: 14, fontSize: 12, color: "#3a6e3a" }}>
          🔒 Paiement chiffré — votre commande est confirmée instantanément
        </div>
        <label style={labelStyle}>Numéro de carte</label>
        <input value={form.card} onChange={(e) => {
          let v = e.target.value.replace(/\D/g, "").slice(0, 16);
          v = v.replace(/(.{4})/g, "$1 ").trim();
          set("card", v);
        }} placeholder="1234 5678 9012 3456"
          style={{ ...inputStyle, borderColor: errors.card ? "#e55" : "#d5cfc0", marginBottom: 8, letterSpacing: 2 }} />
        {errors.card && <span style={{ color: "#e55", fontSize: 12 }}>{errors.card}</span>}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
          <div>
            <label style={labelStyle}>Expiration</label>
            <input value={form.expiry} onChange={(e) => {
              let v = e.target.value.replace(/\D/g, "").slice(0, 4);
              if (v.length >= 3) v = v.slice(0, 2) + "/" + v.slice(2);
              set("expiry", v);
            }} placeholder="MM/AA" style={{ ...inputStyle, borderColor: errors.expiry ? "#e55" : "#d5cfc0" }} />
            {errors.expiry && <span style={{ color: "#e55", fontSize: 12 }}>{errors.expiry}</span>}
          </div>
          <div>
            <label style={labelStyle}>CVC</label>
            <input value={form.cvc} onChange={(e) => set("cvc", e.target.value.replace(/\D/g, "").slice(0, 4))}
              placeholder="123" style={{ ...inputStyle, borderColor: errors.cvc ? "#e55" : "#d5cfc0" }} />
            {errors.cvc && <span style={{ color: "#e55", fontSize: 12 }}>{errors.cvc}</span>}
          </div>
        </div>
      </div>

      <button onClick={pay} disabled={paying} style={{
        marginTop: 20, width: "100%", padding: "16px",
        background: paying ? "#aaa" : "linear-gradient(135deg, #3a6e3a, #5a9e3a)",
        color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Playfair Display', serif",
        fontSize: 18, fontWeight: 700, cursor: paying ? "not-allowed" : "pointer",
        boxShadow: "0 4px 20px rgba(60,110,60,0.3)", transition: "all .2s",
      }}>
        {paying ? "⏳ Traitement en cours…" : `✅ Payer ${fmt(total)}`}
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>
        En confirmant, vous acceptez les conditions de vente. Annulation gratuite 24h avant le retrait.
      </p>
    </div>
  );
}

// ─── Success Screen ────────────────────────────────────────────────────────────
function SuccessScreen({ info, onReset }) {
  const slot = SLOTS.find((s) => s.id === info.slot);
  return (
    <div style={{ maxWidth: 480, margin: "40px auto", textAlign: "center", padding: "0 16px" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🌿</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d6a2d", marginBottom: 8 }}>
        Commande confirmée !
      </h2>
      <p style={{ color: "#555", marginBottom: 24 }}>
        Merci <strong>{info.name}</strong> ! Un email de confirmation a été envoyé à <strong>{info.email}</strong>.
      </p>
      <div style={{ ...card, textAlign: "left", marginBottom: 24 }}>
        <p style={{ margin: 0 }}>📅 <strong>Créneau :</strong> {slot?.label}</p>
        <p style={{ margin: "8px 0 0" }}>📍 <strong>Adresse :</strong> 42 chemin des Oliviers, Saint-Martin-de-Crau</p>
        <p style={{ margin: "8px 0 0" }}>🔖 <strong>Référence :</strong> <code style={{ background: "#f0ebe0", padding: "2px 6px", borderRadius: 4 }}>{info.transactionId}</code></p>
      </div>
      <button onClick={onReset} style={{
        padding: "12px 32px", background: "#3a6e3a", color: "#fff", border: "none",
        borderRadius: 99, fontWeight: 700, fontSize: 15, cursor: "pointer",
      }}>
        Passer une nouvelle commande
      </button>
    </div>
  );
}

// ─── Admin Panel ───────────────────────────────────────────────────────────────
function AdminPanel({ products, onStockChange, orders, onClose }) {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>🌱 Gestion des stocks</h2>
        <button onClick={onClose} style={{ background: "#fde0e0", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700 }}>Fermer</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12, marginBottom: 28 }}>
        {products.map((p) => (
          <ProductCard key={p.id} product={p} qty={0} adminMode onStockChange={onStockChange} />
        ))}
      </div>

      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 14 }}>📋 Commandes récentes</h3>
      {orders.length === 0 ? (
        <p style={{ color: "#aaa" }}>Aucune commande pour le moment.</p>
      ) : (
        orders.map((o) => (
          <div key={o.id} style={{ ...card, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <strong>{o.name}</strong>
              <Badge color="green">{fmt(o.total)}</Badge>
            </div>
            <div style={{ fontSize: 13, color: "#777", marginTop: 4 }}>
              {SLOTS.find((s) => s.id === o.slot)?.label} — {o.items.map((i) => `${i.emoji} ×${i.qty}`).join("  ")}
            </div>
          </div>
        ))
      )}
    </div>
  );
}

// ─── Styles ────────────────────────────────────────────────────────────────────
const card = {
  background: "#fffdf8",
  border: "1.5px solid #e8e0d0",
  borderRadius: 16,
  padding: "18px 20px",
};
const sectionTitle = {
  fontFamily: "'Playfair Display', serif",
  fontSize: 16,
  fontWeight: 700,
  color: "#2a2a1a",
  marginTop: 0,
  marginBottom: 14,
};
const inputStyle = {
  width: "100%",
  padding: "10px 12px",
  borderRadius: 10,
  border: "1.5px solid #d5cfc0",
  fontSize: 15,
  background: "#fffdf8",
  boxSizing: "border-box",
  outline: "none",
  fontFamily: "inherit",
};
const labelStyle = {
  display: "block",
  fontSize: 13,
  fontWeight: 600,
  color: "#666",
  marginBottom: 5,
};

// ─── Main App ──────────────────────────────────────────────────────────────────
export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);
  const [cart, setCart] = useState({});
  const [view, setView] = useState("shop"); // shop | checkout | success | admin
  const [orderInfo, setOrderInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [adminPin, setAdminPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const PIN = "1234";

  const categories = ["Tous", ...Array.from(new Set(products.map((p) => p.category)))];

  const addToCart = (id) => setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart((c) => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => {
    const p = products.find((x) => x.id === +id);
    return sum + (p ? p.price * qty : 0);
  }, 0);

  const filtered = filter === "Tous" ? products : products.filter((p) => p.category === filter);

  const handleSuccess = (info) => {
    const cartItems = Object.entries(cart)
      .filter(([, q]) => q > 0)
      .map(([id, qty]) => ({ ...products.find((p) => p.id === +id), qty }));

    // Deduct stock
    setProducts((ps) =>
      ps.map((p) => ({ ...p, stock: p.stock - (cart[p.id] || 0) }))
    );
    setOrders((o) => [{ ...info, id: Date.now(), items: cartItems, total }, ...o]);
    setOrderInfo(info);
    setCart({});
    setView("success");
  };

  const handleStockChange = (id, delta) => {
    setProducts((ps) => ps.map((p) => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p));
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f4ec", fontFamily: "'Lato', sans-serif" }}>
      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;600;700&display=swap');
        * { box-sizing: border-box; }
        input:focus { border-color: #3a6e3a !important; }
      `}</style>

      {/* Header */}
      <header style={{
        background: "linear-gradient(135deg, #2d5a1b 0%, #4a8a2a 100%)",
        padding: "0 20px",
        position: "sticky", top: 0, zIndex: 100,
        boxShadow: "0 2px 20px rgba(0,0,0,0.2)",
      }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "14px 0" }}>
          <div onClick={() => setView("shop")} style={{ cursor: "pointer" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#fff", fontWeight: 700, lineHeight: 1.1 }}>
              🌿 Ferme des Oliviers
            </div>
            <div style={{ fontSize: 11, color: "#b8dda0", letterSpacing: 1.5, textTransform: "uppercase" }}>
              Circuit court · Permaculture
            </div>
          </div>

          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <button onClick={() => { setShowPinModal(true); }}
              style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "6px 12px", color: "#fff", cursor: "pointer", fontSize: 13 }}>
              ⚙️ Admin
            </button>
            {view === "shop" && (
              <button onClick={() => cartCount > 0 && setView("checkout")}
                style={{
                  background: cartCount > 0 ? "#fff" : "rgba(255,255,255,0.2)",
                  color: cartCount > 0 ? "#3a6e3a" : "#bbb",
                  border: "none", borderRadius: 99, padding: "8px 18px",
                  fontWeight: 700, fontSize: 14, cursor: cartCount > 0 ? "pointer" : "default",
                  transition: "all .2s",
                }}>
                🛒 {cartCount > 0 ? `${cartCount} article${cartCount > 1 ? "s" : ""} · ${fmt(total)}` : "Panier vide"}
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Pin Modal */}
      {showPinModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 300, textAlign: "center" }}>
            <h3 style={{ marginTop: 0, fontFamily: "'Playfair Display', serif" }}>Accès producteur</h3>
            <p style={{ fontSize: 13, color: "#888" }}>Code PIN : <strong>1234</strong> (démo)</p>
            <input type="password" value={adminPin} onChange={(e) => setAdminPin(e.target.value)}
              placeholder="Code PIN"
              style={{ ...inputStyle, textAlign: "center", letterSpacing: 6, fontSize: 22, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowPinModal(false); setAdminPin(""); }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer" }}>
                Annuler
              </button>
              <button onClick={() => {
                if (adminPin === PIN) { setView("admin"); setShowPinModal(false); setAdminPin(""); }
                else { alert("Code incorrect"); setAdminPin(""); }
              }}
                style={{ flex: 1, padding: "10px", borderRadius: 10, border: "none", background: "#3a6e3a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Entrer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px" }}>

        {view === "shop" && (
          <>
            {/* Hero */}
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d5a1b", margin: "0 0 8px" }}>
                Nos produits de saison
              </h1>
              <p style={{ color: "#778", fontSize: 14, margin: 0 }}>
                Réservez en ligne, réglez par carte et venez récupérer à la ferme 🌱
              </p>
            </div>

            {/* Filters */}
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {categories.map((c) => (
                <button key={c} onClick={() => setFilter(c)}
                  style={{
                    padding: "7px 16px", borderRadius: 99, border: `1.5px solid ${filter === c ? "#3a6e3a" : "#ddd"}`,
                    background: filter === c ? "#3a6e3a" : "#fff",
                    color: filter === c ? "#fff" : "#555",
                    fontWeight: 600, fontSize: 14, cursor: "pointer",
                  }}>
                  {c}
                </button>
              ))}
            </div>

            {/* Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {filtered.map((p) => (
                <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={addToCart} onRemove={removeFromCart} />
              ))}
            </div>

            {/* Sticky CTA */}
            {cartCount > 0 && (
              <div style={{
                position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)",
                background: "linear-gradient(135deg, #3a6e3a, #5a9e3a)",
                color: "#fff", borderRadius: 99, padding: "14px 32px",
                boxShadow: "0 8px 30px rgba(60,110,60,0.4)",
                cursor: "pointer", fontWeight: 700, fontSize: 16,
                display: "flex", gap: 12, alignItems: "center",
                whiteSpace: "nowrap",
              }} onClick={() => setView("checkout")}>
                <span>🛒 {cartCount} article{cartCount > 1 ? "s" : ""}</span>
                <span style={{ opacity: .7 }}>|</span>
                <span>Commander · {fmt(total)}</span>
              </div>
            )}
          </>
        )}

        {view === "checkout" && (
          <CheckoutForm
            cart={cart}
            products={products}
            total={total}
            onSuccess={handleSuccess}
            onBack={() => setView("shop")}
          />
        )}

        {view === "success" && orderInfo && (
          <SuccessScreen info={orderInfo} onReset={() => setView("shop")} />
        )}

        {view === "admin" && (
          <AdminPanel
            products={products}
            onStockChange={handleStockChange}
            orders={orders}
            onClose={() => setView("shop")}
          />
        )}
      </main>
    </div>
  );
}

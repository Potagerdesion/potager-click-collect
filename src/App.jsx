import { useState, useEffect } from "react";

const INITIAL_PRODUCTS = [
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
  { id: 18, name: "Pot de miel de la Colline, 250g", category: "Autres", price: 9, stock: 50, unit: "pièce", emoji: "🍯"},
  { id: 19, name: "Pot de miel de la Colline, 500g", category: "Autres", price: 5, stock: 50, unit: "pièce", emoji: "🍯"},
];

const SLOTS = [
  { id: "lun-am", label: "Lundi matin" },
  { id: "mar-am", label: "Mardi matin" },
  { id: "mer-pm", label: "Mercredi après-midi" },
  { id: "ven-am", label: "Vendredi matin" },
  { id: "sam-am", label: "Samedi matin" },
];

const EMOJIS = ["🍅","🥒","🍓","🥬","🥔","🫐","🫘","🍑","🧅","🧄","🥦","🥕","🌽","🍆","🫑","🍇","🍊","🍋","🍎","🍐","🍒","🫒","🌿","🥑","🫚","🥗","🫜","🍯"];

const fmt = (n) => Number(n).toFixed(2).replace(".", ",") + " €";

const card = { background: "#fffdf8", border: "1.5px solid #e8e0d0", borderRadius: 16, padding: "18px 20px" };
const sectionTitle = { fontFamily: "'Playfair Display', serif", fontSize: 16, fontWeight: 700, color: "#2a2a1a", marginTop: 0, marginBottom: 14 };
const inputStyle = { width: "100%", padding: "10px 12px", borderRadius: 10, border: "1.5px solid #d5cfc0", fontSize: 15, background: "#fffdf8", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
const labelStyle = { display: "block", fontSize: 13, fontWeight: 600, color: "#666", marginBottom: 5 };

function btnRound(bg, color, disabled = false) {
  return { background: disabled ? "#ddd" : bg, color: disabled ? "#aaa" : color, border: "none", borderRadius: 99, padding: "6px 14px", fontWeight: 700, fontSize: 14, cursor: disabled ? "not-allowed" : "pointer" };
}

function ProductCard({ product, qty, onAdd, onRemove }) {
  const stockColor = product.stock === 0 ? "#e55" : product.stock < 5 ? "#e8a020" : "#3a6e3a";
  const stockLabel = product.stock === 0 ? "Épuisé" : product.stock < 5 ? `Plus que ${product.stock}` : `${product.stock} dispo`;
  return (
    <div style={{ background: "#fffdf8", border: `1.5px solid ${qty > 0 ? "#6aaa6a" : "#e8e0d0"}`, borderRadius: 18, padding: "18px 20px", display: "flex", flexDirection: "column", gap: 10, opacity: product.stock === 0 ? 0.55 : 1 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <span style={{ fontSize: 38 }}>{product.emoji}</span>
        <span style={{ fontSize: 12, fontWeight: 700, padding: "3px 10px", borderRadius: 99, background: stockColor + "22", color: stockColor }}>{stockLabel}</span>
      </div>
      <div>
        <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 700, color: "#2a2a1a" }}>{product.name}</div>
        <div style={{ fontSize: 12, color: "#888", marginTop: 2 }}>{product.unit}</div>
        <div style={{ fontSize: 12, color: "#777", marginTop: 4, lineHeight: 1.4 }}>{product.desc}</div>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
        <span style={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, fontSize: 20, color: "#3a6e3a" }}>{fmt(product.price)}</span>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          {qty > 0 && <button onClick={() => onRemove(product.id)} style={btnRound("#f5ede0", "#a05a00")}>−</button>}
          {qty > 0 && <span style={{ fontWeight: 700, minWidth: 18, textAlign: "center" }}>{qty}</span>}
          <button onClick={() => onAdd(product.id)} disabled={product.stock === 0 || qty >= product.stock} style={btnRound(qty > 0 ? "#e8f5e8" : "#3a6e3a", qty > 0 ? "#2d6a2d" : "#fff", product.stock === 0 || qty >= product.stock)}>
            {qty > 0 ? "+" : "Ajouter"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ProductForm({ initial, onSave, onCancel }) {
  const empty = { name: "", category: "Légumes", price: "", stock: "", unit: "", emoji: "🥕", desc: "" };
  const [form, setForm] = useState(initial || empty);
  const [showEmoji, setShowEmoji] = useState(false);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const handleSave = () => {
    if (!form.name.trim()) return alert("Le nom est obligatoire");
    if (!form.price || isNaN(form.price)) return alert("Prix invalide");
    if (!form.stock || isNaN(form.stock)) return alert("Stock invalide");
    onSave({ ...form, price: parseFloat(form.price), stock: parseInt(form.stock), id: form.id || Date.now() });
  };

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
      <div style={{ background: "#fffdf8", borderRadius: 20, padding: 24, width: "100%", maxWidth: 440, maxHeight: "90vh", overflowY: "auto" }}>
        <h3 style={{ fontFamily: "'Playfair Display', serif", marginTop: 0, fontSize: 20 }}>
          {initial ? "✏️ Modifier le produit" : "➕ Nouveau produit"}
        </h3>
        <div style={{ marginBottom: 14 }}>
          <label style={labelStyle}>Icône</label>
          <button onClick={() => setShowEmoji(s => !s)} style={{ fontSize: 32, background: "#f5f0e8", border: "1.5px solid #ddd", borderRadius: 12, padding: "8px 16px", cursor: "pointer" }}>
            {form.emoji}
          </button>
          {showEmoji && (
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginTop: 8, background: "#fff", border: "1px solid #eee", borderRadius: 12, padding: 10 }}>
              {EMOJIS.map(e => (
                <button key={e} onClick={() => { set("emoji", e); setShowEmoji(false); }}
                  style={{ fontSize: 24, background: form.emoji === e ? "#e8f5e8" : "none", border: "none", borderRadius: 8, padding: 4, cursor: "pointer" }}>
                  {e}
                </button>
              ))}
            </div>
          )}
        </div>
        <div style={{ marginBottom: 12 }}>
          <label style={labelStyle}>Nom du produit *</label>
          <input value={form.name} onChange={e => set("name", e.target.value)} placeholder="ex: Tomates cerises" style={inputStyle} />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>égorie</label>
            <select value={form.egory} onChange={e => set("category", e.target.value)} style={inputStyle}>
              <option>Légumes</option>
              <option>Fruits</option>
              <option>Herbes</option>
              <option>Autres</option>
            </select>
          </div>
          <div>
            <label style={labelStyle}>Prix (€) *</label>
            <input value={form.price} onChange={e => set("price", e.target.value)} placeholder="3.50" type="number" step="0.10" style={inputStyle} />
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 12 }}>
          <div>
            <label style={labelStyle}>Stock *</label>
            <input value={form.stock} onChange={e => set("stock", e.target.value)} placeholder="20" type="number" style={inputStyle} />
          </div>
          <div>
            <label style={labelStyle}>Unité</label>
            <input value={form.unit} onChange={e => set("unit", e.target.value)} placeholder="kg, pièce…" style={inputStyle} />
          </div>
        </div>
        <div style={{ marginBottom: 16 }}>
          <label style={labelStyle}>Description courte</label>
          <input value={form.desc} onChange={e => set("desc", e.target.value)} placeholder="ex: Récoltées le matin même" style={inputStyle} />
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={onCancel} style={{ flex: 1, padding: 12, borderRadius: 12, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Annuler</button>
          <button onClick={handleSave} style={{ flex: 2, padding: 12, borderRadius: 12, border: "none", background: "#3a6e3a", color: "#fff", fontWeight: 700, fontSize: 16, cursor: "pointer" }}>
            {initial ? "Enregistrer" : "Ajouter le produit"}
          </button>
        </div>
      </div>
    </div>
  );
}

function AdminPanel({ products, onSave, onDelete, onStockChange, orders, onClose }) {
  const [editing, setEditing] = useState(null);
  const [adding, setAdding] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);

  return (
    <div>
      {(editing || adding) && (
        <ProductForm initial={editing} onSave={(p) => { onSave(p); setEditing(null); setAdding(false); }} onCancel={() => { setEditing(null); setAdding(false); }} />
      )}
      {confirmDelete && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 24, maxWidth: 320, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 12 }}>🗑️</div>
            <h3 style={{ marginTop: 0 }}>Supprimer "{confirmDelete.name}" ?</h3>
            <p style={{ color: "#888", fontSize: 14 }}>Cette action est irréversible.</p>
            <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
              <button onClick={() => setConfirmDelete(null)} style={{ flex: 1, padding: 12, borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer", fontWeight: 600 }}>Annuler</button>
              <button onClick={() => { onDelete(confirmDelete.id); setConfirmDelete(null); }} style={{ flex: 1, padding: 12, borderRadius: 10, border: "none", background: "#e55", color: "#fff", fontWeight: 700, cursor: "pointer" }}>Supprimer</button>
            </div>
          </div>
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, margin: 0 }}>🌱 Gestion des produits</h2>
        <button onClick={onClose} style={{ background: "#fde0e0", border: "none", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontWeight: 700 }}>Fermer</button>
      </div>
      <button onClick={() => setAdding(true)} style={{ width: "100%", padding: "14px", marginBottom: 20, background: "linear-gradient(135deg, #3a6e3a, #5a9e3a)", color: "#fff", border: "none", borderRadius: 14, fontWeight: 700, fontSize: 16, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
        ➕ Ajouter un nouveau produit
      </button>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 32 }}>
        {products.map(p => (
          <div key={p.id} style={{ ...card, display: "flex", alignItems: "center", gap: 12 }}>
            <span style={{ fontSize: 30, flexShrink: 0 }}>{p.emoji}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 15, fontFamily: "'Playfair Display', serif" }}>{p.name}</div>
              <div style={{ fontSize: 12, color: "#888" }}>{p.unit} · {fmt(p.price)}</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 6 }}>
                <span style={{ fontSize: 12, color: "#666" }}>Stock :</span>
                <button onClick={() => onStockChange(p.id, -1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #ccc", background: "#fff", cursor: "pointer", fontWeight: 700 }}>−</button>
                <span style={{ fontWeight: 700, minWidth: 24, textAlign: "center" }}>{p.stock}</span>
                <button onClick={() => onStockChange(p.id, 1)} style={{ width: 24, height: 24, borderRadius: 6, border: "1.5px solid #ccc", background: "#fff", cursor: "pointer", fontWeight: 700 }}>+</button>
              </div>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6, flexShrink: 0 }}>
              <button onClick={() => setEditing(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #3a6e3a", background: "#e8f5e8", color: "#3a6e3a", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>✏️ Modifier</button>
              <button onClick={() => setConfirmDelete(p)} style={{ padding: "6px 14px", borderRadius: 8, border: "1.5px solid #e55", background: "#fde0e0", color: "#c00", fontWeight: 700, cursor: "pointer", fontSize: 13 }}>🗑️ Supprimer</button>
            </div>
          </div>
        ))}
      </div>
      <h3 style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, marginBottom: 14 }}>📋 Commandes reçues</h3>
      {orders.length === 0 ? (
        <p style={{ color: "#aaa", textAlign: "center", padding: 20 }}>Aucune commande pour le moment.</p>
      ) : (
        orders.map(o => (
          <div key={o.id} style={{ ...card, marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
              <strong>{o.name}</strong>
              <span style={{ fontWeight: 700, color: "#3a6e3a" }}>{fmt(o.total)}</span>
            </div>
            <div style={{ fontSize: 13, color: "#777" }}>📅 {SLOTS.find(s => s.id === o.slot)?.label}</div>
            <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>{o.items.map(i => `${i.emoji} ${i.name} ×${i.qty}`).join("  ·  ")}</div>
          </div>
        ))
      )}
    </div>
  );
}

function CheckoutForm({ cart, products, total, onSuccess, onBack }) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", slot: "" });
  const [paying, setPaying] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Requis";
    if (!form.email.includes("@")) e.email = "Email invalide";
    if (!form.slot) e.slot = "Choisissez un créneau";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const pay = async () => {
    if (!validate()) return;
    setPaying(true);
    const cartItems = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...products.find(p => p.id === +id), qty }));
    const itemsSummary = cartItems.map(i => `${i.name} x${i.qty}`).join(", ");
    const slot = SLOTS.find(s => s.id === form.slot)?.label || "";
    try {
      const response = await fetch("/api/create-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: total,
          customerEmail: form.email,
          customerName: form.name,
          slot: slot,
          items: itemsSummary,
          cartItems: cartItems.map(i => ({ id: i.id, qty: i.qty })),
        }),
      });
      const data = await response.json();
      if (data.url) {
        onSuccess({ ...form, transactionId: "stripe_pending", items: cartItems, total });
        window.location.href = data.url;
      } else {
        alert("Erreur lors de la création du paiement. Veuillez réessayer.");
      }
    } catch (error) {
      alert("Erreur de connexion. Veuillez réessayer.");
    }
    setPaying(false);
  };

  const cartItems = Object.entries(cart).filter(([, q]) => q > 0).map(([id, qty]) => ({ ...products.find(p => p.id === +id), qty }));

  return (
    <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 4px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a6e3a", cursor: "pointer", fontWeight: 700, fontSize: 15, marginBottom: 20 }}>← Retour</button>
      <div style={card}>
        <h3 style={sectionTitle}>Récapitulatif</h3>
        {cartItems.map(item => (
          <div key={item.id} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f0ebe0", fontSize: 14 }}>
            <span>{item.emoji} {item.name} × {item.qty}</span>
            <span style={{ fontWeight: 700 }}>{fmt(item.price * item.qty)}</span>
          </div>
        ))}
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: 12, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, color: "#3a6e3a" }}>
          <span>Total</span><span>{fmt(total)}</span>
        </div>
      </div>

      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={sectionTitle}>Vos coordonnées</h3>
        {[["name","Nom complet","text"],["email","Email","email"],["phone","Téléphone (optionnel)","tel"]].map(([k,label,type]) => (
          <div key={k} style={{ marginBottom: 12 }}>
            <label style={labelStyle}>{label}</label>
            <input type={type} value={form[k]} onChange={e => set(k, e.target.value)} style={{ ...inputStyle, borderColor: errors[k] ? "#e55" : "#d5cfc0" }} />
            {errors[k] && <span style={{ color: "#e55", fontSize: 12 }}>{errors[k]}</span>}
          </div>
        ))}
      </div>

      <div style={{ ...card, marginTop: 16 }}>
        <h3 style={sectionTitle}>🗓 Créneau de retrait</h3>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {SLOTS.map(s => (
            <button key={s.id} onClick={() => set("slot", s.id)}
              style={{ padding: "10px 8px", borderRadius: 10, border: `2px solid ${form.slot === s.id ? "#3a6e3a" : "#ddd"}`, background: form.slot === s.id ? "#e8f5e8" : "#fff", cursor: "pointer", fontWeight: form.slot === s.id ? 700 : 400, fontSize: 13, color: "#333" }}>
              {s.label}
            </button>
          ))}
        </div>
        {errors.slot && <span style={{ color: "#e55", fontSize: 12, marginTop: 4, display: "block" }}>{errors.slot}</span>}
        <p style={{ fontSize: 12, color: "#888", marginTop: 10 }}>📍 Retrait à la ferme - Colline de Sion</p>
      </div>

      <div style={{ ...card, marginTop: 16, background: "#f5f9f5", border: "1.5px solid #c8e0c8" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 28 }}>🔒</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: "#2d6a2d" }}>Paiement sécurisé par Stripe</div>
            <div style={{ fontSize: 12, color: "#666", marginTop: 2 }}>Vous serez redirigé vers la page de paiement Stripe pour régler par carte bancaire.</div>
          </div>
        </div>
      </div>

      <button onClick={pay} disabled={paying} style={{ marginTop: 20, width: "100%", padding: 16, background: paying ? "#aaa" : "linear-gradient(135deg, #3a6e3a, #5a9e3a)", color: "#fff", border: "none", borderRadius: 14, fontFamily: "'Playfair Display', serif", fontSize: 18, fontWeight: 700, cursor: paying ? "not-allowed" : "pointer", boxShadow: "0 4px 20px rgba(60,110,60,0.3)" }}>
        {paying ? "⏳ Préparation du paiement…" : `💳 Payer ${fmt(total)} par carte`}
      </button>
      <p style={{ textAlign: "center", fontSize: 11, color: "#aaa", marginTop: 10 }}>Annulation gratuite 24h avant le retrait.</p>
    </div>
  );
}

function SuccessScreen({ info, onReset }) {
  const slot = SLOTS.find(s => s.id === info.slot);
  return (
    <div style={{ maxWidth: 480, margin: "40px auto", textAlign: "center", padding: "0 16px" }}>
      <div style={{ fontSize: 80, marginBottom: 16 }}>🌿</div>
      <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d6a2d", marginBottom: 8 }}>Commande enregistrée !</h2>
      <p style={{ color: "#555", marginBottom: 24 }}>Merci <strong>{info.name}</strong> ! Complétez votre paiement sur la page Stripe qui vient de s'ouvrir.</p>
      <div style={{ ...card, textAlign: "left", marginBottom: 24 }}>
        <p style={{ margin: 0 }}>📅 <strong>Créneau :</strong> {slot?.label}</p>
        <p style={{ margin: "8px 0 0" }}>📍 <strong>Adresse :</strong> 2, les Grands Champs - Saxon-Sion</p>
        <p style={{ margin: "8px 0 0" }}>📧 <strong>Email :</strong> {info.email}</p>
      </div>
      <button onClick={onReset} style={{ padding: "12px 32px", background: "#3a6e3a", color: "#fff", border: "none", borderRadius: 99, fontWeight: 700, fontSize: 15, cursor: "pointer" }}>
        Retour à la boutique
      </button>
    </div>
  );
}


function AboutPage({ onBack }) {
  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "0 16px 60px" }}>
      <button onClick={onBack} style={{ background: "none", border: "none", color: "#3a6e3a", cursor: "pointer", fontWeight: 700, fontSize: 15, marginBottom: 24 }}>
        ← Retour à la boutique
      </button>

      {/* Hero */}
      <div style={{ textAlign: "center", marginBottom: 40 }}>
        <img src="https://raw.githubusercontent.com/Potagerdesion/potager-click-collect/main/IMG_1149.jpeg"
          alt="Le Potager de la Colline de Sion"
          style={{ width: 120, height: 120, borderRadius: "50%", objectFit: "cover", border: "4px solid #3a6e3a", marginBottom: 16 }} />
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 30, color: "#2d5a1b", margin: "0 0 8px" }}>
          Le Potager de la Colline de Sion
        </h1>
        <p style={{ color: "#778", fontSize: 15, margin: 0 }}>Saxon-Sion · Colline de Sion-Vaudémont · 54330</p>
      </div>

      {/* Notre histoire */}
      <div style={{ background: "#fffdf8", border: "1.5px solid #e8e0d0", borderRadius: 20, padding: "28px 28px", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2d5a1b", marginTop: 0 }}>🌱 Notre histoire</h2>
        <p style={{ color: "#444", lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
          Tout a commencé par un rêve ancré dans la terre lorraine : faire pousser sur la Colline de Sion-Vaudémont des fruits et légumes de saison, dans le respect de la nature et du patrimoine qui nous entoure.
        </p>
        <p style={{ color: "#444", lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
          C'est au cours de l'hiver dernier que nous avons posé les premières pierres de notre potager en permaculture — une aventure humaine, sensible et profondément enracinée dans notre histoire familiale et dans celle de cette colline emblématique de Lorraine.
        </p>
      </div>

      {/* Notre philosophie */}
      <div style={{ background: "#fffdf8", border: "1.5px solid #e8e0d0", borderRadius: 20, padding: "28px 28px", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2d5a1b", marginTop: 0 }}>🍃 Notre philosophie</h2>
        <p style={{ color: "#444", lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
          Nous avons choisi la permaculture parce qu'elle nous invite à cultiver autrement — en observant, en imitant et en travaillant <em>avec</em> les écosystèmes naturels plutôt que contre eux. Prendre soin de la terre, c'est prendre soin de l'avenir.
        </p>
        <p style={{ color: "#444", lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
          Notre potager n'est pas certifié Bio, mais nous ne recourons à <strong>aucun produit chimique</strong>. Nous traitons naturellement nos cultures — avec des huiles essentielles notamment — car nous croyons que la nature offre déjà tout ce dont elle a besoin pour se soigner.
        </p>
      </div>

      {/* Ce qu'on produit */}
      <div style={{ background: "#fffdf8", border: "1.5px solid #e8e0d0", borderRadius: 20, padding: "28px 28px", marginBottom: 20 }}>
        <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#2d5a1b", marginTop: 0 }}>🍯 Ce que nous produisons</h2>
        <p style={{ color: "#444", lineHeight: 1.8, fontSize: 15, textAlign: "justify" }}>
          Fruits et légumes de saison, cueillis à maturité sur notre Colline, et le miel de nos abeilles ! Tout est produit ici, sur ces terres qui nous sont chères, avec passion et sincérité.
        </p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, marginTop: 16 }}>
          {[["🍅", "Légumes de saison"], ["🍓", "Fruits frais"], ["🍯", "Miel"]].map(([emoji, label]) => (
            <div key={label} style={{ background: "#f0f7f0", borderRadius: 12, padding: "12px 8px", textAlign: "center", color: "#2d6a2d" }}>
              <div style={{ fontSize: 22 }}>{emoji}</div>
              <div style={{ fontSize: 12, fontWeight: 600, marginTop: 4, lineHeight: 1.3 }}>{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Citation */}
      <div style={{ background: "linear-gradient(135deg, #2d5a1b, #4a8a2a)", borderRadius: 20, padding: "28px 28px", textAlign: "center", marginBottom: 20 }}>
        <p style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#fff", lineHeight: 1.7, margin: 0, fontStyle: "italic" }}>
          "La nature, notre Colline, votre assiette."
        </p>
        <p style={{ color: "#b8dda0", fontSize: 13, marginTop: 12 }}>— Cultivés en permaculture avec passion, Saxon-Sion</p>
      </div>

      <div style={{ textAlign: "center" }}>
        <button onClick={onBack} style={{ padding: "14px 36px", background: "#3a6e3a", color: "#fff", border: "none", borderRadius: 99, fontWeight: 700, fontSize: 16, cursor: "pointer", boxShadow: "0 4px 20px rgba(60,110,60,0.3)" }}>
          🛒 Voir nos produits
        </button>
      </div>
    </div>
  );
}

export default function App() {
  const [products, setProducts] = useState(INITIAL_PRODUCTS);

useEffect(() => {
  console.log("Chargement des produits");

  fetch("/api/products?t=" + Date.now())
    .then((r) => r.json())
    .then((data) => {
      console.log(data);
      if (Array.isArray(data)) setProducts(data);
    });
}, []);
  const [cart, setCart] = useState({});
  const [view, setView] = useState("shop");
  const [orderInfo, setOrderInfo] = useState(null);
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState("Tous");
  const [adminPin, setAdminPin] = useState("");
  const [showPinModal, setShowPinModal] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 600);
  const PIN = "1234";

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 600);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const categories = ["Tous", ...Array.from(new Set(products.map(p => p.category)))];
  const addToCart = (id) => setCart(c => ({ ...c, [id]: (c[id] || 0) + 1 }));
  const removeFromCart = (id) => setCart(c => ({ ...c, [id]: Math.max(0, (c[id] || 0) - 1) }));
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const total = Object.entries(cart).reduce((sum, [id, qty]) => { const p = products.find(x => x.id === +id); return sum + (p ? p.price * qty : 0); }, 0);
  const filtered = filter === "Tous" ? products : products.filter(p => p.category === filter);

  // Le stock réel est déduit côté serveur (webhook Stripe) une fois le
  // paiement confirmé, pas ici. On se contente d'enregistrer la commande
  // et d'ajuster localement l'affichage pour éviter la survente pendant
  // la session en cours ; la valeur exacte sera rechargée au retour sur le
  // site (rechargement de page après le paiement Stripe).
  const handleSuccess = (info) => {
    setProducts(ps => ps.map(p => ({ ...p, stock: Math.max(0, p.stock - (cart[p.id] || 0)) })));
    setOrders(o => [{ ...info, id: Date.now() }, ...o]);
    setOrderInfo(info);
    setCart({});
    setView("success");
  };

  const persistProducts = async (list) => {
    try {
      await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-pin": PIN },
        body: JSON.stringify(list),
      });
    } catch (err) {
      alert("La sauvegarde en ligne a échoué, réessayez.");
    }
  };

  const handleSaveProduct = (p) => {
    setProducts(ps => {
      const next = ps.find(x => x.id === p.id) ? ps.map(x => x.id === p.id ? p : x) : [...ps, p];
      persistProducts(next);
      return next;
    });
  };

  const handleDeleteProduct = (id) => {
    setProducts(ps => {
      const next = ps.filter(p => p.id !== id);
      persistProducts(next);
      return next;
    });
    setCart(c => { const n = { ...c }; delete n[id]; return n; });
  };

  const handleStockChange = (id, delta) => {
    setProducts(ps => {
      const next = ps.map(p => p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p);
      persistProducts(next);
      return next;
    });
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8f4ec", fontFamily: "'Lato', sans-serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700&family=Lato:wght@400;600;700&display=swap'); * { box-sizing: border-box; } input:focus,select:focus { border-color: #3a6e3a !important; outline: none; }`}</style>

      <header style={{ background: "linear-gradient(135deg, #2d5a1b 0%, #4a8a2a 100%)", padding: "0 12px", position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 20px rgba(0,0,0,0.2)" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0" }}>
          {/* Logo + nom */}
          <div onClick={() => setView("about")} style={{ cursor: "pointer", display: "flex", alignItems: "center", gap: 8, flexShrink: 1, minWidth: 0 }}>
            <img src="https://raw.githubusercontent.com/Potagerdesion/potager-click-collect/main/IMG_1149.jpeg" alt="Logo" style={{ width: 42, height: 42, borderRadius: "50%", objectFit: "cover", border: "2px solid rgba(255,255,255,0.4)", flexShrink: 0 }} />
            <div style={{ minWidth: 0 }}>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 15, color: "#fff", fontWeight: 700, lineHeight: 1.2, whiteSpace: "nowrap" }}>Le Potager</div>
              <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 10, color: "#fff", fontWeight: 700, lineHeight: 1.3, whiteSpace: "nowrap" }}>de la Colline de Sion</div>
              <div style={{ fontSize: 9, color: "#b8dda0", letterSpacing: 1, textTransform: "uppercase", marginTop: 1, whiteSpace: "nowrap" }}>Fruits & Légumes · Permaculture</div>
            </div>
          </div>
          {/* Boutons */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: isMobile ? 4 : 6, alignItems: "center", flexShrink: 0, marginLeft: 8 }}>
            <button onClick={() => setView("about")} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "4px 7px", color: "#fff", cursor: "pointer", fontSize: 10, lineHeight: 1.3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 72 }}>
              <div style={{ fontSize: 14 }}>🌿</div>
              <div style={{ whiteSpace: "nowrap" }}>Notre histoire</div>
            </button>
            <button onClick={() => setShowPinModal(true)} style={{ background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: 8, padding: "4px 7px", color: "#fff", cursor: "pointer", fontSize: 10, lineHeight: 1.3, textAlign: "center", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", width: 72 }}>
              <div style={{ fontSize: 14 }}>⚙️</div>
              <div style={{ whiteSpace: "nowrap" }}>Admin</div>
            </button>
            {view === "shop" && (
              <button onClick={() => cartCount > 0 && setView("checkout")} style={{ background: cartCount > 0 ? "#fff" : "rgba(255,255,255,0.2)", color: cartCount > 0 ? "#3a6e3a" : "#bbb", border: "none", borderRadius: 99, padding: isMobile ? "5px 8px" : "6px 12px", fontWeight: 700, fontSize: isMobile ? 11 : 12, cursor: cartCount > 0 ? "pointer" : "default", whiteSpace: "nowrap" }}>
                🛒 {cartCount > 0 ? `${cartCount} · ${fmt(total)}` : "Panier"}
              </button>
            )}
          </div>
        </div>
      </header>

      {showPinModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ background: "#fff", borderRadius: 16, padding: 28, width: 300, textAlign: "center" }}>
            <h3 style={{ marginTop: 0, fontFamily: "'Playfair Display', serif" }}>Accès producteur</h3>
            <input type="password" value={adminPin} onChange={e => setAdminPin(e.target.value)} placeholder="Code PIN"
              style={{ ...inputStyle, textAlign: "center", letterSpacing: 6, fontSize: 22, marginBottom: 12 }} />
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => { setShowPinModal(false); setAdminPin(""); }} style={{ flex: 1, padding: 10, borderRadius: 10, border: "1.5px solid #ddd", background: "#fff", cursor: "pointer" }}>Annuler</button>
              <button onClick={() => { if (adminPin === PIN) { setView("admin"); setShowPinModal(false); setAdminPin(""); } else { alert("Code incorrect"); setAdminPin(""); } }}
                style={{ flex: 1, padding: 10, borderRadius: 10, border: "none", background: "#3a6e3a", color: "#fff", fontWeight: 700, cursor: "pointer" }}>
                Entrer
              </button>
            </div>
          </div>
        </div>
      )}

      <main style={{ maxWidth: 900, margin: "0 auto", padding: "28px 16px" }}>
        {view === "shop" && (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: 28, color: "#2d5a1b", margin: "0 0 8px" }}>Nos produits de saison</h1>
              <p style={{ color: "#778", fontSize: 14, margin: 0 }}>Réservez en ligne, réglez par carte et venez récupérer à la ferme 🌱</p>
            </div>
            <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
              {categories.map(c => (
                <button key={c} onClick={() => setFilter(c)} style={{ padding: "7px 16px", borderRadius: 99, border: `1.5px solid ${filter === c ? "#3a6e3a" : "#ddd"}`, background: filter === c ? "#3a6e3a" : "#fff", color: filter === c ? "#fff" : "#555", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>{c}</button>
              ))}
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} qty={cart[p.id] || 0} onAdd={addToCart} onRemove={removeFromCart} />)}
            </div>
            {cartCount > 0 && (
              <div onClick={() => setView("checkout")} style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", background: "linear-gradient(135deg, #3a6e3a, #5a9e3a)", color: "#fff", borderRadius: 99, padding: "14px 32px", boxShadow: "0 8px 30px rgba(60,110,60,0.4)", cursor: "pointer", fontWeight: 700, fontSize: 16, display: "flex", gap: 12, alignItems: "center", whiteSpace: "nowrap" }}>
                <span>🛒 {cartCount} article{cartCount > 1 ? "s" : ""}</span>
                <span style={{ opacity: .7 }}>|</span>
                <span>Commander · {fmt(total)}</span>
              </div>
            )}
          </>
        )}
        {view === "checkout" && <CheckoutForm cart={cart} products={products} total={total} onSuccess={handleSuccess} onBack={() => setView("shop")} />}
        {view === "success" && orderInfo && <SuccessScreen info={orderInfo} onReset={() => setView("shop")} />}
        {view === "admin" && <AdminPanel products={products} onSave={handleSaveProduct} onDelete={handleDeleteProduct} onStockChange={handleStockChange} orders={orders} onClose={() => setView("shop")} />}
        {view === "about" && <AboutPage onBack={() => setView("shop")} />}
      </main>
    </div>
  );
}

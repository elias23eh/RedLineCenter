"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard, Package, Tag, BarChart2, Settings,
  Plus, Pencil, Trash2, Check, X, Search, ChevronDown,
  LogOut, Zap, ArrowUpRight
} from "lucide-react";

type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  description: string;
  image: string;
  featured: boolean;
  inStock: boolean;
};

type Category = {
  id: string;
  name: string;
  description: string;
  icon: string;
  subcategories: string[];
};

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "products", label: "Products", icon: Package },
  { id: "categories", label: "Categories", icon: Tag },
];

const EMPTY_PRODUCT: Omit<Product, "id"> = {
  name: "",
  category: "engine-system",
  price: 0,
  description: "",
  image: "",
  featured: false,
  inStock: true,
};

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [activeNav, setActiveNav] = useState("dashboard");
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [search, setSearch] = useState("");
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [newProduct, setNewProduct] = useState<Omit<Product, "id">>(EMPTY_PRODUCT);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);

  useEffect(() => {
    fetch("/api/products").then((r) => r.json()).then(setProducts).catch(() => {});
    fetch("/api/categories").then((r) => r.json()).then(setCategories).catch(() => {});
  }, []);

  function showSaved() {
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2000);
  }

  function handleLogin() {
    if (pin === "1234") {
      setAuthed(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  }

  async function saveProducts(updated: Product[]) {
    setProducts(updated);
    await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    showSaved();
  }

  function addProduct() {
    const id = String(Date.now());
    const created: Product = { id, ...newProduct };
    saveProducts([...products, created]);
    setAddingProduct(false);
    setNewProduct(EMPTY_PRODUCT);
  }

  function updateProduct(updated: Product) {
    saveProducts(products.map((p) => (p.id === updated.id ? updated : p)));
    setEditingProduct(null);
  }

  function deleteProduct(id: string) {
    saveProducts(products.filter((p) => p.id !== id));
    setDeleteConfirm(null);
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.category.toLowerCase().includes(search.toLowerCase())
  );

  // LOGIN SCREEN
  if (!authed) {
    return (
      <div
        style={{
          minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
          backgroundColor: "var(--bg)", padding: "1.5rem",
        }}
      >
        <div
          style={{
            backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
            borderRadius: 16, padding: "2.5rem", width: "100%", maxWidth: 380, textAlign: "center",
          }}
        >
          <div style={{ marginBottom: "2rem" }}>
            <span style={{ fontSize: "1.8rem", fontWeight: 900 }}>
              RED<span style={{ color: "var(--red)" }}>LINE</span>
            </span>
            <span style={{ display: "block", fontSize: "0.65rem", letterSpacing: "3px", color: "var(--text-muted)", marginTop: 2 }}>
              ADMIN PANEL
            </span>
          </div>

          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: "1.5rem" }}>
            Enter your PIN to access the dashboard
          </p>

          <input
            type="password"
            placeholder="PIN"
            value={pin}
            onChange={(e) => { setPin(e.target.value); setPinError(false); }}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            style={{
              width: "100%", padding: "0.75rem 1rem",
              backgroundColor: "var(--bg-card2)", border: `1px solid ${pinError ? "var(--red)" : "var(--border)"}`,
              borderRadius: 8, color: "var(--text)", fontSize: "1rem",
              textAlign: "center", letterSpacing: "8px", outline: "none",
              marginBottom: "0.75rem",
            }}
          />
          {pinError && <p style={{ color: "var(--red)", fontSize: "0.8rem", marginBottom: "0.75rem" }}>Incorrect PIN</p>}

          <button
            onClick={handleLogin}
            style={{
              width: "100%", padding: "0.8rem", backgroundColor: "var(--red)",
              color: "white", border: "none", borderRadius: 8,
              fontSize: "0.9rem", fontWeight: 700, cursor: "pointer",
            }}
          >
            Access Dashboard
          </button>
          <p style={{ color: "var(--text-muted)", fontSize: "0.75rem", marginTop: "1.5rem" }}>
            Default PIN: 1234 (change in settings)
          </p>
        </div>
      </div>
    );
  }

  // ADMIN DASHBOARD
  return (
    <div style={{ minHeight: "100vh", display: "flex", backgroundColor: "var(--bg)" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: 220, flexShrink: 0, backgroundColor: "var(--bg-card)",
          borderRight: "1px solid var(--border)", padding: "1.5rem 1rem",
          display: "flex", flexDirection: "column", position: "fixed",
          top: 0, left: 0, bottom: 0, zIndex: 50,
        }}
      >
        <div style={{ marginBottom: "2rem", paddingLeft: "0.5rem" }}>
          <span style={{ fontSize: "1.2rem", fontWeight: 900 }}>
            RED<span style={{ color: "var(--red)" }}>LINE</span>
          </span>
          <span style={{ display: "block", fontSize: "0.55rem", letterSpacing: "3px", color: "var(--text-muted)", marginTop: 2 }}>
            ADMIN PANEL
          </span>
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "0.25rem" }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveNav(id)}
              style={{
                display: "flex", alignItems: "center", gap: "0.75rem",
                padding: "0.7rem 0.75rem", borderRadius: 8, border: "none",
                cursor: "pointer", textAlign: "left", fontSize: "0.88rem",
                fontWeight: activeNav === id ? 700 : 500,
                backgroundColor: activeNav === id ? "rgba(227,28,28,0.12)" : "transparent",
                color: activeNav === id ? "var(--red)" : "var(--text-muted)",
                transition: "all 0.15s",
              }}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "1rem", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
          <a
            href="/"
            target="_blank"
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.6rem 0.75rem", borderRadius: 8,
              color: "var(--text-muted)", textDecoration: "none", fontSize: "0.82rem",
            }}
          >
            <ArrowUpRight size={14} /> View Site
          </a>
          <button
            onClick={() => setAuthed(false)}
            style={{
              display: "flex", alignItems: "center", gap: "0.6rem",
              padding: "0.6rem 0.75rem", borderRadius: 8, border: "none",
              cursor: "pointer", color: "var(--text-muted)", fontSize: "0.82rem",
              backgroundColor: "transparent", textAlign: "left",
            }}
          >
            <LogOut size={14} /> Logout
          </button>
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, marginLeft: 220, padding: "2rem", minWidth: 0 }}>
        {/* Saved toast */}
        {savedMsg && (
          <div style={{
            position: "fixed", bottom: 24, right: 24,
            backgroundColor: "#16a34a", color: "white",
            padding: "0.75rem 1.25rem", borderRadius: 8,
            fontSize: "0.85rem", fontWeight: 600, zIndex: 200,
            display: "flex", alignItems: "center", gap: "0.5rem",
          }}>
            <Check size={15} /> Saved successfully
          </div>
        )}

        {/* DASHBOARD */}
        {activeNav === "dashboard" && (
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Dashboard</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>Overview of your store</p>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "1rem", marginBottom: "2.5rem" }}>
              {[
                { label: "Total Products", value: products.length, color: "var(--red)" },
                { label: "In Stock", value: products.filter((p) => p.inStock).length, color: "#16a34a" },
                { label: "Out of Stock", value: products.filter((p) => !p.inStock).length, color: "#ca8a04" },
                { label: "Featured", value: products.filter((p) => p.featured).length, color: "#7c3aed" },
                { label: "Categories", value: categories.length, color: "#0891b2" },
              ].map((stat) => (
                <div
                  key={stat.label}
                  style={{
                    backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "1.5rem",
                  }}
                >
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", letterSpacing: "1px", marginBottom: "0.5rem" }}>
                    {stat.label.toUpperCase()}
                  </p>
                  <p style={{ fontSize: "2rem", fontWeight: 800, color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, padding: "1.5rem" }}>
              <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.95rem" }}>Recent Products</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
                {products.slice(-5).reverse().map((p) => (
                  <div key={p.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "0.6rem 0", borderBottom: "1px solid var(--border)" }}>
                    <div>
                      <p style={{ fontSize: "0.88rem", fontWeight: 600 }}>{p.name}</p>
                      <p style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>{p.category.replace(/-/g, " ")}</p>
                    </div>
                    <span style={{ fontSize: "0.95rem", fontWeight: 700, color: "var(--red)" }}>${p.price}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* PRODUCTS */}
        {activeNav === "products" && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem", flexWrap: "wrap", gap: "1rem" }}>
              <div>
                <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.25rem" }}>Products</h1>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>{products.length} total</p>
              </div>
              <button
                onClick={() => { setAddingProduct(true); setNewProduct(EMPTY_PRODUCT); }}
                style={{
                  display: "flex", alignItems: "center", gap: "0.5rem",
                  backgroundColor: "var(--red)", color: "white",
                  padding: "0.65rem 1.25rem", borderRadius: 8, border: "none",
                  fontSize: "0.88rem", fontWeight: 700, cursor: "pointer",
                }}
              >
                <Plus size={15} /> Add Product
              </button>
            </div>

            {/* Search */}
            <div style={{ position: "relative", marginBottom: "1.25rem" }}>
              <Search size={15} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--text-muted)" }} />
              <input
                type="text"
                placeholder="Search products..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{
                  width: "100%", paddingLeft: 36, paddingRight: 12,
                  paddingTop: "0.6rem", paddingBottom: "0.6rem",
                  backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                  borderRadius: 8, color: "var(--text)", fontSize: "0.88rem", outline: "none",
                }}
              />
            </div>

            {/* Add form */}
            {addingProduct && (
              <ProductForm
                product={newProduct as Product}
                categories={categories}
                onChange={(field, val) => setNewProduct((p) => ({ ...p, [field]: val }))}
                onSave={addProduct}
                onCancel={() => setAddingProduct(false)}
                isNew
              />
            )}

            {/* Table */}
            <div style={{ backgroundColor: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: 12, overflow: "hidden" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
                <thead>
                  <tr style={{ borderBottom: "1px solid var(--border)" }}>
                    {["Name", "Category", "Price", "Stock", "Featured", "Actions"].map((h) => (
                      <th key={h} style={{ padding: "0.9rem 1rem", textAlign: "left", color: "var(--text-muted)", fontSize: "0.75rem", fontWeight: 700, letterSpacing: "1px" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product) => (
                    <>
                      <tr key={product.id} style={{ borderBottom: "1px solid var(--border)" }}>
                        <td style={{ padding: "0.9rem 1rem", fontWeight: 600 }}>{product.name}</td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--text-muted)", textTransform: "capitalize" }}>
                          {product.category.replace(/-/g, " ")}
                        </td>
                        <td style={{ padding: "0.9rem 1rem", color: "var(--red)", fontWeight: 700 }}>${product.price}</td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <span style={{
                            fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 4,
                            backgroundColor: product.inStock ? "rgba(22,163,74,0.12)" : "rgba(202,138,4,0.12)",
                            color: product.inStock ? "#16a34a" : "#ca8a04",
                          }}>
                            {product.inStock ? "In Stock" : "Out of Stock"}
                          </span>
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          {product.featured ? <Check size={15} color="#16a34a" /> : <X size={15} color="var(--text-muted)" />}
                        </td>
                        <td style={{ padding: "0.9rem 1rem" }}>
                          <div style={{ display: "flex", gap: "0.5rem" }}>
                            <button
                              onClick={() => setEditingProduct(product)}
                              style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}
                            >
                              <Pencil size={14} />
                            </button>
                            {deleteConfirm === product.id ? (
                              <span style={{ display: "flex", gap: "0.4rem", alignItems: "center" }}>
                                <button onClick={() => deleteProduct(product.id)} style={{ background: "var(--red)", border: "none", color: "white", fontSize: "0.72rem", padding: "0.2rem 0.5rem", borderRadius: 4, cursor: "pointer" }}>Delete</button>
                                <button onClick={() => setDeleteConfirm(null)} style={{ background: "none", border: "none", color: "var(--text-muted)", cursor: "pointer" }}>Cancel</button>
                              </span>
                            ) : (
                              <button onClick={() => setDeleteConfirm(product.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "var(--text-muted)", padding: 4 }}>
                                <Trash2 size={14} />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                      {editingProduct?.id === product.id && (
                        <tr key={`edit-${product.id}`}>
                          <td colSpan={6} style={{ padding: "0 1rem 1rem" }}>
                            <ProductForm
                              product={editingProduct}
                              categories={categories}
                              onChange={(field, val) => setEditingProduct((p) => p ? ({ ...p, [field]: val }) : null)}
                              onSave={() => updateProduct(editingProduct)}
                              onCancel={() => setEditingProduct(null)}
                            />
                          </td>
                        </tr>
                      )}
                    </>
                  ))}
                </tbody>
              </table>
              {filtered.length === 0 && (
                <div style={{ textAlign: "center", padding: "3rem", color: "var(--text-muted)" }}>
                  <Zap size={32} color="rgba(227,28,28,0.15)" style={{ margin: "0 auto 0.75rem" }} />
                  <p>No products found</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* CATEGORIES */}
        {activeNav === "categories" && (
          <div>
            <h1 style={{ fontSize: "1.5rem", fontWeight: 800, marginBottom: "0.5rem" }}>Categories</h1>
            <p style={{ color: "var(--text-muted)", fontSize: "0.88rem", marginBottom: "2rem" }}>{categories.length} categories</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1rem" }}>
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  style={{
                    backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
                    borderRadius: 12, padding: "1.25rem",
                  }}
                >
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.75rem" }}>
                    <div>
                      <h3 style={{ fontWeight: 700, fontSize: "0.95rem", marginBottom: "0.25rem" }}>{cat.name}</h3>
                      <p style={{ color: "var(--text-muted)", fontSize: "0.78rem" }}>{cat.description}</p>
                    </div>
                    <span style={{
                      fontSize: "0.72rem", fontWeight: 700, padding: "0.2rem 0.6rem", borderRadius: 4,
                      backgroundColor: "rgba(227,28,28,0.12)", color: "var(--red)",
                    }}>
                      {products.filter((p) => p.category === cat.id).length} items
                    </span>
                  </div>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {cat.subcategories.slice(0, 4).map((sub) => (
                      <span key={sub} style={{
                        fontSize: "0.68rem", padding: "0.2rem 0.5rem",
                        backgroundColor: "var(--bg-card2)", border: "1px solid var(--border)",
                        borderRadius: 4, color: "var(--text-muted)",
                      }}>
                        {sub}
                      </span>
                    ))}
                    {cat.subcategories.length > 4 && (
                      <span style={{ fontSize: "0.68rem", color: "var(--text-muted)", padding: "0.2rem 0.4rem" }}>
                        +{cat.subcategories.length - 4} more
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function ProductForm({
  product, categories, onChange, onSave, onCancel, isNew = false,
}: {
  product: Product;
  categories: Category[];
  onChange: (field: string, val: string | number | boolean) => void;
  onSave: () => void;
  onCancel: () => void;
  isNew?: boolean;
}) {
  return (
    <div style={{
      backgroundColor: "var(--bg-card2)", border: "1px solid rgba(227,28,28,0.3)",
      borderRadius: 10, padding: "1.25rem", marginBottom: isNew ? "1rem" : 0, marginTop: isNew ? 0 : "0.5rem",
    }}>
      <h3 style={{ fontWeight: 700, marginBottom: "1rem", fontSize: "0.9rem", color: "var(--red)" }}>
        {isNew ? "Add New Product" : "Edit Product"}
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "0.75rem" }}>
        <div>
          <label style={labelStyle}>Product Name</label>
          <input value={product.name} onChange={(e) => onChange("name", e.target.value)} style={inputStyle} placeholder="e.g. HKS Blow Off Valve" />
        </div>
        <div>
          <label style={labelStyle}>Category</label>
          <select value={product.category} onChange={(e) => onChange("category", e.target.value)} style={inputStyle}>
            {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
          </select>
        </div>
        <div>
          <label style={labelStyle}>Price (USD)</label>
          <input type="number" value={product.price} onChange={(e) => onChange("price", Number(e.target.value))} style={inputStyle} placeholder="0" />
        </div>
        <div style={{ gridColumn: "1 / -1" }}>
          <label style={labelStyle}>Description</label>
          <textarea value={product.description} onChange={(e) => onChange("description", e.target.value)} style={{ ...inputStyle, minHeight: 72, resize: "vertical" }} placeholder="Brief product description..." />
        </div>
        <div style={{ display: "flex", gap: "1.5rem", alignItems: "center" }}>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
            <input type="checkbox" checked={product.inStock} onChange={(e) => onChange("inStock", e.target.checked)} style={{ accentColor: "var(--red)" }} />
            In Stock
          </label>
          <label style={{ display: "flex", alignItems: "center", gap: "0.5rem", cursor: "pointer", fontSize: "0.85rem" }}>
            <input type="checkbox" checked={product.featured} onChange={(e) => onChange("featured", e.target.checked)} style={{ accentColor: "var(--red)" }} />
            Featured
          </label>
        </div>
      </div>
      <div style={{ display: "flex", gap: "0.75rem", marginTop: "1rem" }}>
        <button
          onClick={onSave}
          style={{
            backgroundColor: "var(--red)", color: "white", border: "none",
            padding: "0.6rem 1.25rem", borderRadius: 7, fontSize: "0.85rem",
            fontWeight: 700, cursor: "pointer",
          }}
        >
          {isNew ? "Add Product" : "Save Changes"}
        </button>
        <button
          onClick={onCancel}
          style={{
            backgroundColor: "transparent", color: "var(--text-muted)",
            border: "1px solid var(--border)", padding: "0.6rem 1.25rem",
            borderRadius: 7, fontSize: "0.85rem", cursor: "pointer",
          }}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

const labelStyle: React.CSSProperties = {
  display: "block", fontSize: "0.75rem", fontWeight: 600,
  color: "var(--text-muted)", marginBottom: "0.35rem", letterSpacing: "0.5px",
};
const inputStyle: React.CSSProperties = {
  width: "100%", padding: "0.55rem 0.75rem",
  backgroundColor: "var(--bg-card)", border: "1px solid var(--border)",
  borderRadius: 7, color: "var(--text)", fontSize: "0.85rem", outline: "none",
};

import { useState, useEffect, useMemo } from "react";
import PRODUCTS from "./products";
import logo from "./images/unnamed.png";
import naturalOak from "./images/Natural Oak.png";
import naturalBeech from "./images/Natural Beech.png";
import tobaccoOak from "./images/Tobacco Oak.png";
const CATEGORIES = ["All", "Chairs", "Sofas", "Benches"];
const SORT_OPT   = ["Featured", "Name A–Z", "Category"];


const WOOD_TONES = {
  Birch: "#D4C5A9", Oak: "#C4A882", Ash: "#B8A99A",
  Beech: "#C9B99A", Pine: "#C6A87A", Walnut: "#8B6347",
  Rattan: "#C8A96E", Marble: "#DDDAD4", Steel: "#9AA3A8",
};
function swatch(material) {
  for (const [k, v] of Object.entries(WOOD_TONES)) if (material.includes(k)) return v;
  return "#B8A99A";
}

/* ── Global responsive rules ──
   Inline styles win over normal stylesheet rules, so the mobile
   overrides below use !important to take priority at each breakpoint.
   This lets every page keep its desktop inline styles unchanged. */
function GlobalStyles() {
  return (
    <style>{`
      @media (max-width: 900px) {
        .sh-layout { flex-direction: column !important; }
        .sh-sidebar {
          width: 100% !important;
          box-sizing: border-box !important;
          position: static !important;
          border-right: none !important;
          border-bottom: 1px solid #E8E2D9 !important;
          min-height: auto !important;
        }
        .sh-detail-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
        .sh-related-grid { grid-template-columns: repeat(2, 1fr) !important; }
      }

      @media (max-width: 640px) {
        .sh-nav-cat {
          flex-direction: column !important;
          align-items: flex-start !important;
          height: auto !important;
          padding: 16px 20px !important;
          gap: 12px !important;
        }
        .sh-nav-links {
          padding-left: 0 !important;
          gap: 18px !important;
          flex-wrap: wrap !important;
          width: 100% !important;
        }
        .sh-nav-spacer { display: none !important; }

        .sh-detail-nav { padding: 0 20px !important; gap: 8px !important; }
        .sh-detail-nav-back span:last-child { display: none; }

        .sh-hero { padding: 56px 20px 36px !important; }

        .sh-content-padding { padding: 36px 20px !important; }
        .sh-main-padding { padding: 20px 16px !important; }

        .sh-product-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)) !important; gap: 12px !important; }
        .sh-related-grid { grid-template-columns: 1fr !important; }

        .sh-footer {
          flex-direction: column !important;
          align-items: flex-start !important;
          gap: 6px !important;
          padding: 20px !important;
        }
      }
    `}</style>
  );
}

/* ── Furniture illustrations ── */
function FurnitureArt({ category, material, size = "small" }) {
  const tone = swatch(material);
  const bg = size === "large" ? "#EFEBE3" : "#F7F5F0";
  const vb = size === "large" ? "0 0 480 360" : "0 0 240 180";
  const s = size === "large" ? 2 : 1;
}

  
  
/* ── Tag chip ── */
function Tag({ label }) {
  return (
    <div style={{
      display: "inline-block",
      border: `1px solid ${label === "New" ? "#8C7355" : "#2C2C2C"}`,
      color: label === "New" ? "#8C7355" : "#2C2C2C",
      fontSize: 9, fontWeight: 600, letterSpacing: "0.14em",
      padding: "2px 7px", textTransform: "uppercase",
    }}>{label}</div>
  );
}

/* ── Product card── */
function ProductCard({ product, onOpen }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: "#FFFFFF", border: "1px solid #E8E2D9", cursor: "pointer",
        transition: "box-shadow 0.25s ease",
        boxShadow: hovered ? "0 8px 32px rgba(44,44,44,0.1)" : "none",
        display: "flex", flexDirection: "column",
      }}
    >
      {/* Illustration */}
      <div style={{ position: "relative", height: 300, background: "white", overflow: "hidden" }}>
        <div
        style={{
          position: "relative",
          height: 300,
          background: "white",
          overflow: "hidden",
        }}>
          <img
            src={product.images}
              alt={product.name}
              style={{
                width: 220,
                height: 220,
                maxWidth: "80%",
                maxHeight: "80%",
                objectFit: "contain",
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
              }}/>
          </div>
        {/* hover: show description */}
        <div style={{
          position: "absolute", inset: 0, background: "rgba(247,245,240,0.96)",
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          padding: 24, gap: 14,
          opacity: hovered ? 1 : 0, transition: "opacity 0.22s ease",
        }}>
          <p style={{ color: "#2C2C2C", fontSize: 12, lineHeight: 1.7, textAlign: "center", margin: 0, fontStyle: "italic" }}>
            {product.description}
          </p>
          <div style={{ display: "flex", gap: 18 }}>
            {[["W", product.w], ["H", product.h], ["D", product.d]].map(([l, v]) => (
              <div key={l} style={{ textAlign: "center" }}>
                <div style={{ fontSize: 13, color: "#2C2C2C", fontWeight: 500 }}>{v}</div>
                <div style={{ fontSize: 9, color: "#B8AFA2", letterSpacing: "0.1em", textTransform: "uppercase" }}>{l} cm</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: "14px 16px 16px", borderTop: "1px solid #E8E2D9", flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", gap: 12 }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: 14, fontFamily: "'DM Serif Display', serif", color: "#2C2C2C", marginBottom: 4, lineHeight: 1.2 }}>
              {product.name}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: swatch(product.material), border: "1px solid #E8E2D9" }} />
              <span style={{ fontSize: 10, color: "#B8AFA2", letterSpacing: "0.06em" }}>{product.material}</span>
            </div>
          </div>
          {product.tag && <Tag label={product.tag} />}
        </div>

        <button
          onClick={() => onOpen(product)}
          style={{
            width: "100%", background: "transparent", border: "1px solid #2C2C2C",
            color: "#2C2C2C", fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase",
            padding: "9px 0", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "all 0.18s",
          }}
          onMouseEnter={e => { e.currentTarget.style.background = "#2C2C2C"; e.currentTarget.style.color = "#F7F5F0"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#2C2C2C"; }}
        >
          See more
        </button>
      </div>
    </div>
  );
}

/* ── Detail page ── */
function DetailPage({ product, onBack }) {
  const [activeView, setActiveView] = useState(0);
  const views = ["Front view", "Side view", "Top view"];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <GlobalStyles />

      {/* Nav */}
      <nav className="sh-detail-nav" style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        padding: "0 48px", height: 60, borderBottom: "1px solid #E8E2D9",
        position: "sticky", top: 0,
        background: "rgba(247,245,240,0.96)", backdropFilter: "blur(8px)", zIndex: 100,
      }}>
        <img
          src={logo}
          alt="Sahem Hromos"
          style={{
          height: 60, 
          width: "auto",
          maxWidth: "40vw",
          display: "block",
          }}/>
        <button
          onClick={onBack}
          className="sh-detail-nav-back"
          style={{
            background: "transparent", border: "none", cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
            color: "#B8AFA2", fontFamily: "'DM Sans', sans-serif",
            padding: 0, transition: "color 0.15s", whiteSpace: "nowrap",
          }}
          onMouseEnter={e => e.currentTarget.style.color = "#2C2C2C"}
          onMouseLeave={e => e.currentTarget.style.color = "#B8AFA2"}
        >
          <span style={{ fontSize: 16, lineHeight: 1 }}>←</span> <span>Back to catalogue</span>
        </button>
      </nav>

      {/* Content */}
      <div className="sh-content-padding" style={{ maxWidth: 1100, margin: "0 auto", padding: "60px 48px" }}>

        {/* Top section: illustration + info */}
        <div className="sh-detail-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64, alignItems: "start", marginBottom: 80 }}>

          {/* Left: large illustration + view switcher */}
          <div>
            <div style={{ background: "#EFEBE3", marginBottom: 12, overflow: "hidden" }}>
              <FurnitureArt category={product.category} material={product.material} size="large" />
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              {views.map((v, i) => (
                <button key={v} onClick={() => setActiveView(i)} style={{
                  flex: 1, padding: "7px 0", fontSize: 9, letterSpacing: "0.12em",
                  textTransform: "uppercase", cursor: "pointer",
                  fontFamily: "'DM Sans', sans-serif",
                  background: activeView === i ? "#2C2C2C" : "transparent",
                  color: activeView === i ? "#F7F5F0" : "#B8AFA2",
                  border: "1px solid #E8E2D9",
                  transition: "all 0.15s",
                }}>
                  {v}
                </button>
              ))}
            </div>
            {/* Small thumbnail views */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 8, marginTop: 8 }}>
              {[0,1,2].map(i => (
                <div
                  key={i}
                  onClick={() => setActiveView(i)}
                  style={{
                    border: `1px solid ${activeView === i ? "#2C2C2C" : "#E8E2D9"}`,
                    background: "#EFEBE3", overflow: "hidden", cursor: "pointer",
                    opacity: activeView === i ? 1 : 0.6, transition: "all 0.15s",
                  }}
                >
                  <div style={{ transform: `rotate(${i * 90}deg) scale(0.9)`, transformOrigin: "center" }}>
                    <FurnitureArt category={product.category} material={product.material} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: product info */}
          <div style={{ paddingTop: 8 }}>
            <div style={{ fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase", color: "#8C7355", marginBottom: 14 }}>
              {product.category}
            </div>
            <h1 style={{
              fontFamily: "'DM Serif Display', serif", fontSize: "clamp(28px, 3.5vw, 42px)",
              fontWeight: 400, lineHeight: 1.15, margin: "0 0 10px",
            }}>
              {product.name}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 28 }}>
              <div style={{ width: 10, height: 10, borderRadius: "50%", background: swatch(product.material), border: "1px solid #E8E2D9" }} />
              <span style={{ fontSize: 12, color: "#B8AFA2", letterSpacing: "0.06em" }}>{product.material}</span>
              {product.tag && <span style={{ marginLeft: 4 }}><Tag label={product.tag} /></span>}
            </div>

            {/* Long description */}
            <div style={{ marginBottom: 36 }}>
              {product.longDescription.split("\n\n").map((para, i) => (
                <p key={i} style={{ fontSize: 14, color: "#555", lineHeight: 1.8, margin: "0 0 16px", fontStyle: i === 0 ? "italic" : "normal" }}>
                  {para}
                </p>
              ))}
            </div>

            {/* Divider */}
            <div style={{ borderTop: "1px solid #E8E2D9", paddingTop: 28, marginBottom: 28 }}>

              {/* Dimensions */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 12 }}>
                  Dimensions
                </div>
                <div style={{ display: "flex", gap: 24, flexWrap: "wrap" }}>
                  {[["Width", product.w], ["Height", product.h], ["Depth", product.d]].map(([l, v]) => (
                    <div key={l}>
                      <div style={{ fontSize: 20, fontFamily: "'DM Serif Display', serif", color: "#2C2C2C" }}>{v}<span style={{ fontSize: 12, marginLeft: 2 }}>cm</span></div>
                      <div style={{ fontSize: 10, color: "#B8AFA2", letterSpacing: "0.08em", textTransform: "uppercase", marginTop: 2 }}>{l}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Finishes */}
              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10 }}>
                  Available Finishes
                </div>
                <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                  {product.finishes.map(f => (
                    <div key={f} style={{
                      border: "1px solid #E8E2D9", padding: "5px 12px",
                      fontSize: 11, color: "#2C2C2C", letterSpacing: "0.04em",
                    }}>{f}</div>
                  ))}
                </div>
              </div>

              {/* Lead time */}
              <div style={{ marginBottom: 28 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 6 }}>
                  Lead time
                </div>
                <div style={{ fontSize: 13, color: "#2C2C2C" }}>{product.lead}</div>
              </div>

              {/* Care */}
              <div style={{ marginBottom: 32 }}>
                <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 6 }}>
                  Care
                </div>
                <div style={{ fontSize: 12, color: "#888", lineHeight: 1.7 }}>{product.care}</div>
              </div>

              {/* CTA */}
              <button style={{
                width: "100%", background: "#2C2C2C", border: "none",
                color: "#F7F5F0", fontSize: 11, letterSpacing: "0.16em",
                textTransform: "uppercase", padding: "15px 0",
                cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                transition: "background 0.18s",
              }}
                onMouseEnter={e => e.currentTarget.style.background = "#8C7355"}
                onMouseLeave={e => e.currentTarget.style.background = "#2C2C2C"}
              >
                Enquire about this piece
              </button>
            </div>
          </div>
        </div>

        {/* Bottom: also from this category */}
        <div>
          <div style={{ borderTop: "1px solid #E8E2D9", paddingTop: 40, marginBottom: 28 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "#B8AFA2" }}>
              Also in {product.category}
            </div>
          </div>
          <div className="sh-related-grid" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 16 }}>
            {PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3).map(p => (
              <ProductCard key={p.id} product={p} onOpen={onBack_then => {}} />
            ))}
          </div>
        </div>
      </div>

      <footer className="sh-footer" style={{
        borderTop: "1px solid #E8E2D9", padding: "28px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 11, letterSpacing: "0.08em", color: "#B8AFA2", textTransform: "uppercase",
      }}>
        <span>© 2026 Sahem Hromos — Skopje</span>
        <span>Made slowly. Made to last.</span>
      </footer>
    </div>
  );
}

/* ── Sidebar label ── */
function FilterLabel({ children }) {
  return (
    <div style={{ fontSize: 9, fontWeight: 600, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10, marginTop: 24 }}>
      {children}
    </div>
  );
}

/* ── Main catalogue page ── */
function CataloguePage({ onOpen, onNavigate }) {
  const [activeCategory, setActiveCategory] = useState("All");
  const [activeMaterial, setActiveMaterial] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCategory !== "All") list = list.filter(p => p.category === activeCategory);
    if (activeMaterial !== "All") list = list.filter(p => p.material.includes(activeMaterial));
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (sortBy === "Name A–Z") list.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "Category") list.sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [activeCategory, activeMaterial, sortBy, search]);

  const pillStyle = (active) => ({
    padding: "5px 14px", fontSize: 11, cursor: "pointer",
    border: `1px solid ${active ? "#2C2C2C" : "#E8E2D9"}`,
    background: active ? "#2C2C2C" : "transparent",
    color: active ? "#F7F5F0" : "#B8AFA2",
    letterSpacing: "0.04em", transition: "all 0.18s", whiteSpace: "nowrap",
    fontFamily: "'DM Sans', sans-serif",
  });

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <GlobalStyles />

      {/* NAV */}
      <nav className="sh-nav-cat" style={{
        display: "flex", alignItems: "center", justifyContent: "flex-start",
        padding: "0 48px", height: 90, borderBottom: "1px solid #E8E2D9",
        position: "sticky", top: 0,
        background: "rgba(247,245,240,0.96)", backdropFilter: "blur(8px)", zIndex: 100,
      }}>
        <img
          src={logo}
          alt="Sahem Hromos"
          style={{
          height: 70,//change 
          width: "auto",
          maxWidth: "60vw",
          display: "block",
          }}/>
        <div className="sh-nav-links" style={{ display: "flex", gap: 36, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase", justifyContent:"flex-start", paddingLeft:"50px" }}>
          {["Catalogue", "Gallery", "About", "Contact"].map(item => (
            <span
              key={item}
              onClick={() => {
                if (item === "Catalogue") onNavigate("catalogue");
                if (item === "Gallery") onNavigate("gallery");
                if (item === "About") onNavigate("about");
                if (item === "Contact") onNavigate("contact");
              }}
              style={{
                cursor: "pointer",
                color: item === "Catalogue" ? "#8C7355" : "#B8AFA2",
                transition: "color 0.18s",
                borderBottom: item === "Catalogue" ? "1px solid #8C7355" : "1px solid transparent",
                paddingBottom: 2,
              }}
              onMouseEnter={e => e.currentTarget.style.color = "#2C2C2C"}
              onMouseLeave={e => e.currentTarget.style.color = item === "Catalogue" ? "#8C7355" : "#B8AFA2"}
            >
              {item}
            </span>
          ))}
        </div>
        <div className="sh-nav-spacer" style={{ width: 80 }} />
      </nav>

      {/* HERO */}
      <div
        className="sh-hero"
        style={{
          padding: "100px 48px 56px",
          borderBottom: "1px solid #E8E2D9",
          position: "relative",
          overflow: "hidden",
          }}>

  {/* TEXT LAYER */}
  <div style={{ position: "relative", zIndex: 2, maxWidth: 560 }}>
    <div
      style={{
        fontSize: 10,
        letterSpacing: "0.22em",
        textTransform: "uppercase",
        color: "#8C7355",
        marginBottom: 20,
      }}
    >
      Spring — Summer 2026
    </div>

    <h1
      style={{
        fontFamily: "'Playfair Display', serif",
        fontSize: "clamp(38px, 9vw, 80px)",
        fontWeight: 400,
        lineHeight: 1.15,
        margin: "0 0 20px",
      }}
    >
      Sahem Hromos
    </h1>

    <p
      style={{
        fontSize: 14,
        color: "#B8AFA2",
        lineHeight: 1.75,
        margin: 0,
        maxWidth: 400,
      }}
    >
      Solid woods, natural textiles, honest construction. Each piece designed for daily use and a lifetime of ownership.
    </p>
  </div>
</div>

      {/* LAYOUT */}
      <div className="sh-layout" style={{ display: "flex" }}>
        {/* SIDEBAR */}
        <aside className="sh-sidebar" style={{
          width: 220, flexShrink: 0, padding: "32px 28px",
          borderRight: "1px solid #E8E2D9",
          minHeight: "calc(100vh - 60px)",
          position: "sticky", top: 60, alignSelf: "flex-start",
          background: "#F7F5F0",
        }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search…"
            style={{
              width: "160px", boxSizing: "border-box",
              background: "#FFFFFF", border: "1px solid #E8E2D9",
              fontSize: 13, padding: "8px 12px", outline: "none",
              fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C",
            }}
          />
          <FilterLabel>Category</FilterLabel>
          {CATEGORIES.map(cat => (
            <div key={cat} onClick={() => setActiveCategory(cat)} style={{
              fontSize: 13, padding: "6px 0", cursor: "pointer",
              color: activeCategory === cat ? "#2C2C2C" : "#B8AFA2",
              fontWeight: activeCategory === cat ? 500 : 400,
              transition: "color 0.15s",
            }}>{cat}</div>
          ))}
        </aside>

        {/* MAIN */}
        <main className="sh-main-padding" style={{ flex: 1, padding: "28px 36px", minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24, flexWrap: "wrap", gap: 12 }}>
            <span style={{ fontSize: 12, color: "#B8AFA2" }}>
              <span style={{ color: "#2C2C2C" }}>{filtered.length}</span> pieces
            </span>
            <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
              {SORT_OPT.map(opt => (
                <button key={opt} onClick={() => setSortBy(opt)} style={pillStyle(sortBy === opt)}>{opt}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div style={{ padding: "80px 0", textAlign: "center", color: "#B8AFA2", fontSize: 14, fontStyle: "italic" }}>
              No pieces match your filters.
            </div>
          ) : (
            <div className="sh-product-grid" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 16 }}>
              {filtered.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
            </div>
          )}
        </main>
      </div>

      <footer className="sh-footer" style={{
        borderTop: "1px solid #E8E2D9", padding: "28px 48px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        fontSize: 11, letterSpacing: "0.08em", color: "#B8AFA2", textTransform: "uppercase",
      }}>
        <span>© 2026 Sahem Hromos — Gostivar</span>
        <span>Made slowly. Made to last.</span>
      </footer>
    </div>
  );
}

function GalleryPage({ onNavigate, onOpen }) {
  const [hoveredId, setHoveredId] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <GlobalStyles />

      {/* Navbar */}
      <nav className="sh-nav-cat" style={{
        display: "flex", alignItems: "center", justifyContent: "flex-start",
        padding: "0 48px", height: 90, borderBottom: "1px solid #E8E2D9",
        position: "sticky", top: 0,
        background: "rgba(247,245,240,0.96)", backdropFilter: "blur(8px)", zIndex: 100,
      }}>
        <img src={logo} alt="Sahem" style={{ height: 70, width: "auto", display: "block" }} />
        <div className="sh-nav-links" style={{ display: "flex", gap: 36, paddingLeft: 50, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span onClick={() => onNavigate("catalogue")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Catalogue</span>
          <span style={{ color: "#8C7355", borderBottom: "1px solid #8C7355", paddingBottom: 2 }}>Gallery</span>
          <span onClick={() => onNavigate("about")} style={{ cursor: "pointer", color: "#B8AFA2" }}>About</span>
          <span onClick={() => onNavigate("contact")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 48px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8C7355", marginBottom: 18 }}>
          Gallery
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(42px,7vw,72px)", marginBottom: 28, maxWidth: 700, lineHeight: 1.1 }}>
          A closer look
        </h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.9, maxWidth: 560, marginBottom: 60 }}>
          Every piece, photographed in the workshop. Click through to see materials,
          dimensions, and finishes for anything that catches your eye.
        </p>
      </div>

      {/* Photo grid */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 100px" }}>
        <div
          className="sh-product-grid"
          style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 20 }}
        >
          {PRODUCTS.map(p => (
            <div
              key={p.id}
              onMouseEnter={() => setHoveredId(p.id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onOpen(p)}
              style={{
                position: "relative", height: 340, background: "#fff",
                border: "1px solid #E8E2D9", overflow: "hidden", cursor: "pointer",
              }}
            >
              <img
                src={p.images}
                alt={p.name}
                style={{
                  width: "100%", height: "100%", objectFit: "cover",
                  transform: hoveredId === p.id ? "scale(1.05)" : "scale(1)",
                  transition: "transform 0.4s ease",
                }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, rgba(44,44,44,0.75), rgba(44,44,44,0) 50%)",
                opacity: hoveredId === p.id ? 1 : 0,
                transition: "opacity 0.25s ease",
                display: "flex", alignItems: "flex-end", padding: 20,
              }}>
                <div>
                  <div style={{ fontFamily: "'DM Serif Display', serif", color: "#F7F5F0", fontSize: 18, marginBottom: 4 }}>
                    {p.name}
                  </div>
                  <div style={{ color: "#E8E2D9", fontSize: 11, letterSpacing: "0.06em" }}>
                    {p.category} · {p.material}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="sh-footer" style={{
        borderTop: "1px solid #E8E2D9", padding: "28px 48px",
        display: "flex", justifyContent: "space-between",
        color: "#B8AFA2", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        <span>© 2026 Sahem Hromos — Gostivar</span>
        <span>Made slowly. Made to last.</span>
      </footer>
    </div>
  );
}

function AboutUs({ onNavigate }) {
  const values = [
    {
      title: "Solid Wood, Always",
      text: "No veneers, no particleboard shortcuts. Every frame is cut from solid oak, beech, walnut, or ash.",
    },
    {
      title: "Made By Hand",
      text: "Our joinery is done in small batches by craftsmen who've worked the same workshop floor for decades.",
    },
    {
      title: "Built To Outlive Trends",
      text: "We design for the next twenty years, not the next season. Quiet forms, honest materials.",
    },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <GlobalStyles />

      {/* Navbar */}
      <nav className="sh-nav-cat" style={{
        display: "flex", alignItems: "center", justifyContent: "flex-start",
        padding: "0 48px", height: 90, borderBottom: "1px solid #E8E2D9",
        position: "sticky", top: 0,
        background: "rgba(247,245,240,0.96)", backdropFilter: "blur(8px)", zIndex: 100,
      }}>
        <img src={logo} alt="Sahem" style={{ height: 70, width: "auto", display: "block" }} />
        <div className="sh-nav-links" style={{ display: "flex", gap: 36, paddingLeft: 50, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span onClick={() => onNavigate("catalogue")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Catalogue</span>
          <span onClick={() => onNavigate("materials")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Materials</span>
          <span style={{ color: "#8C7355", borderBottom: "1px solid #8C7355", paddingBottom: 2 }}>About</span>
          <span onClick={() => onNavigate("contact")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 48px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8C7355", marginBottom: 18 }}>
          About Us
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(42px,7vw,72px)", marginBottom: 28, maxWidth: 700, lineHeight: 1.1 }}>
          Furniture made the slow way
        </h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.9, maxWidth: 620, marginBottom: 80 }}>
          Sahem Hromos began as a small joinery workshop between Skopje and Gostivar, built on
          one idea: furniture should be made from real materials, by real hands, to be used for
          a lifetime — not replaced every few years. That idea hasn't changed since.
        </p>
      </div>

      {/* Story section */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 80px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 64 }} className="sh-detail-grid">
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 14 }}>
            Our Story
          </div>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>
            What started as a two-person workshop has grown into a small team of joiners,
            upholsterers, and finishers — but the process hasn't changed. Every chair, sofa,
            and bench still passes through the same hands from rough timber to finished piece.
          </p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }}>
            We work almost entirely with solid regional hardwoods — oak, beech, ash, walnut —
            and natural upholstery textiles like bouclé and chenille, chosen for how they age,
            not just how they photograph.
          </p>
        </div>
        <div>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 14 }}>
            Where We Work
          </div>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.9, marginBottom: 20 }}>
            Our workshop sits in Gostivar, where frames are cut, joined, and sanded by hand.
            Final assembly and finishing happen at our Skopje studio, where every piece is
            checked before it ships.
          </p>
          <p style={{ fontSize: 14, color: "#555", lineHeight: 1.9 }}>
            Because we make in small batches, lead times are longer than mass-produced
            furniture — usually a few weeks. We think that's a fair trade for something built
            to last decades.
          </p>
        </div>
      </div>

      {/* Values */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 100px" }}>
        <div style={{ borderTop: "1px solid #E8E2D9", paddingTop: 48, marginBottom: 40 }}>
          <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2" }}>
            What We Believe
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: 28 }}>
          {values.map(v => (
            <div key={v.title} style={{ background: "#fff", border: "1px solid #E8E2D9", padding: 30 }}>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontWeight: 400, fontSize: 20, marginBottom: 14 }}>
                {v.title}
              </h2>
              <p style={{ color: "#666", lineHeight: 1.8, fontSize: 14 }}>
                {v.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 100px", textAlign: "center" }}>
        <button
          onClick={() => onNavigate("catalogue")}
          style={{
            background: "#2C2C2C", border: "none", color: "#F7F5F0",
            fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase",
            padding: "16px 40px", cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
            transition: "background 0.18s",
          }}
          onMouseEnter={e => e.currentTarget.style.background = "#8C7355"}
          onMouseLeave={e => e.currentTarget.style.background = "#2C2C2C"}
        >
          Browse the catalogue
        </button>
      </div>

      <footer className="sh-footer" style={{
        borderTop: "1px solid #E8E2D9", padding: "28px 48px",
        display: "flex", justifyContent: "space-between",
        color: "#B8AFA2", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        <span>© 2026 Sahem Hromos — Gostivar</span>
        <span>Made slowly. Made to last.</span>
      </footer>
    </div>
  );
}

function ContactUs({ onNavigate }) {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const inputStyle = {
    width: "100%", boxSizing: "border-box",
    background: "#fff", border: "1px solid #E8E2D9",
    fontSize: 14, padding: "12px 14px", outline: "none",
    fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C",
    marginBottom: 20,
  };

  const label = {
    fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase",
    color: "#B8AFA2", marginBottom: 8, display: "block",
  };

  const handleSubmit = () => {
    if (!form.name || !form.email || !form.message) return;
    setSent(true);
  };

  return (
    <div style={{ minHeight: "100vh", background: "#F7F5F0", fontFamily: "'DM Sans', sans-serif", color: "#2C2C2C" }}>
      <link href="https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap" rel="stylesheet" />
      <GlobalStyles />

      {/* Navbar */}
      <nav className="sh-nav-cat" style={{
        display: "flex", alignItems: "center", justifyContent: "flex-start",
        padding: "0 48px", height: 90, borderBottom: "1px solid #E8E2D9",
        position: "sticky", top: 0,
        background: "rgba(247,245,240,0.96)", backdropFilter: "blur(8px)", zIndex: 100,
      }}>
        <img src={logo} alt="Sahem" style={{ height: 70, width: "auto", display: "block" }} />
        <div className="sh-nav-links" style={{ display: "flex", gap: 36, paddingLeft: 50, fontSize: 12, letterSpacing: "0.1em", textTransform: "uppercase" }}>
          <span onClick={() => onNavigate("catalogue")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Catalogue</span>
          <span onClick={() => onNavigate("materials")} style={{ cursor: "pointer", color: "#B8AFA2" }}>Materials</span>
          <span onClick={() => onNavigate("about")} style={{ cursor: "pointer", color: "#B8AFA2" }}>About</span>
          <span style={{ color: "#8C7355", borderBottom: "1px solid #8C7355", paddingBottom: 2 }}>Contact</span>
        </div>
      </nav>

      {/* Hero */}
      <div style={{ maxWidth: 1200, margin: "0 auto", padding: "90px 48px 0" }}>
        <div style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "#8C7355", marginBottom: 18 }}>
          Get In Touch
        </div>
        <h1 style={{ fontFamily: "'Playfair Display', serif", fontWeight: 400, fontSize: "clamp(42px,7vw,72px)", marginBottom: 28, maxWidth: 700, lineHeight: 1.1 }}>
          Let's talk furniture
        </h1>
        <p style={{ fontSize: 15, color: "#666", lineHeight: 1.9, maxWidth: 560, marginBottom: 70 }}>
          Questions about a piece, custom sizing, materials, or an order — send us a note and
          we'll get back to you within a couple of days.
        </p>
      </div>

      {/* Content: form + details */}
      <div
        className="sh-detail-grid"
        style={{ maxWidth: 1200, margin: "0 auto", padding: "0 48px 100px", display: "grid", gridTemplateColumns: "1.3fr 1fr", gap: 64 }}
      >
        {/* Form */}
        <div style={{ background: "#fff", border: "1px solid #E8E2D9", padding: 40 }}>
          {sent ? (
            <div style={{ padding: "40px 0", textAlign: "center" }}>
              <div style={{ fontFamily: "'DM Serif Display', serif", fontSize: 24, marginBottom: 12 }}>
                Thank you.
              </div>
              <p style={{ color: "#666", fontSize: 14, lineHeight: 1.8 }}>
                Your message has been received. We'll be in touch soon.
              </p>
            </div>
          ) : (
            <div>
              <div>
                <label style={label}>Name</label>
                <input
                  style={inputStyle}
                  value={form.name}
                  onChange={update("name")}
                  placeholder="Your full name"
                />
              </div>
              <div>
                <label style={label}>Email</label>
                <input
                  style={inputStyle}
                  type="email"
                  value={form.email}
                  onChange={update("email")}
                  placeholder="you@example.com"
                />
              </div>
              <div>
                <label style={label}>Message</label>
                <textarea
                  style={{ ...inputStyle, minHeight: 140, resize: "vertical", fontFamily: "'DM Sans', sans-serif" }}
                  value={form.message}
                  onChange={update("message")}
                  placeholder="Tell us what you're looking for…"
                />
              </div>
              <button
                onClick={handleSubmit}
                style={{
                  width: "100%", background: "#2C2C2C", border: "none",
                  color: "#F7F5F0", fontSize: 11, letterSpacing: "0.16em",
                  textTransform: "uppercase", padding: "15px 0",
                  cursor: "pointer", fontFamily: "'DM Sans', sans-serif",
                  transition: "background 0.18s",
                }}
                onMouseEnter={e => e.currentTarget.style.background = "#8C7355"}
                onMouseLeave={e => e.currentTarget.style.background = "#2C2C2C"}
              >
                Send message
              </button>
            </div>
          )}
        </div>

        {/* Contact details */}
        <div>
          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10 }}>
              Workshop
            </div>
            <div style={{ fontSize: 14, color: "#2C2C2C", lineHeight: 1.8 }}>Gostivar, North Macedonia</div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10 }}>
              Studio
            </div>
            <div style={{ fontSize: 14, color: "#2C2C2C", lineHeight: 1.8 }}>Skopje, North Macedonia</div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10 }}>
              Email
            </div>
            <div style={{ fontSize: 14, color: "#2C2C2C", lineHeight: 1.8 }}>hello@sahemhromos.com</div>
          </div>

          <div style={{ marginBottom: 36 }}>
            <div style={{ fontSize: 9, letterSpacing: "0.18em", textTransform: "uppercase", color: "#B8AFA2", marginBottom: 10 }}>
              Response time
            </div>
            <div style={{ fontSize: 14, color: "#2C2C2C", lineHeight: 1.8 }}>Usually within 2 business days</div>
          </div>
        </div>
      </div>

      <footer className="sh-footer" style={{
        borderTop: "1px solid #E8E2D9", padding: "28px 48px",
        display: "flex", justifyContent: "space-between",
        color: "#B8AFA2", fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase",
      }}>
        <span>© 2026 Sahem Hromos — Gostivar</span>
        <span>Made slowly. Made to last.</span>
      </footer>
    </div>
  );
}
/* ── Root: page router ── */
export default function App() {
  const [page, setPage] = useState("catalogue");
  const [selectedProduct, setSelectedProduct] = useState(null);

  if (selectedProduct) {
    return (
      <DetailPage
        product={selectedProduct}
        onBack={() => setSelectedProduct(null)}
      />
    );
  }

  if (page === "gallery") {
    return <GalleryPage onNavigate={setPage} onOpen={setSelectedProduct} />;
  }

  if (page === "about") {
    return <AboutUs onNavigate={setPage} />;
  }

  if (page === "contact") {
    return <ContactUs onNavigate={setPage} />;
  }

  return (
    <CataloguePage
      onOpen={setSelectedProduct}
      onNavigate={setPage}
    />
  );
}
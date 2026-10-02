import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import PRODUCTS from "./products";
import logo from "./images/unnamed.png";
import naturalOak from "./images/Natural Oak.png";
import naturalBeech from "./images/Natural Beech.png";
import tobaccoOak from "./images/Tobacco Oak.png";

/* ─────────────────────────── Constants ─────────────────────────── */

const CATEGORIES = ["All", "Chairs", "Sofas", "Benches"];
const SORT_OPTIONS = ["Featured", "Name A–Z", "Category"];
const CONTACT_EMAIL = "hello@sahemhromos.com";

const NAV_ITEMS = [
  ["catalogue", "Catalogue"],
  ["materials", "Materials"],
  ["about", "About"],
  ["contact", "Contact"],
];

const MATERIALS = [
  { name: "Natural Oak", image: naturalOak, note: "Solid oak with a light, natural tone." },
  { name: "Natural Beech", image: naturalBeech, note: "Solid beech with a soft, even grain." },
  { name: "Tobacco Oak", image: tobaccoOak, note: "Solid oak in a deeper, warm brown." },
];

const WOOD_TONES = {
  Birch: "#D4C5A9", Oak: "#C4A882", Ash: "#B8A99A",
  Beech: "#C9B99A", Pine: "#C6A87A", Walnut: "#8B6347",
  Rattan: "#C8A96E", Marble: "#DDDAD4", Steel: "#9AA3A8",
};

function swatch(material = "") {
  for (const [key, value] of Object.entries(WOOD_TONES)) {
    if (material.includes(key)) return value;
  }
  return "#B8A99A";
}

/* Image fields on a product, in the order they appear in the gallery. */
const VIEW_FIELDS = [
  ["mainImage", "Main view"],
  ["frontImage", "Front view"],
  ["sideImage", "Side view"],
  ["topImage", "Back view"],
  ["fabricImage", "Fabric view"],
  ["handleImage", "Handle view"],
  ["rightFrontImage", "Right front view"],
  ["seatImage", "Seat view"],
  ["rightBackImage", "Right back view"],
];

/* Every usable image for a product, de-duplicated. Handles a string, an
   array, or a missing field for each image slot. */
function getViews(product) {
  const seen = new Set();
  const views = [];
  VIEW_FIELDS.forEach(([field, label]) => {
    const value = product.images?.[field];
    const list = (Array.isArray(value) ? value : [value]).filter(Boolean);
    list.forEach((src, i) => {
      if (seen.has(src)) return;
      seen.add(src);
      views.push({ src, label: list.length > 1 ? `${label} ${i + 1}` : label });
    });
  });
  return views;
}

const cap = (s) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : s);

function getCardImage(product) {
  const main = product.images?.mainImage;
  return (Array.isArray(main) ? main[0] : main) || getViews(product)[0]?.src || null;
}

/* ─────────────────────────── Styles ─────────────────────────── */

const STYLES = `
:root {
  --bg: #F7F5F0;
  --bg-soft: #EFEBE3;
  --line: #E8E2D9;
  --ink: #2C2C2C;
  --muted: #6F675C;
  --faint: #B8AFA2;
  --accent: #8C7355;
  --accent-text: #75603F;
  --nav-h: 80px;
  --page-x: 48px;
  --content-max: 1200px;
  --gutter: max(var(--page-x), calc((100vw - var(--content-max)) / 2 + var(--page-x)));
  --serif: 'DM Serif Display', Georgia, serif;
  --sans: 'DM Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
}
*, *::before, *::after { box-sizing: border-box; }
html { scroll-behavior: smooth; }
body { margin: 0; background: var(--bg); }
img { max-width: 100%; }
button { font-family: inherit; }
.sh-app { min-height: 100vh; display: flex; flex-direction: column; background: var(--bg); color: var(--ink); font-family: var(--sans); -webkit-font-smoothing: antialiased; }
.sh-main { flex: 1; }

:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px; }
.sh-skip { position: absolute; left: 16px; top: -60px; z-index: 300; background: var(--ink); color: var(--bg); padding: 10px 16px; font-size: 13px; text-decoration: none; }
.sh-skip:focus { top: 12px; }

/* Nav */
.sh-nav { position: sticky; top: 0; z-index: 100; background: var(--bg); border-bottom: 1px solid var(--line); }
.sh-nav-inner { display: flex; align-items: center; justify-content: space-between; height: var(--nav-h); padding: 0 var(--gutter); }
.sh-logo { background: none; border: 0; padding: 0; cursor: pointer; display: block; line-height: 0; transition: opacity 0.3s ease; }
.sh-logo:hover { opacity: 0.8; }
.sh-logo img { height: 54px; width: auto; max-width: 50vw; display: block; }
.sh-links { display: flex; gap: 44px; }
.sh-link { position: relative; background: none; border: 0; padding: 8px 0; cursor: pointer; font-family: var(--sans); font-size: 11.5px; font-weight: 400; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); transition: color 0.25s ease; }
.sh-link::after { content: ""; position: absolute; left: 0; right: 0.16em; bottom: 1px; height: 1px; background: var(--accent); transform: scaleX(0); transform-origin: left; transition: transform 0.35s cubic-bezier(0.22, 0.61, 0.36, 1); }
.sh-link:hover { color: var(--ink); }
.sh-link:hover::after, .sh-link[aria-current="page"]::after { transform: scaleX(1); }
.sh-link[aria-current="page"] { color: var(--accent-text); }
.sh-burger { display: none; position: relative; width: 44px; height: 44px; margin-right: -12px; background: none; border: 0; cursor: pointer; }
.sh-burger span { position: absolute; left: 12px; right: 12px; height: 1px; background: var(--ink); transition: top 0.3s ease, transform 0.3s ease; }
.sh-burger span:nth-child(1) { top: 18px; }
.sh-burger span:nth-child(2) { top: 25px; }
.sh-burger[aria-expanded="true"] span:nth-child(1) { top: 21px; transform: rotate(45deg); }
.sh-burger[aria-expanded="true"] span:nth-child(2) { top: 21px; transform: rotate(-45deg); }
.sh-scrim { position: fixed; inset: var(--nav-h) 0 0 0; background: rgba(44, 44, 44, 0.2); animation: sh-fade 0.3s ease both; }

/* Footer */
.sh-footer { border-top: 1px solid var(--line); padding: 28px var(--gutter); display: flex; justify-content: space-between; gap: 8px; flex-wrap: wrap; font-size: 11px; letter-spacing: 0.08em; text-transform: uppercase; color: var(--muted); }

/* Shared type */
.sh-eyebrow { font-size: 10px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--accent-text); margin: 0 0 18px; }
.sh-label { font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin: 0 0 10px; font-weight: 500; }
.sh-h1 { font-family: var(--serif); font-weight: 400; font-size: clamp(38px, 6.5vw, 72px); line-height: 1.1; letter-spacing: -0.01em; margin: 0 0 24px; }
.sh-lead { font-size: 15px; line-height: 1.85; color: var(--muted); max-width: 560px; margin: 0; }
.sh-wrap { max-width: 1200px; margin: 0 auto; padding: 0 var(--page-x); }
.sh-page-head { padding-top: 88px; padding-bottom: 64px; }
.sh-btn { display: inline-block; background: var(--ink); color: var(--bg); border: 1px solid var(--ink); font-size: 11px; letter-spacing: 0.16em; text-transform: uppercase; padding: 16px 40px; cursor: pointer; text-decoration: none; text-align: center; transition: background 0.18s, border-color 0.18s; }
.sh-btn:hover { background: var(--accent); border-color: var(--accent); }
.sh-btn-block { display: block; width: 100%; }
.sh-btn-ghost { background: transparent; color: var(--ink); padding: 10px 0; width: 100%; font-size: 10px; letter-spacing: 0.14em; }
.sh-btn-ghost:hover { background: var(--ink); border-color: var(--ink); color: var(--bg); }

/* Tag */
.sh-tag { display: inline-block; border: 1px solid var(--ink); color: var(--ink); font-size: 9px; font-weight: 600; letter-spacing: 0.14em; padding: 2px 7px; text-transform: uppercase; white-space: nowrap; }
.sh-tag-new { border-color: var(--accent); color: var(--accent-text); }

/* Images */
.sh-img-fallback { width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; background: var(--bg-soft); color: var(--faint); font-size: 11px; letter-spacing: 0.12em; text-transform: uppercase; }

/* Hero: split layout, copy left, photograph right */
.sh-hero { display: grid; grid-template-columns: 1fr 1fr; min-height: min(calc(100vh - var(--nav-h)), 720px); border-bottom: 1px solid var(--line); }
.sh-hero-copy { display: flex; flex-direction: column; justify-content: center; align-items: flex-start; padding: 72px 56px 72px var(--gutter); }
.sh-hero-copy .sh-h1 { font-size: clamp(40px, 5.5vw, 72px); margin-bottom: 20px; }
.sh-hero-copy .sh-lead { max-width: 400px; margin-bottom: 40px; }
.sh-hero-media { position: relative; margin: 24px 0; background: var(--bg-soft); border-radius: 16px 0 0 16px; overflow: hidden; }
.sh-hero-media img { position: absolute; inset: 7%; width: 86%; height: 86%; object-fit: contain; mix-blend-mode: multiply; }
.sh-hero-media .sh-img-fallback { position: absolute; inset: 0; }
.sh-btn-arrow span { display: inline-block; margin-left: 12px; transition: transform 0.25s ease; }
.sh-btn-arrow:hover span { transform: translateX(4px); }

/* Catalogue layout */
.sh-cat { display: flex; align-items: flex-start; scroll-margin-top: var(--nav-h); }
.sh-sidebar { width: 220px; flex-shrink: 0; padding: 32px 28px; border-right: 1px solid var(--line); position: sticky; top: var(--nav-h); }
.sh-search { width: 100%; background: #fff; border: 1px solid var(--line); font-size: 13px; padding: 10px 12px; font-family: var(--sans); color: var(--ink); border-radius: 0; }
.sh-search::placeholder { color: var(--faint); }
.sh-cats { display: flex; flex-direction: column; }
.sh-cat-btn { background: none; border: 0; text-align: left; padding: 7px 0; font-size: 13px; cursor: pointer; color: var(--muted); transition: color 0.15s; }
.sh-cat-btn:hover { color: var(--ink); }
.sh-cat-btn[aria-pressed="true"] { color: var(--ink); font-weight: 500; }
.sh-results { flex: 1; min-width: 0; padding: 28px 36px 60px; }
.sh-toolbar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; margin-bottom: 24px; }
.sh-count { font-size: 12px; color: var(--muted); }
.sh-count b { color: var(--ink); font-weight: 500; }
.sh-pills { display: flex; gap: 6px; flex-wrap: wrap; }
.sh-pill { padding: 6px 14px; font-size: 11px; cursor: pointer; border: 1px solid var(--line); background: transparent; color: var(--muted); letter-spacing: 0.04em; white-space: nowrap; transition: all 0.18s; }
.sh-pill:hover { border-color: var(--ink); color: var(--ink); }
.sh-pill[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--bg); }
.sh-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(240px, 1fr)); gap: 16px; }
.sh-empty { padding: 80px 0; text-align: center; color: var(--muted); font-size: 14px; }
.sh-empty p { margin: 0 0 20px; font-style: italic; }

/* Product card */
.sh-card { background: #fff; border: 1px solid var(--line); display: flex; flex-direction: column; transition: box-shadow 0.25s ease; animation: sh-fade 0.4s ease both; }
.sh-card:hover, .sh-card:focus-within { box-shadow: 0 8px 28px rgba(44,44,44,0.08); }
.sh-card-media { position: relative; aspect-ratio: 1 / 1; background: #fff; overflow: hidden; cursor: pointer; }
.sh-card-media > img { position: absolute; inset: 10%; width: 80%; height: 80%; object-fit: contain; }
.sh-card-media .sh-img-fallback { position: absolute; inset: 0; }
.sh-card-hover { position: absolute; inset: 0; background: rgba(247,245,240,0.96); display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 24px; gap: 14px; opacity: 0; transition: opacity 0.22s ease; pointer-events: none; }
.sh-card:hover .sh-card-hover, .sh-card:focus-within .sh-card-hover { opacity: 1; }
.sh-card-hover p { margin: 0; font-size: 12px; line-height: 1.7; text-align: center; font-style: italic; }
.sh-dims { display: flex; gap: 18px; }
.sh-dim { text-align: center; }
.sh-dim b { display: block; font-size: 13px; font-weight: 500; }
.sh-dim span { font-size: 9px; color: var(--muted); letter-spacing: 0.1em; text-transform: uppercase; }
.sh-card-foot { padding: 14px 16px 16px; border-top: 1px solid var(--line); flex: 1; display: flex; flex-direction: column; justify-content: space-between; gap: 14px; }
.sh-card-top { display: flex; align-items: flex-start; justify-content: space-between; gap: 8px; }
.sh-card-name { font-family: var(--serif); font-size: 15px; line-height: 1.25; margin: 0 0 6px; font-weight: 400; }
.sh-mat { display: flex; align-items: center; gap: 6px; font-size: 11px; color: var(--muted); letter-spacing: 0.04em; }
.sh-dot { width: 8px; height: 8px; border-radius: 50%; border: 1px solid var(--line); flex-shrink: 0; }

/* Detail */
.sh-back { background: none; border: 0; padding: 0; cursor: pointer; font-size: 12px; letter-spacing: 0.1em; text-transform: uppercase; color: var(--muted); margin: 32px 0 0; }
.sh-back:hover { color: var(--ink); }
.sh-detail { display: grid; grid-template-columns: 1.1fr 1fr; gap: 64px; align-items: start; padding-top: 28px; padding-bottom: 80px; }
.sh-stage { background: var(--bg-soft); aspect-ratio: 1 / 1; max-height: 680px; width: 100%; display: flex; align-items: center; justify-content: center; overflow: hidden; }
.sh-stage img { width: 100%; height: 100%; object-fit: contain; display: block; animation: sh-fade 0.35s ease both; }
.sh-gallery-bar { display: flex; align-items: center; gap: 12px; margin-top: 12px; }
.sh-arrow { flex-shrink: 0; width: 40px; height: 40px; border: 1px solid #D8D0C5; background: var(--bg); color: var(--accent-text); cursor: pointer; font-size: 16px; font-family: Arial, sans-serif; transition: all 0.2s; }
.sh-arrow:hover { background: var(--ink); color: var(--bg); border-color: var(--ink); }
.sh-thumbs { display: flex; gap: 8px; overflow-x: auto; padding: 2px; flex: 1; scrollbar-width: thin; }
.sh-thumb { flex: 0 0 auto; width: 64px; height: 64px; padding: 0; background: var(--bg-soft); border: 1px solid transparent; cursor: pointer; opacity: 0.65; transition: opacity 0.2s, border-color 0.2s; }
.sh-thumb:hover { opacity: 1; }
.sh-thumb[aria-current="true"] { opacity: 1; border-color: var(--accent); }
.sh-thumb img { width: 100%; height: 100%; object-fit: contain; display: block; }
.sh-info { padding-top: 8px; }
.sh-title { font-family: var(--serif); font-weight: 400; font-size: clamp(30px, 3.6vw, 44px); line-height: 1.12; margin: 0 0 12px; }
.sh-info .sh-mat { font-size: 12px; margin-bottom: 28px; }
.sh-info .sh-mat .sh-dot { width: 10px; height: 10px; }
.sh-prose p { font-size: 15px; line-height: 1.8; color: #555; margin: 0 0 16px; max-width: 60ch; }
.sh-prose p:first-child { font-style: italic; }
.sh-specs { border-top: 1px solid var(--line); margin-top: 32px; padding-top: 28px; }
.sh-spec { margin-bottom: 24px; }
.sh-spec-text { font-size: 13px; line-height: 1.7; color: var(--muted); margin: 0; }
.sh-spec-strong { font-size: 14px; color: var(--ink); }
.sh-dims-lg { display: flex; gap: 28px; flex-wrap: wrap; }
.sh-dims-lg b { display: block; font-family: var(--serif); font-weight: 400; font-size: 22px; }
.sh-dims-lg b small { font-size: 12px; margin-left: 2px; }
.sh-dims-lg span { font-size: 10px; color: var(--muted); letter-spacing: 0.08em; text-transform: uppercase; }
.sh-chips { display: flex; gap: 8px; flex-wrap: wrap; }
.sh-chip { border: 1px solid var(--line); padding: 5px 12px; font-size: 12px; letter-spacing: 0.04em; }
.sh-related { border-top: 1px solid var(--line); padding-top: 40px; padding-bottom: 80px; }
.sh-related .sh-grid { grid-template-columns: repeat(3, 1fr); }

/* Materials */
.sh-mat-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 28px; padding-bottom: 80px; }
.sh-mat-card { margin: 0; }
.sh-mat-img { background: var(--bg-soft); aspect-ratio: 4 / 5; overflow: hidden; }
.sh-mat-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
.sh-mat-card h2 { font-family: var(--serif); font-weight: 400; font-size: 24px; margin: 18px 0 6px; }
.sh-mat-card p { margin: 0; font-size: 14px; line-height: 1.7; color: var(--muted); }
.sh-mat-card .sh-count { display: block; margin-top: 10px; }
.sh-cta { text-align: center; padding-bottom: 100px; }

/* About */
.sh-story { display: grid; grid-template-columns: 1fr 1fr; gap: 64px; padding-bottom: 80px; }
.sh-story p, .sh-values p { font-size: 15px; color: #555; line-height: 1.85; margin: 0 0 20px; max-width: 60ch; }
.sh-values { border-top: 1px solid var(--line); padding-top: 48px; padding-bottom: 80px; }
.sh-values-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 28px; margin-top: 32px; }
.sh-value { background: #fff; border: 1px solid var(--line); padding: 30px; }
.sh-value h3 { font-family: var(--serif); font-weight: 400; font-size: 21px; margin: 0 0 14px; }
.sh-value p { margin: 0; color: var(--muted); font-size: 14px; }

/* Contact */
.sh-contact { display: grid; grid-template-columns: 1.3fr 1fr; gap: 64px; padding-bottom: 100px; }
.sh-form { background: #fff; border: 1px solid var(--line); padding: 40px; }
.sh-field { margin-bottom: 20px; }
.sh-field label { display: block; font-size: 10px; letter-spacing: 0.16em; text-transform: uppercase; color: var(--muted); margin-bottom: 8px; }
.sh-input { width: 100%; background: #fff; border: 1px solid var(--line); font-size: 14px; padding: 12px 14px; font-family: var(--sans); color: var(--ink); border-radius: 0; }
.sh-input:focus-visible { outline-offset: 0; border-color: var(--accent); }
textarea.sh-input { min-height: 140px; resize: vertical; }
.sh-error { color: #9B2C2C; font-size: 13px; margin: 0 0 16px; }
.sh-sent { padding: 32px 0; text-align: center; }
.sh-sent h2 { font-family: var(--serif); font-weight: 400; font-size: 26px; margin: 0 0 12px; }
.sh-sent p { color: var(--muted); font-size: 14px; line-height: 1.8; margin: 0; }
.sh-detail-item { margin-bottom: 32px; }
.sh-detail-item p { margin: 0; font-size: 14px; line-height: 1.8; }
.sh-detail-item a { color: var(--ink); }

@keyframes sh-fade { from { opacity: 0; } to { opacity: 1; } }

@media (max-width: 900px) {
  :root { --page-x: 28px; }
  .sh-links { gap: 32px; }
  .sh-detail, .sh-story, .sh-contact { grid-template-columns: 1fr; gap: 40px; }
  .sh-hero { grid-template-columns: 1fr; min-height: 0; }
  .sh-hero-copy { padding: 56px var(--page-x) 40px; }
  .sh-hero-media { margin: 0; border-radius: 0; aspect-ratio: 4 / 3; }
  .sh-cat { flex-direction: column; align-items: stretch; }
  .sh-sidebar { width: 100%; position: static; border-right: 0; border-bottom: 1px solid var(--line); padding: 20px var(--page-x); }
  .sh-search { max-width: 420px; }
  .sh-cats { flex-direction: row; flex-wrap: wrap; gap: 6px; margin-top: 14px; }
  .sh-cat-btn { padding: 6px 14px; border: 1px solid var(--line); font-size: 12px; }
  .sh-cat-btn[aria-pressed="true"] { background: var(--ink); border-color: var(--ink); color: var(--bg); }
  .sh-sidebar .sh-label { display: none; }
  .sh-results { padding: 24px var(--page-x) 48px; }
  .sh-related .sh-grid { grid-template-columns: repeat(2, 1fr); }
  .sh-mat-grid { grid-template-columns: repeat(2, 1fr); }
  .sh-page-head { padding-top: 56px; padding-bottom: 40px; }
}

@media (max-width: 760px) {
  :root { --nav-h: 64px; }
  .sh-logo img { height: 42px; }
  .sh-burger { display: block; }
  .sh-links { position: absolute; top: 100%; left: 0; right: 0; flex-direction: column; gap: 0; background: var(--bg); border-bottom: 1px solid var(--line); padding: 4px var(--page-x) 20px; opacity: 0; visibility: hidden; transform: translateY(-8px); transition: opacity 0.28s ease, transform 0.28s ease, visibility 0s linear 0.28s; }
  .sh-links.is-open { opacity: 1; visibility: visible; transform: none; transition: opacity 0.28s ease, transform 0.28s ease, visibility 0s; }
  .sh-link { text-align: left; padding: 16px 0; font-family: var(--serif); font-size: 26px; letter-spacing: 0; text-transform: none; color: var(--ink); border-bottom: 1px solid var(--line); }
  .sh-link:last-child { border-bottom: 0; }
  .sh-link::after { display: none; }
  .sh-link[aria-current="page"] { color: var(--accent-text); }
}

@media (max-width: 640px) {
  :root { --page-x: 20px; }
  .sh-grid { grid-template-columns: repeat(2, 1fr); gap: 12px; }
  .sh-related .sh-grid, .sh-mat-grid { grid-template-columns: 1fr; }
  .sh-card-foot { padding: 12px; }
  .sh-card-top { flex-direction: column; gap: 8px; }
  .sh-card-hover { display: none; }
  .sh-form { padding: 24px 20px; }
  .sh-btn { padding: 15px 28px; }
  .sh-footer { flex-direction: column; padding: 20px var(--page-x); }
  .sh-thumb { width: 56px; height: 56px; }
}

@media (prefers-reduced-motion: reduce) {
  html { scroll-behavior: auto; }
  *, *::before, *::after { animation: none !important; transition: none !important; }
}
`;

/* ─────────────────────────── Small components ─────────────────────────── */

function Tag({ label }) {
  return <span className={`sh-tag${label === "New" ? " sh-tag-new" : ""}`}>{label}</span>;
}

/* Image that never leaves an ugly hole: reports failures to the parent
   (so it can drop the slot) or shows a quiet placeholder. */
function SmartImage({ src, alt, onError, ...rest }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <div className="sh-img-fallback" role="img" aria-label={alt}>Image coming soon</div>;
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => { setFailed(true); onError?.(src); }}
      {...rest}
    />
  );
}

function Spec({ label, children }) {
  return (
    <div className="sh-spec">
      <div className="sh-label">{label}</div>
      {children}
    </div>
  );
}

function SiteNav({ page, onNavigate }) {
  const [open, setOpen] = useState(false);
  const burgerRef = useRef(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") { setOpen(false); burgerRef.current?.focus(); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const go = (id) => { setOpen(false); onNavigate(id); };

  return (
    <header className="sh-nav">
      {open && <div className="sh-scrim" onClick={() => setOpen(false)} aria-hidden="true" />}
      <nav className="sh-nav-inner" aria-label="Main">
        <button className="sh-logo" onClick={() => go("catalogue")} aria-label="Sahem Hromos — home">
          <img src={logo} alt="Sahem Hromos" />
        </button>
        <button
          ref={burgerRef}
          className="sh-burger"
          aria-expanded={open}
          aria-controls="sh-links"
          aria-label={open ? "Close menu" : "Open menu"}
          onClick={() => setOpen(o => !o)}
        >
          <span /><span />
        </button>
        <div id="sh-links" className={`sh-links${open ? " is-open" : ""}`}>
          {NAV_ITEMS.map(([id, label]) => (
            <button
              key={id}
              className="sh-link"
              aria-current={page === id ? "page" : undefined}
              onClick={() => go(id)}
            >
              {label}
            </button>
          ))}
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="sh-footer">
      <span>© 2026 Sahem Hromos — Skopje</span>
      <span>Made slowly. Made to last.</span>
    </footer>
  );
}

function Layout({ page, onNavigate, children }) {
  return (
    <div className="sh-app">
      <a className="sh-skip" href="#main">Skip to content</a>
      <SiteNav page={page} onNavigate={onNavigate} />
      <main id="main" className="sh-main">{children}</main>
      <SiteFooter />
    </div>
  );
}

/* ─────────────────────────── Product card ─────────────────────────── */

function ProductCard({ product, onOpen }) {
  const dims = [["W", product.w], ["H", product.h], ["D", product.d]].filter(([, v]) => v != null && v !== "");
  return (
    <article className="sh-card">
      <div className="sh-card-media" onClick={() => onOpen(product)}>
        <SmartImage src={getCardImage(product)} alt={product.name} />
        {(product.description || dims.length > 0) && (
          <div className="sh-card-hover" aria-hidden="true">
            {product.description && <p>{product.description}</p>}
            {dims.length > 0 && (
              <div className="sh-dims">
                {dims.map(([l, v]) => (
                  <div className="sh-dim" key={l}><b>{v}</b><span>{l} cm</span></div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
      <div className="sh-card-foot">
        <div className="sh-card-top">
          <div>
            <h3 className="sh-card-name">{product.name}</h3>
            {product.material && (
              <div className="sh-mat">
                <span className="sh-dot" style={{ background: swatch(product.material) }} />
                <span>{product.material}</span>
              </div>
            )}
          </div>
          {product.tag && <Tag label={product.tag} />}
        </div>
        <button
          className="sh-btn sh-btn-ghost"
          onClick={() => onOpen(product)}
          aria-label={`See more: ${product.name}`}
        >
          See more
        </button>
      </div>
    </article>
  );
}

/* ─────────────────────────── Product gallery ─────────────────────────── */

function Gallery({ product }) {
  const allViews = useMemo(() => getViews(product), [product]);
  const [failed, setFailed] = useState([]);
  const [active, setActive] = useState(0);

  const views = useMemo(() => allViews.filter(v => !failed.includes(v.src)), [allViews, failed]);
  const index = Math.min(active, Math.max(views.length - 1, 0));
  const current = views[index];

  const step = (dir) => setActive((index + dir + views.length) % views.length);
  const onKeyDown = (e) => {
    if (views.length < 2) return;
    if (e.key === "ArrowLeft") { e.preventDefault(); step(-1); }
    if (e.key === "ArrowRight") { e.preventDefault(); step(1); }
  };
  const markFailed = useCallback((src) => setFailed(f => (f.includes(src) ? f : [...f, src])), []);

  return (
    <div onKeyDown={onKeyDown}>
      <div className="sh-stage" aria-live="polite">
        {current ? (
          <img
            key={current.src}
            src={current.src}
            alt={`${product.name} — ${current.label}`}
            onError={() => markFailed(current.src)}
          />
        ) : (
          <div className="sh-img-fallback">Photography coming soon</div>
        )}
      </div>

      {views.length > 1 && (
        <div className="sh-gallery-bar">
          <button className="sh-arrow" onClick={() => step(-1)} aria-label="Previous image">←</button>
          <div className="sh-thumbs">
            {views.map((v, i) => (
              <button
                key={v.src}
                className="sh-thumb"
                aria-current={i === index}
                aria-label={`Show ${v.label} (${i + 1} of ${views.length})`}
                onClick={() => setActive(i)}
              >
                <img src={v.src} alt="" loading="lazy" onError={() => markFailed(v.src)} />
              </button>
            ))}
          </div>
          <button className="sh-arrow" onClick={() => step(1)} aria-label="Next image">→</button>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────── Detail page ─────────────────────────── */

function DetailPage({ product, onBack, onOpen }) {
  const paragraphs = (product.longDescription || product.description || "").split("\n\n").filter(Boolean);
  const dims = [["Width", product.w], ["Height", product.h], ["Depth", product.d]].filter(([, v]) => v != null && v !== "");
  const finishes = Array.isArray(product.finishes) ? product.finishes : [];
  const related = useMemo(
    () => PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3),
    [product]
  );
  const enquiry = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(`Enquiry: ${product.name}`)}`;

  return (
    <>
      <div className="sh-wrap">
        <button className="sh-back" onClick={onBack}>← Catalogue</button>
      </div>

      <div className="sh-wrap sh-detail">
        <Gallery key={product.id} product={product} />

        <div className="sh-info">
          {product.category && <p className="sh-eyebrow" style={{ marginBottom: 14 }}>{product.category}</p>}
          <h1 className="sh-title">{product.name}</h1>
          <div className="sh-mat">
            {product.material && (
              <>
                <span className="sh-dot" style={{ background: swatch(product.material) }} />
                <span>{product.material}</span>
              </>
            )}
            {product.tag && <span style={{ marginLeft: 6 }}><Tag label={product.tag} /></span>}
          </div>

          <div className="sh-prose">
            {paragraphs.map((para, i) => <p key={i}>{para}</p>)}
          </div>

          <div className="sh-specs">
            {dims.length > 0 && (
              <Spec label="Dimensions">
                <div className="sh-dims-lg">
                  {dims.map(([l, v]) => (
                    <div key={l}><b>{v}<small>cm</small></b><span>{l}</span></div>
                  ))}
                </div>
              </Spec>
            )}
            {finishes.length > 0 && (
              <Spec label="Available finishes">
                <div className="sh-chips">
                  {finishes.map(f => <span className="sh-chip" key={f}>{f}</span>)}
                </div>
              </Spec>
            )}
            {product.lead && (
              <Spec label="Lead time"><p className="sh-spec-text sh-spec-strong">{product.lead}</p></Spec>
            )}
            {(product.material || product.frame) && (
              <Spec label="Material">
                {product.material && <p className="sh-spec-text">{product.material}</p>}
                {product.frame && <p className="sh-spec-text">{cap(product.frame)} frame</p>}
              </Spec>
            )}
            {product.fabric && (
              <Spec label="Fabric"><p className="sh-spec-text">{cap(product.fabric)}</p></Spec>
            )}
            {product.care && (
              <Spec label="Care"><p className="sh-spec-text">{product.care}</p></Spec>
            )}
            <a className="sh-btn sh-btn-block" href={enquiry}>Enquire about this piece</a>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section className="sh-wrap sh-related" aria-labelledby="related-title">
          <h2 id="related-title" className="sh-label" style={{ marginBottom: 28 }}>Also in {product.category}</h2>
          <div className="sh-grid">
            {related.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
          </div>
        </section>
      )}
    </>
  );
}

/* ─────────────────────────── Catalogue ─────────────────────────── */

function CataloguePage({ onOpen }) {
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Featured");
  const [search, setSearch] = useState("");

  const featured = useMemo(() => PRODUCTS.find(p => getCardImage(p)), []);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    let list = PRODUCTS.filter(p =>
      (category === "All" || p.category === category) &&
      (!q || p.name.toLowerCase().includes(q))
    );
    if (sortBy === "Name A–Z") list = [...list].sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === "Category") list = [...list].sort((a, b) => a.category.localeCompare(b.category));
    return list;
  }, [category, sortBy, search]);

  const reset = () => { setCategory("All"); setSearch(""); setSortBy("Featured"); };

  return (
    <>
      <section className="sh-hero">
        <div className="sh-hero-copy">
          <p className="sh-eyebrow">Spring — Summer 2026</p>
          <h1 className="sh-h1">Sahem Hromos</h1>
          <p className="sh-lead">
            Solid woods, natural textiles, honest construction. Each piece designed for daily use and a lifetime of ownership.
          </p>
          <a className="sh-btn sh-btn-arrow" href="#collection">View the catalogue<span aria-hidden="true">→</span></a>
        </div>
        {featured && (
          <div className="sh-hero-media">
            <SmartImage src={getCardImage(featured)} alt={featured.name} loading="eager" />
          </div>
        )}
      </section>

      <div className="sh-cat" id="collection">
        <aside className="sh-sidebar" aria-label="Filters">
          <label className="sh-label" htmlFor="search" style={{ display: "block" }}>Search</label>
          <input
            id="search"
            className="sh-search"
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name"
          />
          <div className="sh-label" style={{ marginTop: 28 }}>Category</div>
          <div className="sh-cats">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className="sh-cat-btn"
                aria-pressed={category === cat}
                onClick={() => setCategory(cat)}
              >
                {cat}
              </button>
            ))}
          </div>
        </aside>

        <section className="sh-results" aria-label="Products">
          <div className="sh-toolbar">
            <span className="sh-count" role="status">
              <b>{filtered.length}</b> {filtered.length === 1 ? "piece" : "pieces"}
            </span>
            <div className="sh-pills" role="group" aria-label="Sort by">
              {SORT_OPTIONS.map(opt => (
                <button key={opt} className="sh-pill" aria-pressed={sortBy === opt} onClick={() => setSortBy(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="sh-empty">
              <p>No pieces match your search.</p>
              <button className="sh-btn" onClick={reset}>Clear filters</button>
            </div>
          ) : (
            <div className="sh-grid">
              {filtered.map(p => <ProductCard key={p.id} product={p} onOpen={onOpen} />)}
            </div>
          )}
        </section>
      </div>
    </>
  );
}

/* ─────────────────────────── Materials ─────────────────────────── */

function MaterialsPage({ onNavigate }) {
  const counts = useMemo(() => {
    const result = {};
    MATERIALS.forEach(m => {
      result[m.name] = PRODUCTS.filter(p =>
        Array.isArray(p.finishes) && p.finishes.some(f => String(f).toLowerCase() === m.name.toLowerCase())
      ).length;
    });
    return result;
  }, []);

  return (
    <>
      <div className="sh-wrap sh-page-head">
        <p className="sh-eyebrow">Materials</p>
        <h1 className="sh-h1" style={{ maxWidth: 700 }}>Honest materials, finished by hand</h1>
        <p className="sh-lead">Our frames are made from solid regional hardwood. These are the finishes you can choose from.</p>
      </div>

      <div className="sh-wrap sh-mat-grid">
        {MATERIALS.map(m => (
          <figure className="sh-mat-card" key={m.name}>
            <div className="sh-mat-img"><SmartImage src={m.image} alt={`${m.name} finish sample`} /></div>
            <figcaption>
              <h2>{m.name}</h2>
              <p>{m.note}</p>
              {counts[m.name] > 0 && (
                <span className="sh-count">Available on {counts[m.name]} {counts[m.name] === 1 ? "piece" : "pieces"}</span>
              )}
            </figcaption>
          </figure>
        ))}
      </div>

      <div className="sh-wrap sh-cta">
        <button className="sh-btn" onClick={() => onNavigate("catalogue")}>Browse the catalogue</button>
      </div>
    </>
  );
}

/* ─────────────────────────── About ─────────────────────────── */

const VALUES = [
  { title: "Solid Wood, Always", text: "No veneers, no particleboard shortcuts. Every frame is cut from solid oak, beech, walnut, or ash." },
  { title: "Made By Hand", text: "Our joinery is done in small batches by craftsmen who've worked the same workshop floor for decades." },
  { title: "Built To Outlive Trends", text: "We design for the next twenty years, not the next season. Quiet forms, honest materials." },
];

function AboutPage({ onNavigate }) {
  return (
    <>
      <div className="sh-wrap sh-page-head">
        <p className="sh-eyebrow">About us</p>
        <h1 className="sh-h1" style={{ maxWidth: 700 }}>Furniture made the slow way</h1>
        <p className="sh-lead" style={{ maxWidth: 620 }}>
          Sahem Hromos began as a small joinery workshop between Skopje and Gostivar, built on one idea: furniture should be made from real materials, by real hands, to be used for a lifetime — not replaced every few years. That idea hasn't changed since.
        </p>
      </div>

      <div className="sh-wrap sh-story">
        <div>
          <h2 className="sh-label">Our story</h2>
          <p>What started as a two-person workshop has grown into a small team of joiners, upholsterers, and finishers — but the process hasn't changed. Every chair, sofa, and bench still passes through the same hands from rough timber to finished piece.</p>
          <p>We work almost entirely with solid regional hardwoods — oak, beech, ash, walnut — and natural upholstery textiles like bouclé and chenille, chosen for how they age, not just how they photograph.</p>
        </div>
        <div>
          <h2 className="sh-label">Where we work</h2>
          <p>Our workshop sits in Gostivar, where frames are cut, joined, and sanded by hand. Final assembly and finishing happen at our Skopje studio, where every piece is checked before it ships.</p>
          <p>Because we make in small batches, lead times are longer than mass-produced furniture — usually a few weeks. We think that's a fair trade for something built to last decades.</p>
        </div>
      </div>

      <section className="sh-wrap sh-values" aria-labelledby="values-title">
        <h2 id="values-title" className="sh-label">What we believe</h2>
        <div className="sh-values-grid">
          {VALUES.map(v => (
            <div className="sh-value" key={v.title}>
              <h3>{v.title}</h3>
              <p>{v.text}</p>
            </div>
          ))}
        </div>
      </section>

      <div className="sh-wrap sh-cta">
        <button className="sh-btn" onClick={() => onNavigate("catalogue")}>Browse the catalogue</button>
      </div>
    </>
  );
}

/* ─────────────────────────── Contact ─────────────────────────── */

function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  /* There is no server endpoint, so the form hands the message to the
     visitor's email app instead of pretending it was delivered. */
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in your name, email and message.");
      return;
    }
    setError("");
    const subject = encodeURIComponent(`Message from ${form.name.trim()}`);
    const body = encodeURIComponent(`${form.message.trim()}\n\n— ${form.name.trim()} (${form.email.trim()})`);
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`;
    setSent(true);
  };

  return (
    <>
      <div className="sh-wrap sh-page-head">
        <p className="sh-eyebrow">Get in touch</p>
        <h1 className="sh-h1" style={{ maxWidth: 700 }}>Let's talk furniture</h1>
        <p className="sh-lead">Questions about a piece, custom sizing, materials, or an order — send us a note and we'll get back to you within a couple of days.</p>
      </div>

      <div className="sh-wrap sh-contact">
        <div className="sh-form">
          {sent ? (
            <div className="sh-sent" role="status">
              <h2>Your email is ready.</h2>
              <p>Your email app should have opened with your message. If it didn't, write to us at {CONTACT_EMAIL}.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate>
              <div className="sh-field">
                <label htmlFor="c-name">Name</label>
                <input id="c-name" className="sh-input" autoComplete="name" required value={form.name} onChange={update("name")} placeholder="Your full name" />
              </div>
              <div className="sh-field">
                <label htmlFor="c-email">Email</label>
                <input id="c-email" className="sh-input" type="email" autoComplete="email" required value={form.email} onChange={update("email")} placeholder="you@example.com" />
              </div>
              <div className="sh-field">
                <label htmlFor="c-message">Message</label>
                <textarea id="c-message" className="sh-input" required value={form.message} onChange={update("message")} placeholder="Tell us what you're looking for…" />
              </div>
              {error && <p className="sh-error" role="alert">{error}</p>}
              <button type="submit" className="sh-btn sh-btn-block">Send message</button>
            </form>
          )}
        </div>

        <div>
          <div className="sh-detail-item"><div className="sh-label">Workshop</div><p>Gostivar, North Macedonia</p></div>
          <div className="sh-detail-item"><div className="sh-label">Studio</div><p>Skopje, North Macedonia</p></div>
          <div className="sh-detail-item"><div className="sh-label">Email</div><p><a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a></p></div>
          <div className="sh-detail-item"><div className="sh-label">Response time</div><p>Usually within 2 business days</p></div>
        </div>
      </div>
    </>
  );
}

/* ─────────────────────────── Root / router ─────────────────────────── */

const PAGE_TITLES = {
  catalogue: "Sahem Hromos — Furniture",
  materials: "Materials — Sahem Hromos",
  about: "About — Sahem Hromos",
  contact: "Contact — Sahem Hromos",
};

const safeHistory = (method, state) => {
  try { window.history[method](state, "", window.location.href); } catch { /* history unavailable */ }
};

export default function App() {
  const [route, setRoute] = useState({ page: "catalogue", productId: null });

  // Fonts and global styles are loaded once for the whole app.
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap";
    document.head.appendChild(link);
    safeHistory("replaceState", { page: "catalogue", productId: null });
    return () => link.remove();
  }, []);

  // Browser Back / Forward.
  useEffect(() => {
    const onPop = (e) => setRoute(e.state?.page ? e.state : { page: "catalogue", productId: null });
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const product = useMemo(
    () => (route.productId != null ? PRODUCTS.find(p => p.id === route.productId) : null),
    [route.productId]
  );

  useEffect(() => {
    window.scrollTo(0, 0);
    document.title = product ? `${product.name} — Sahem Hromos` : PAGE_TITLES[route.page] || PAGE_TITLES.catalogue;
  }, [route.page, product]);

  const go = useCallback((next) => {
    setRoute(current => {
      if (current.page === next && current.productId == null) return current;
      const state = { page: next, productId: null };
      safeHistory("pushState", state);
      return state;
    });
  }, []);

  const openProduct = useCallback((p) => {
    const state = { page: "catalogue", productId: p.id };
    safeHistory("pushState", state);
    setRoute(state);
  }, []);

  const back = useCallback(() => {
    if (window.history.state?.productId != null) window.history.back();
    else setRoute({ page: "catalogue", productId: null });
  }, []);

  let content;
  if (product) content = <DetailPage product={product} onBack={back} onOpen={openProduct} />;
  else if (route.page === "materials") content = <MaterialsPage onNavigate={go} />;
  else if (route.page === "about") content = <AboutPage onNavigate={go} />;
  else if (route.page === "contact") content = <ContactPage />;
  else content = <CataloguePage onOpen={openProduct} />;

  return (
    <>
      <style>{STYLES}</style>
      <Layout page={route.page} onNavigate={go}>{content}</Layout>
    </>
  );
}

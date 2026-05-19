import React from "react";
import { Routes, Route, Link } from "react-router-dom";
import products from "./products";

import Chairs from "./chairs";
import Sofas from "./sofas";
import Benches from "./benches";

// ✅ HOME
function Home() {
  return (
    <div className="min-h-screen bg-white text-gray-900">

      {/* NAVBAR */}
      <nav className="w-full px-6 md:px-12 py-6 fixed top-0 left-0 right-0 z-50 flex justify-between items-center text-white">

        <img src="/logo.png" alt="Sahem Hromos" className="h-10 md:h-14" />

        <div className="flex gap-8 uppercase text-xs tracking-widest">
          <div className="relative group">
            <span className="cursor-pointer">Products</span>

            <div className="absolute right-0 mt-4 w-40 bg-white text-black shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition">

              <Link to="/chairs" className="block px-4 py-3 hover:bg-gray-100">
                Chairs
              </Link>
              <Link to="/sofas" className="block px-4 py-3 hover:bg-gray-100">
                Sofas
              </Link>
              <Link to="/benches" className="block px-4 py-3 hover:bg-gray-100">
                Benches
              </Link>

            </div>
          </div>

          <a href="#about">About</a>
          <a href="#contact">Contact</a>
        </div>
      </nav>

      {/* HERO */}
      <section className="h-screen w-full flex flex-col md:flex-row">

        {/* LEFT */}
        <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center px-8 md:px-20 pt-32 md:pt-0">

          <p className="uppercase tracking-[0.3em] text-xs opacity-60 mb-6">
            2025 Collection
          </p>

          <h1 className="text-4xl md:text-6xl lg:text-7xl leading-tight font-light mb-8">
            Crafted comfort,
            <br />
            timeless design
          </h1>

          <p className="text-sm opacity-60 mb-10 max-w-md">
            Contemporary furniture for refined living spaces
          </p>

          <div className="flex items-center gap-8">
            <a
              href="#products"
              className="border border-white px-8 py-3 text-xs tracking-widest hover:bg-white hover:text-black transition"
            >
              VIEW COLLECTION
            </a>

            <span className="text-xs opacity-60 cursor-pointer">
              EXPLORE ↓
            </span>
          </div>

        </div>

        {/* RIGHT */}
        <div className="w-full md:w-1/2 relative">

          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: "url('/heading1.jpg')" }}
          ></div>

          <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-transparent to-amber-900/40"></div>

          <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2 rotate-90 text-xs tracking-widest text-white/50">
            HANDCRAFTED — SINCE 1989
          </div>

          <div className="absolute bottom-10 right-10 border border-white/30 px-6 py-4 text-white backdrop-blur-sm">
            <p className="text-3xl">47</p>
            <p className="text-xs opacity-60">PIECES AVAILABLE</p>
          </div>

        </div>

      </section>

      {/* PRODUCTS SECTION */}
      <section id="products" className="bg-[#f5f2eb] min-h-screen px-6 md:px-12 py-20">

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-12">

          {/* SIDEBAR */}
          <div className="w-full md:w-1/4 text-xs uppercase tracking-widest space-y-10">

            <div>
              <p className="mb-4 text-gray-400">Category</p>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>All pieces</span><span>{products.length}</span></li>
                <li className="flex justify-between"><span>Chairs</span><span>31</span></li>
                <li className="flex justify-between"><span>Sofas</span><span>17</span></li>
                <li className="flex justify-between"><span>Benches</span><span>5</span></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-gray-400">Frame</p>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Beech wood</span><span>38</span></li>
                <li className="flex justify-between"><span>Oak</span><span>10</span></li>
                <li className="flex justify-between"><span>Walnut</span><span>5</span></li>
              </ul>
            </div>

            <div>
              <p className="mb-4 text-gray-400">Fabric colour</p>
              <div className="flex gap-2">
                <div className="w-5 h-5 bg-[#d6c6a5] border"></div>
                <div className="w-5 h-5 bg-[#8b7355]"></div>
                <div className="w-5 h-5 bg-[#5a4a3b]"></div>
                <div className="w-5 h-5 bg-[#2e2e2e]"></div>
                <div className="w-5 h-5 bg-[#6b8f71]"></div>
                <div className="w-5 h-5 bg-[#8b3a3a]"></div>
              </div>
            </div>

            <div>
              <p className="mb-4 text-gray-400">Style</p>
              <ul className="space-y-2">
                <li className="flex justify-between"><span>Mid-century</span><span>18</span></li>
                <li className="flex justify-between"><span>Contemporary</span><span>22</span></li>
                <li className="flex justify-between"><span>Classic</span><span>13</span></li>
              </ul>
            </div>

          </div>

          {/* GRID */}
          <div className="w-full md:w-3/4">

            <div className="flex justify-between mb-10">
              <h2 className="italic text-gray-400">All pieces</h2>
              <span className="text-xs text-gray-400">{products.length} pieces</span>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-[1px] bg-gray-300">

              {products.map((product) => (
                <div key={product.id} className="bg-[#f5f2eb] p-10 text-center group">

                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="h-24 mx-auto mb-6 object-contain group-hover:scale-110 transition"
                  />

                  <p className="text-sm mb-1">{product.name}</p>
                  <p className="text-[10px] uppercase text-gray-400">Chairs</p>

                  <Link
                    to={`/product/${product.id}`}
                    className="block mt-4 text-xs opacity-0 group-hover:opacity-100 transition"
                  >
                    View →
                  </Link>

                </div>
              ))}

            </div>

          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-black text-white py-12 text-center text-xs tracking-widest">
        <p className="opacity-60">© 2024 Sahem Hromos</p>
        <p className="opacity-40 mt-2">Crafted comfort, timeless design</p>
      </footer>

    </div>
  );
}

// ✅ ROUTES
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/chairs" element={<Chairs />} />
      <Route path="/sofas" element={<Sofas />} />
      <Route path="/benches" element={<Benches />} />
    </Routes>
  );
}
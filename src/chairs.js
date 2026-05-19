// src/Chairs.js
import React from "react";
import products from "./products";
import { Link } from "react-router-dom";

export default function Chairs() {
  const chairs = products.filter(
    (product) => product.category === "chairs"
  );

  return (
    <>
      {/* NAVBAR */}
      <nav className="w-full px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">

          {/* LOGO */}
          <img
            src="logo.png"
            alt="Sahem Hromos"
            className="h-11 md:h-16"
          />

          {/* NAV LINKS */}
          <div className="flex gap-8 uppercase text-sm items-center">

            {/* PRODUCTS DROPDOWN */}
            <div className="relative group">
              <span className="hover:underline cursor-pointer">
                Products
              </span>

              <div className="absolute left-0 mt-3 w-48 bg-white/90 backdrop-blur-sm border shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                <Link
                  to="/chairs"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Chairs
                </Link>
                <Link
                  to="/sofas"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Sofas
                </Link>
                <Link
                  to="/benches"
                  className="block px-4 py-3 text-sm hover:bg-gray-100"
                >
                  Benches
                </Link>
              </div>
            </div>

            <a href="#about" className="hover:underline">
              About
            </a>
            <a href="#contact" className="hover:underline">
              Contact
            </a>
          </div>
        </div>
      </nav>

      {/* CHAIRS GRID */}
      <div className="min-h-screen px-6 md:px-12 pt-32 pb-24 bg-white">
        <h1 className="text-4xl md:text-6xl text-center mb-16">
          Chairs
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {chairs.map((chair) => (
            <div
              key={chair.id}
              className="border rounded-lg overflow-hidden hover:shadow-xl transition"
            >
              <div className="h-64 bg-gray-50 flex items-center justify-center p-6">
                <img
                  src={chair.images[0]}
                  alt={chair.name}
                  className="max-h-[220px] object-contain"
                />
              </div>

              <div className="text-center p-6">
                <h3 className="text-xl mb-4">{chair.name}</h3>

                <Link
                  to={`/product/${chair.id}`}
                  className="inline-block px-8 py-2 border border-black uppercase tracking-widest text-sm hover:bg-black hover:text-white transition"
                >
                  View Product
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

import { useParams, Link } from "react-router-dom";
import { useState } from "react";
import products from "./products";

export default function DanteArm() {
  const { id } = useParams();
  const product = products.find(p => p.id === Number(id));

  const [index, setIndex] = useState(0);

  if (!product) {
    return <div className="p-12 text-center">Product not found</div>;
  }

  return (
    
    <div className="min-h-screen px-6 py-24">
      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12">

           {/* NAVBAR */}
      <nav className="w-full px-6 py-4 fixed top-0 left-0 right-0 z-50 bg-white/70 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <img src="logo.png" alt="Sahem Hromos" className="h-11 md:h-16" />

          <div className="flex gap-8 uppercase text-sm">
            <a href="#products" className="hover:underline">Collection</a>
            <a href="#about" className="hover:underline">About</a>
            <a href="#contact" className="hover:underline">Contact</a>
          </div>
        </div>
      </nav>

        {/* IMAGE */}
        <div className="relative">
          <img
            src={product.images[index]}
            alt={product.name}
            className="w-full max-h-[500px] object-contain"
          />
        </div>

        {/* DETAILS */}
        <div>
          <h1 className="text-4xl mb-6">{product.name}</h1>
          <p className="opacity-70 mb-10">{product.description}</p>

          <h2 className="h2-description text-[20px]">{product.wood}</h2>
          <p className="p-description text-[14px]">{product.wDes}</p>

          <h2 className="h2-description text-[20px]" >{product.fabric}</h2>
          <p className="p-description text-[14px]">{product.fDes}</p>
          
          <h2 className="h2-description text-[20px]">{product.dimensions}</h2>
          <p className="p-description text-[14px]">{product.dDes}</p>

          <Link
            to="/"
            className="inline-block px-6 py-3 border hover:bg-black hover:text-white transition"
          >
            Back to Collection
          </Link>
        </div>

      </div>
    </div>
  );
}

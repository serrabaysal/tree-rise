"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center h-screen bg-green-50 bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')", // Ağaçlı arka plan
      }}
    >
      {/* Yeşil overlay */}
      <div className="absolute inset-0 bg-green-900 bg-opacity-40"></div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white bg-opacity-90 shadow-2xl rounded-2xl p-10 text-center max-w-md w-full"
      >
        <h1 className="text-3xl font-bold text-green-800 mb-6">
          Hoş Geldiniz 
        </h1>
        <p className="text-green-700 mb-8">
          Haritaya erişmek için giriş yapın veya yeni bir hesap oluşturun.
        </p>

        <div className="flex flex-col gap-4">
          <button
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-5 py-3 rounded-xl hover:bg-green-700 transition shadow-md"
          >
            <FaSignInAlt /> Giriş Yap
          </button>

          <button
            onClick={() => router.push("/register")}
            className="flex items-center justify-center gap-2 bg-green-400 text-white px-5 py-3 rounded-xl hover:bg-green-500 transition shadow-md"
          >
            <FaUserPlus /> Kayıt Ol
          </button>
        </div>
      </motion.div>
    </div>
  );
}


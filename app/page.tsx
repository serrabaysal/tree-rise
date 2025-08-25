"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { FaSignInAlt, FaUserPlus } from "react-icons/fa";

export default function HomePage() {
  const router = useRouter();

  return (
    <div
      className="flex items-center justify-center h-screen bg-green-50 bg-cover bg-center relative overflow-hidden"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1950&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-green-900 bg-opacity-50 backdrop-blur-sm"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 bg-white bg-opacity-90 shadow-2xl rounded-3xl p-12 text-center max-w-lg w-full"
      >
        <h1 className="text-4xl font-extrabold text-green-800 mb-4 flex justify-center items-center gap-2">
          🌿 Hoş Geldiniz
        </h1>
        <p className="text-green-700 mb-8 text-lg">
          Haritaya erişmek için giriş yapın veya yeni bir hesap oluşturun.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/login")}
            className="flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 shadow-lg transition-all font-semibold"
          >
            <FaSignInAlt /> Giriş Yap
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.push("/register")}
            className="flex items-center justify-center gap-2 bg-green-400 text-white px-6 py-3 rounded-xl hover:bg-green-500 shadow-lg transition-all font-semibold"
          >
            <FaUserPlus /> Kayıt Ol
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}


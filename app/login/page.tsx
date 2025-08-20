'use client';

import { useState, type FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { FaEnvelope, FaLock, FaSignInAlt } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useUser } from '@/context/UserContext';
import axios from 'axios';

export default function LoginPage() {
  const { user, login } = useUser();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    setError('');

  
      await axios.post('/api/login', {
        email,
        password,
      }).then((response) => {
        if (response.status === 200) {
          console.log("Login successful:", response.data);
          login(response.data.user); // Update user context
          router.push('/map'); // Redirect to the map page on successful login
        } else {
          setError(response.data.message || 'Giriş başarısız!');
        }
      })
      .catch((error) => {
        setError(error.response.data.message || 'Giriş başarısız!');
      })
      .finally(() => {  
        setIsLoading(false);
      });
    
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1604079628040-94301bb21b4d?auto=format&fit=crop&w=1950&q=80')",
        }}
      ></div>

      <div className="absolute inset-0 bg-green-900 bg-opacity-60"></div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 bg-white rounded-2xl shadow-xl w-full max-w-md p-8"
      >
        <div className="flex flex-col items-center mb-6">
          <FaSignInAlt className="text-green-600 text-5xl mb-2" />
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            {user ? `Hoş Geldiniz, ${user.name}` : "Hoş Geldiniz"}
          </h1>
          <p className="text-gray-500 text-center">
            Haritaya erişmek için giriş yapın
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div className="relative">
            <label htmlFor="email" className="sr-only">E-posta adresi</label>
            <FaEnvelope className="absolute left-3 top-3 text-gray-400" />
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="E-posta adresi"
              autoComplete="email"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          <div className="relative">
            <FaLock className="absolute left-3 top-3 text-gray-400" />
            <label htmlFor="password" className="sr-only">Şifre</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Şifre"
              autoComplete="current-password"
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {error && (
            <p className="text-sm text-red-500 bg-red-100 p-2 rounded-lg text-center" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg hover:bg-green-700 transition duration-200 flex items-center justify-center gap-2 disabled:bg-green-400 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Giriş Yapılıyor...' : <><FaSignInAlt /> Giriş Yap</>}
          </button>
        </form>

        <div className="text-center mt-6">
          <a href="#" className="text-sm text-green-600 hover:underline">
            Şifremi unuttum
          </a>
        </div>
      </motion.div>
    </div>
  );
}



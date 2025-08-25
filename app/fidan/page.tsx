"use client";

import { useState, useEffect, FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";

interface Activity {
  id: number;
  title: string;
  description?: string;
  date: string;
  startTime?: string;
  volunteersNeed: number;
  volunteersMax?: number;
  imageUrl?: string;
}

export default function FidanPage() {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [volunteersNeed, setVolunteersNeed] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    fetchActivities();
  }, []);

  const fetchActivities = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("/api/activities?type=FIDAN", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setActivities(res.data);
    } catch (err: any) {
      console.error(err);
      setError("Etkinlikler yüklenirken hata oluştu.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddActivity = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "/api/activities",
        { title, description, date, startTime, volunteersNeed, type: "FIDAN" },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.status === 201) {
        setShowForm(false);
        fetchActivities();
        setTitle("");
        setDescription("");
        setDate("");
        setStartTime("");
        setVolunteersNeed(1);
        setSuccess("🎉 Fidan etkinliği başarıyla eklendi!");
      }
    } catch (err: any) {
      console.error("Etkinlik eklenemedi", err);
      if (err.response?.status === 401) setError("Yetkisiz işlem. Lütfen giriş yapın.");
      else setError("Etkinlik eklenirken bir hata oluştu.");
    }
  };

  if (loading)
    return <p className="text-center mt-20 text-green-700 text-lg font-semibold">🌱 Yükleniyor...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 p-6 flex flex-col items-center">
      {/* Başlık ve Buton */}
      <div className="flex flex-col items-center mb-8 gap-4 text-center">
        <h1 className="text-5xl font-bold text-green-800 flex items-center gap-2 justify-center">
          🌱 Fidan Etkinlikleri
        </h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-green-600 text-white px-6 py-3 rounded-full shadow-lg hover:bg-green-700 transition duration-300 font-semibold"
        >
          {showForm ? "İptal" : "Yeni Etkinlik Ekle"}
        </button>
      </div>

      {/* Hata veya Başarı Mesajları */}
      {error && <p className="mb-4 text-red-600 font-semibold">{error}</p>}
      {success && (
        <motion.p
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 px-6 py-3 bg-green-400 text-white font-semibold rounded-xl shadow-md"
        >
          {success}
        </motion.p>
      )}

      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-start pt-24 z-50"
          >
            <motion.form
              onSubmit={handleAddActivity}
              className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-lg relative"
              initial={{ y: -50 }}
              animate={{ y: 0 }}
              exit={{ y: -50 }}
            >
              <h2 className="text-2xl font-bold text-green-700 mb-4 text-center">
                Yeni Fidan Etkinliği
              </h2>
              <div className="flex flex-col gap-4">
                <input
                  type="text"
                  placeholder="Etkinlik Başlığı"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  required
                />
                <textarea
                  placeholder="Açıklama"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
                <div className="flex gap-3">
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
                    required
                  />
                  <input
                    type="time"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 flex-1"
                  />
                </div>
                <input
                  type="number"
                  placeholder="Gönüllü Sayısı"
                  value={volunteersNeed}
                  onChange={(e) => setVolunteersNeed(Number(e.target.value))}
                  className="p-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400"
                  min={1}
                  required
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white py-3 rounded-xl hover:bg-green-700 font-semibold transition duration-300"
                >
                  Etkinliği Ekle
                </button>
              </div>
            </motion.form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Aktivite Kartları */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6 w-full max-w-7xl">
        {activities.map((activity) => (
          <motion.div
            key={activity.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-3xl shadow-md overflow-hidden hover:shadow-2xl hover:scale-105 transition transform cursor-pointer"
          >
            <div className="h-40 w-full bg-green-100 overflow-hidden rounded-t-3xl">
              <img
                src={activity.imageUrl || "/placeholder.png"}
                alt={activity.title}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-green-800 mb-2">{activity.title}</h2>
              <p className="text-green-700 text-sm mb-3">
                {activity.description?.slice(0, 80) || "Detaylı açıklama yok..."}
              </p>
              <p className="text-gray-600 text-sm mb-1">
                📅 {new Date(activity.date).toLocaleDateString()}{" "}
                {activity.startTime && `- ${activity.startTime}`}
              </p>
              <p className="text-gray-600 text-sm">
                👥 Gerekli Gönüllü: {activity.volunteersNeed}{" "}
                {activity.volunteersMax && `/ Maks: ${activity.volunteersMax}`}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}


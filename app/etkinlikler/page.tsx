'use client';

import { useState, FormEvent, useEffect } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";

interface FormData {
  title: string;
  description: string;
  type: string;
  status: string;
  category: string;
  targetGroup: string;
  lat: number;
  lng: number;
  locationName: string;
  date: string;
  startTime: string;
  endTime: string;
  difficulty: string;
  volunteersNeed: number;
  volunteersMax: number | null;
  alanId: number;
  createdById: number;
}

export default function FidanPage() {
  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    type: "FIDAN",
    status: "AKTIF",
    category: "HERKES",
    targetGroup: "HERKES",
    lat: 0,
    lng: 0,
    locationName: "",
    date: "",
    startTime: "",
    endTime: "",
    difficulty: "KOLAY",
    volunteersNeed: 1,
    volunteersMax: null,
    alanId: 1,
    createdById: 1,
  });

  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setShowForm(true), 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: ["volunteersNeed", "volunteersMax", "lat", "lng"].includes(name) ? Number(value) : value
    }));
  };

  const handleSubmit = async (e: FormEvent) => {
  e.preventDefault();
  try {
    await axios.post("/api/activities", formData, {
      withCredentials: true, // cookie token'ı göndermesi için
    });
    alert("✅ Etkinlik başarıyla eklendi!");
    setFormData(prev => ({
      ...prev,
      title: "",
      description: "",
      locationName: "",
      date: "",
      startTime: "",
      endTime: "",
      volunteersNeed: 1,
      volunteersMax: null
    }));
  } catch (err: any) {
    console.error("❌ Hata:", err.response?.data || err.message);
    alert("Bir hata oluştu!");
  }
};

  // Form alanları konfigürasyonu
  const inputFields = [
    { name: "title", placeholder: "Etkinlik başlığı", type: "text", required: true },
    { name: "description", placeholder: "Açıklama", type: "textarea", required: false },
    { name: "locationName", placeholder: "Konum adı", type: "text", required: false },
    { name: "lat", placeholder: "Latitude", type: "number", required: true },
    { name: "lng", placeholder: "Longitude", type: "number", required: true },
    { name: "date", placeholder: "Tarih", type: "date", required: true },
    { name: "startTime", placeholder: "Başlangıç Saati", type: "time", required: false },
    { name: "endTime", placeholder: "Bitiş Saati", type: "time", required: false },
    { name: "volunteersNeed", placeholder: "Gerekli Gönüllü Sayısı", type: "number", required: true },
    { name: "volunteersMax", placeholder: "Maks Gönüllü (opsiyonel)", type: "number", required: false },
  ];

  const selectFields = [
    { name: "type", options: ["FIDAN", "TEMIZLIK", "DESTEK", "PSIKOLOJIK_DESTEK", "SU_TASIMA"] },
    { name: "status", options: ["AKTIF", "DOLDU", "IPTAL"] },
    { name: "category", options: ["COCUK_DOSTU", "YETISKIN", "AILE", "GRUP", "BIREYSEL"] },
    { name: "targetGroup", options: ["GENCLER", "YETISKINLER", "AILELER", "HERKES"] },
    { name: "difficulty", options: ["KOLAY", "ORTA", "ZOR"] },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50 p-6 relative">
      <AnimatePresence>
        {!showForm && (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-green-600 z-50"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <motion.h1
              className="text-4xl font-bold text-white text-center"
              initial={{ scale: 0 }}
              animate={{ scale: 1.2 }}
              transition={{ type: "spring", stiffness: 200, damping: 10 }}
            >
              🌱 Hoş Geldiniz!
            </motion.h1>
          </motion.div>
        )}
      </AnimatePresence>

      {showForm && (
        <motion.div
          className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl text-black"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold text-green-700 text-center mb-6">
            🌱 Yeni Etkinlik Ekle
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            {inputFields.map(field => (
              field.type === "textarea" ? (
                <textarea
                  key={field.name}
                  name={field.name}
                  value={(formData as any)[field.name]}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border rounded-lg p-2 text-black"
                  required={field.required}
                />
              ) : (
                <input
                  key={field.name}
                  type={field.type}
                  name={field.name}
                  value={(formData as any)[field.name] ?? ""}
                  onChange={handleChange}
                  placeholder={field.placeholder}
                  className="w-full border rounded-lg p-2 text-black"
                  required={field.required}
                />
              )
            ))}

            <div className="grid grid-cols-2 gap-4">
              {selectFields.map(select => (
                <select
                  key={select.name}
                  name={select.name}
                  value={(formData as any)[select.name]}
                  onChange={handleChange}
                  className="border rounded-lg p-2 text-black"
                >
                  {select.options.map(option => (
                    <option key={option} value={option}>{option}</option>
                  ))}
                </select>
              ))}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.05 }}
              className="w-full bg-green-600 text-white font-semibold py-2 rounded-lg shadow-md hover:bg-green-700 transition"
            >
              + Etkinlik Ekle
            </motion.button>
          </form>
        </motion.div>
      )}
    </div>
  );
}






"use client";

import dynamic from "next/dynamic";
import axios from "axios";
import { useCallback } from "react";

// TurkeyMap bileşenini SSR kapalı şekilde dinamik yükle
const TurkeyMap = dynamic(() => import("../components/TurkeyMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 bg-gray-200 rounded-lg flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Türkiye Haritası Yükleniyor...</p>
      </div>
    </div>
  ),
});

const MapPage = () => {
  // API'ye veri eklemek için kullanılan fonksiyon
  const handleAddArea = useCallback(
    async (name: string, type: string, coordinates: string) => {
      try {
        const res = await axios.post("/api/alanlar", {
          name,
          type,
          coordinates,
        });
        console.log("Alan başarıyla eklendi:", res.data);
        alert("Alan başarıyla eklendi!");
      } catch (error) {
        console.error("Alan eklenemedi:", error);
        alert("Alan eklenirken hata oluştu!");
      }
    },
    []
  );

  // Test amaçlı butona tıklayınca çalışacak fonksiyon
  const handleButtonClick = async () => {
    await handleAddArea(
      "Test Alanı",
      "Ağaç Dikimi",
      "[(39.9, 32.8), (40.0, 33.0)]"
    );
  };

  return (
    <div className="space-y-4 p-4">
      {/* Harita */}
      <TurkeyMap onAddArea={handleAddArea} />

      {/* Test Butonu */}
      <button
        onClick={handleButtonClick}
        className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
      >
        Test Alan Ekle
      </button>
    </div>
  );
};

export default MapPage;





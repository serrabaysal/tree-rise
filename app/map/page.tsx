"use client";

import dynamic from "next/dynamic";

const TurkeyMap = dynamic(() => import("@/components/TurkeyMap"), {
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

  return (
    <div className="space-y-4 p-4">
      {/* Harita */}
      <TurkeyMap />

    </div>
  );
};

export default MapPage;






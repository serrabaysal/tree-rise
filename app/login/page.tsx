"use client";
import React from "react";
import { useRouter } from "next/navigation";

function page() {
  const router = useRouter();
  return (
    <div>
      <button
        onClick={() => {
          router.push("/map"); 
        }} // Redirect to login page
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        map sayfasına git
      </button>
    </div>
  );
}

export default page;

"use client";

import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  Marker,
  useMapEvents,
} from "react-leaflet";
import type { LatLngExpression, LatLngTuple } from "leaflet";
import L from "leaflet";
import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";

import treeIconPng from "../public/tree-icon.png";
import fireIconPng from "../public/fire-icon.png";
import axios from "axios";
import { ALAN_TYPE } from "@/consts";

interface FireZone {
  name: string;
  coordinates: LatLngExpression[];
  severity?: number;
  type?: string;
}

interface FirePoint {
  name: string;
  coordinate: LatLngExpression;
  severity?: number;
  type?: string;
}

interface TurkeyMapProps {
  onAddArea: (name: string, type: string, coordinates: string) => void;
}

function MapClickHandler({ 
  onAddArea,
  selectedPoints,
  setSelectedPoints,
  isCreatingPolygon,
  setIsCreatingPolygon,
  getPolygonCenter,
  fireIcon
}: TurkeyMapProps & {
  selectedPoints: LatLngExpression[];
  setSelectedPoints: (points: LatLngExpression[]) => void;
  isCreatingPolygon: boolean;
  setIsCreatingPolygon: (creating: boolean) => void;
  getPolygonCenter: (coords: LatLngExpression[]) => [number, number];
  fireIcon: L.Icon;
}) {
  useMapEvents({
    click(e) {
      if (!isCreatingPolygon) {
        // Normal tek nokta ekleme
        const { lat, lng } = e.latlng;
        onAddArea("Seçilen Nokta", "FREE", JSON.stringify([[lat, lng]]));
        return;
      }

      // Polygon oluşturma modu
      const { lat, lng } = e.latlng;
      const newPoint: LatLngExpression = [lat, lng];
      
      if (selectedPoints.length < 4) {
        setSelectedPoints([...selectedPoints, newPoint]);
        
        // 4. nokta seçildiğinde polygon'u tamamla
        if (selectedPoints.length === 3) {
          const allPoints = [...selectedPoints, newPoint]; // 4 nokta
          const polygonPoints = [...allPoints, selectedPoints[0]]; // Son noktayı ilk noktayla birleştir
          
          // 4 noktanın merkezini hesapla
          const center = getPolygonCenter(allPoints);
          
          // Polygon'u veritabanına kaydet
          const polygonName = `Yanan Alan ${new Date().toLocaleTimeString()}`;
          
          // Debug için console.log ekleyelim
          console.log('Gönderilecek veri:', {
            name: polygonName,
            type: "FIRE_ZONE", 
            coordinates: polygonPoints,
            center: center
          });
          
          // JSON.stringify yerine direkt array gönderelim
          onAddArea(polygonName,ALAN_TYPE.YANAN, JSON.stringify(polygonPoints));
          
          // Durumu sıfırla
          setSelectedPoints([]);
          setIsCreatingPolygon(false);
          
          alert(`${polygonName} başarıyla oluşturuldu!`);
        }
      }
    },
  });

  return (
    <>
      {/* Seçilen noktaları göster */}
      {selectedPoints.map((point, index) => (
        <Marker 
          key={`selected-${index}`} 
          position={point}
          icon={new L.Icon({
            iconUrl: 'data:image/svg+xml;base64,' + btoa(`
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="red">
                <circle cx="12" cy="12" r="8"/>
                <text x="12" y="16" text-anchor="middle" fill="white" font-size="10" font-weight="bold">${index + 1}</text>
              </svg>
            `),
            iconSize: [24, 24],
            iconAnchor: [12, 12],
          })}
        >
          <Tooltip>Nokta {index + 1}</Tooltip>
        </Marker>
      ))}
      
      {/* Geçici polygon çizgilerini göster */}
      {selectedPoints.length > 1 && (
        <Polygon
          positions={selectedPoints}
          pathOptions={{
            color: "blue",
            fillColor: "lightblue",
            fillOpacity: 0.3,
            weight: 2,
            dashArray: "5, 10",
          }}
        />
      )}
      
      {/* Eğer 4 nokta seçildiyse merkeze geçici fire icon göster */}
      {selectedPoints.length >= 3 && isCreatingPolygon && (
        <Marker
          position={getPolygonCenter(selectedPoints)}
          icon={fireIcon}
        >
          <Tooltip>🔥 Yanan Alan Merkezi</Tooltip>
        </Marker>
      )}
    </>
  );
}

export default function TurkeyMap({ onAddArea }: TurkeyMapProps) {
  const centerPosition: LatLngExpression = [39.0, 35.0];
  
  const [firePoints, setFirePoints] = useState<FirePoint[]>([]);
  const [fireZones, setFireZones] = useState<FireZone[]>([]); // Polygon alanları için
  const [selectedPoints, setSelectedPoints] = useState<LatLngExpression[]>([]);
  const [isCreatingPolygon, setIsCreatingPolygon] = useState(false);

  useEffect(() => {
    const fetchFireZones = async () => {
      try {
        const response = await axios.get("/api/alanlar");

        const points: FirePoint[] = [];
        const zones: FireZone[] = [];

        response.data.forEach((zone: any) => {
          if (zone.type === "FIRE_ZONE" && zone.coordinates?.type === "Polygon") {
            // Polygon alanları
            const coordinates = zone.coordinates.coordinates[0].map((coord: number[]) => [coord[1], coord[0]] as LatLngExpression);
            zones.push({
              name: zone.name,
              coordinates: coordinates,
              severity: zone.severity || 3,
              type: zone.type
            });
          } else {
            // Nokta alanları
            let coord: [number, number] | null = null;

            if (zone.coordinates?.type === "Polygon") {
              const firstPoint = zone.coordinates.coordinates[0][0];
              coord = [firstPoint[1], firstPoint[0]];
            } else if (Array.isArray(zone.coordinates) && zone.coordinates.length > 0) {
              coord = [zone.coordinates[0][0], zone.coordinates[0][1]];
            }

            if (coord) {
              points.push({
                name: zone.name,
                coordinate: coord,
                severity: zone.severity || 1,
                type: zone.type
              });
            }
          }
        });

        setFirePoints(points);
        setFireZones(zones);
      } catch (error) {
        console.error("Yangın bölgeleri yüklenirken hata:", error);
      }
    };

    fetchFireZones();
  }, []);

  // Ağaç simgesi için ikon ayarı
  const treeIcon = new L.Icon({
    iconUrl: treeIconPng.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Fire simgesi için ikon ayarı
  const fireIcon = new L.Icon({
    iconUrl: fireIconPng.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  // Polygon'un merkezini hesapla
  const getPolygonCenter = (coords: LatLngExpression[]) => {
    let latSum = 0, lngSum = 0;
    coords.forEach((c) => {
      const [lat, lng] = c as [number, number];
      latSum += lat;
      lngSum += lng;
    });
    return [latSum / coords.length, lngSum / coords.length] as [number, number];
  };

  // Yangın bölgelerini renklerine göre ayarla
  const getFillColor = (severity = 1) => {
    switch (severity) {
      case 3:
        return "#ff4444"; // Kırmızı
      case 2:
        return "#ff8800"; // Turuncu
      case 1:
      default:
        return "#ffcc00"; // Sarı
    }
  };
  const togglePolygonCreation = () => {
    if (isCreatingPolygon) {
      // İptal et
      setSelectedPoints([]);
      setIsCreatingPolygon(false);
    } else {
      // Başlat
      setIsCreatingPolygon(true);
      setSelectedPoints([]);
    }
  };

  return (
    <div className="space-y-4">
      {/* Kontrol Paneli */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex items-center gap-4">
          <button
            onClick={togglePolygonCreation}
            className={`px-4 py-2 rounded-md font-medium transition-colors ${
              isCreatingPolygon
                ? "bg-red-500 text-white hover:bg-red-600"
                : "bg-green-500 text-white hover:bg-green-600"
            }`}
          >
            {isCreatingPolygon ? "Polygon Oluşturmayı İptal Et" : "Yanan Alan Oluştur"}
          </button>
          
          {isCreatingPolygon && (
            <div className="text-sm text-gray-600">
              <span className="font-medium">
                Nokta {selectedPoints.length + 1}/4 seçiliyor...
              </span>
              <p className="mt-1">Haritada 4 nokta seçerek yanan alan polygonu oluşturun</p>
            </div>
          )}
        </div>
        
        {selectedPoints.length > 0 && (
          <div className="mt-2 text-xs text-blue-600">
            Seçilen noktalar: {selectedPoints.length}/4
          </div>
        )}
      </div>

      {/* Harita */}
      <div className="h-[600px] w-full">
        <MapContainer
          center={centerPosition}
          zoom={6}
          scrollWheelZoom={true}
          className="h-full w-full rounded-lg"
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Harita tıklama işleyicisi */}
          <MapClickHandler 
            onAddArea={onAddArea}
            selectedPoints={selectedPoints}
            setSelectedPoints={setSelectedPoints}
            isCreatingPolygon={isCreatingPolygon}
            setIsCreatingPolygon={setIsCreatingPolygon}
            getPolygonCenter={getPolygonCenter}
            fireIcon={fireIcon}
          />

          {/* Mevcut yangın noktaları */}
          {firePoints.map((point, index) => (
            <Marker
              key={`fire-point-${index}`}
              position={point.coordinate as LatLngTuple}
              icon={treeIcon}
              eventHandlers={{
                click: () =>
                  onAddArea(point.name, "fire-point", JSON.stringify(point.coordinate)),
              }}
            >
              <Tooltip>{point.name} - Yangın Noktası</Tooltip>
            </Marker>
          ))}

          {/* Yangın bölgesi polygon'ları */}
          {fireZones.map((zone, index) => (
            <div key={`fire-zone-${index}`}>
              <Polygon
                positions={zone.coordinates}
                pathOptions={{
                  color: "#cc0000",
                  fillColor: getFillColor(zone.severity),
                  fillOpacity: 0.4,
                  weight: 2,
                  dashArray: "4",
                }}
              >
                <Tooltip>{zone.name} - Yanan Alan</Tooltip>
              </Polygon>

              {/* Polygon merkezine fire icon'u ekle */}
              <Marker
                position={getPolygonCenter(zone.coordinates)}
                icon={fireIcon}
                eventHandlers={{
                  click: () =>
                    onAddArea(zone.name, "fire-zone", JSON.stringify(zone.coordinates)),
                }}
              >
                <Tooltip>🔥 {zone.name}</Tooltip>
              </Marker>
            </div>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
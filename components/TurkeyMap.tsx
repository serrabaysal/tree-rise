'use client';
import {
  MapContainer,
  TileLayer,
  Polygon,
  Tooltip,
  Marker,
} from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

import treeIconPng from '../public/tree-icon.png'; // PNG dosyan buradaysa

interface FireZone {
  name: string;
  coordinates: LatLngExpression[];
  severity?: number;
}

interface TurkeyMapProps {
  onAddArea: (name: string, type: string, coordinates: string) => void;
}

export default function TurkeyMap({ onAddArea }: TurkeyMapProps) {
  const centerPosition: LatLngExpression = [39.0, 35.0];

  const fireZones: FireZone[] = [
    { name: 'Manisa', coordinates: [[38.6, 27.4],[38.5, 27.5],[38.45, 27.3],[38.55, 27.2],[38.6, 27.4]], severity: 2 },
    { name: 'Bursa', coordinates: [[40.2, 29.0],[40.1, 29.2],[40.05, 29.0],[40.1, 28.8],[40.2, 29.0]], severity: 1 },
    { name: 'Antalya', coordinates: [[36.9, 30.7],[36.85, 30.8],[36.8, 30.6],[36.85, 30.5],[36.9, 30.7]], severity: 3 },
    { name: 'Mersin', coordinates: [[36.8, 34.6],[36.75, 34.7],[36.7, 34.5],[36.75, 34.4],[36.8, 34.6]], severity: 2 },
    { name: 'Muğla', coordinates: [[37.2, 28.3],[37.15, 28.4],[37.1, 28.2],[37.15, 28.1],[37.2, 28.3]], severity: 3 },
    { name: 'Adana', coordinates: [[37.0, 35.3],[36.95, 35.4],[36.9, 35.2],[36.95, 35.1],[37.0, 35.3]], severity: 2 },
    { name: 'Balıkesir', coordinates: [[39.6, 27.9],[39.55, 28.0],[39.5, 27.8],[39.55, 27.7],[39.6, 27.9]], severity: 1 },
    { name: 'Çanakkale', coordinates: [[40.2, 26.4],[40.15, 26.5],[40.1, 26.3],[40.15, 26.2],[40.2, 26.4]], severity: 1 },
    { name: 'İstanbul', coordinates: [[41.1, 29.0],[41.0, 29.1],[40.9, 29.0],[41.0, 28.9],[41.1, 29.0]], severity: 3 },
    { name: 'Ankara', coordinates: [[39.95, 32.85],[39.9, 33.0],[39.85, 32.9],[39.9, 32.8],[39.95, 32.85]], severity: 2 },
    { name: 'Samsun', coordinates: [[41.3, 36.3],[41.25, 36.4],[41.2, 36.3],[41.25, 36.2],[41.3, 36.3]], severity: 1 },
    { name: 'Trabzon', coordinates: [[41.0, 39.7],[40.95, 39.8],[40.9, 39.7],[40.95, 39.6],[41.0, 39.7]], severity: 1 },
    { name: 'Gaziantep', coordinates: [[37.1, 37.4],[37.05, 37.5],[37.0, 37.4],[37.05, 37.3],[37.1, 37.4]], severity: 2 },
    { name: 'Konya', coordinates: [[37.0, 32.5],[36.95, 32.6],[36.9, 32.5],[36.95, 32.4],[37.0, 32.5]], severity: 2 },
    { name: 'Kayseri', coordinates: [[38.75, 35.5],[38.7, 35.6],[38.65, 35.5],[38.7, 35.4],[38.75, 35.5]], severity: 1 },
  ];

  const getFillColor = (severity = 1) => {
    switch (severity) {
      case 3: return 'darkred';
      case 2: return 'orange';
      case 1:
      default: return 'yellow';
    }
  };

  const getCenter = (coords: LatLngExpression[]) => {
    let latSum = 0, lngSum = 0;
    coords.forEach((c) => {
      const [lat, lng] = c as [number, number];
      latSum += lat;
      lngSum += lng;
    });
    return [latSum / coords.length, lngSum / coords.length] as [number, number];
  };

  const treeIcon = new L.Icon({
    iconUrl: treeIconPng.src,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  return (
    <div className="h-[600px] w-full">
      <MapContainer center={centerPosition} zoom={6} scrollWheelZoom={true} className="h-full w-full rounded-lg">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {fireZones.map((zone, index) => (
          <div key={index}>
            <Polygon
              key={`poly-${index}`}
              positions={zone.coordinates}
              pathOptions={{
                color: 'red',
                fillColor: getFillColor(zone.severity),
                fillOpacity: 0.4,
                weight: 2,
                dashArray: '4',
              }}
            >
              <Tooltip>{zone.name} - Yanan Alan</Tooltip>
            </Polygon>

            <Marker
              key={`marker-${index}`}
              position={getCenter(zone.coordinates)}
              icon={treeIcon}
              eventHandlers={{
                click: () =>
                  onAddArea(zone.name, 'fire-zone', JSON.stringify(zone.coordinates)),
              }}
            />
          </div>
        ))}
      </MapContainer>
    </div>
  );
}







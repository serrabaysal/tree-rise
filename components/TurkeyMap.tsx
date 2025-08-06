'use client';
import { MapContainer, TileLayer, Polygon, Tooltip } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';

import 'leaflet/dist/leaflet.css';

interface FireZone {
  name: string;
  coordinates: LatLngExpression[];
}

export default function TurkeyMap() {
  const fireZones: FireZone[] = [
    {
      name: 'İzmir',
      coordinates: [
        [38.4192, 27.1287],
        [38.4, 27.2],
        [38.3, 27.1],
        [38.35, 27.0],
        [38.4192, 27.1287],
      ],
    },
    {
      name: 'Manisa',
      coordinates: [
        [38.6, 27.4],
        [38.5, 27.5],
        [38.45, 27.3],
        [38.55, 27.2],
        [38.6, 27.4],
      ],
    },
    {
      name: 'Bursa',
      coordinates: [
        [40.2, 29.0],
        [40.1, 29.2],
        [40.05, 29.0],
        [40.1, 28.8],
        [40.2, 29.0],
      ],
    },
  ];

  const centerPosition: LatLngExpression = [39.0, 35.0];

  console.log('centerPosition:', centerPosition);
  

  return (
    <div className="h-[600px] w-full">
      <MapContainer 
        center={centerPosition} 
        zoom={6} 
        scrollWheelZoom={true} 
        className="h-full w-full z-0 rounded-lg"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {fireZones.map((zone, index) => (
          <Polygon
            key={index}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.5 }}
            positions={zone.coordinates}
          >
            <Tooltip>{zone.name} - Yanan Alan</Tooltip>
          </Polygon>
        ))}
      </MapContainer>
    </div>
  );
}
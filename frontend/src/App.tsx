import React, { useState, useEffect } from 'react';
import './index.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster';
import MarkerClusterGroup from 'react-leaflet-cluster';
import type { MarkerCluster } from 'leaflet.markercluster';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
delete (L.Icon.Default.prototype as any)._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const createClusterCustomIcon = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount();

  return L.divIcon({
    html: `<span>${count}</span>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40, true),
  });
};

// --- Define types ---
interface Facility {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
}

export default function App() {
  const [facilities, setFacilities] = useState<Facility[]>([]);

  useEffect(() => {
    fetch('/api/facilities')
      .then((res) => res.json())
      .then((data) => setFacilities(data))
      .catch((err) => console.error('Error fetching facilities:', err));
  }, []);

  const defaultCenter: [number, number] = [43.6532, -79.3832]; // toronto
  const defaultZoom = 4;

  return (
    <MapContainer
      center={defaultCenter}
      zoom={defaultZoom}
      scrollWheelZoom={true}
      className="map-container"
      style={{ height: '100vh', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <MarkerClusterGroup
        maxClusterRadius={100}
        iconCreateFunction={createClusterCustomIcon}
        showCoverageOnHover={false}
      >
        {facilities.map((facility) => (
          <Marker key={facility.id} position={[facility.latitude, facility.longitude] as [number, number]}>
            <Popup>
              <strong>{facility.name}</strong>
              <br />
              Lat: {facility.latitude}
              <br />
              Lng: {facility.longitude}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
    </MapContainer>
  );
}

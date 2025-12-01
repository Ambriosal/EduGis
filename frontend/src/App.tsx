import React, { useState, useEffect } from 'react';
import './index.css';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import RegionFilter from './components/RegionFilter';
import FacilityTypeFilter from './components/FacilityTypeFilter';
import MarkerClusterGroup from 'react-leaflet-cluster';

import 'leaflet.markercluster';
import type { MarkerCluster } from 'leaflet.markercluster';
import CompareFacilities from './CompareFacilities';

/* eslint-disable @typescript-eslint/no-explicit-any */
delete (L.Icon.Default.prototype as any)._getIconUrl;
/* eslint-enable @typescript-eslint/no-explicit-any */

L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Optional cluster icon (if needed later)
const createClusterCustomIcon = (cluster: MarkerCluster) => {
  const count = cluster.getChildCount();
  return L.divIcon({
    html: `<span>${count}</span>`,
    className: 'custom-cluster-icon',
    iconSize: L.point(40, 40, true),
  });
};

// ---- Types ----
interface Facility {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  region?: string; // region filter
  type?: string; // type filter
}

export default function App() {
  const [view, setView] = useState<'map' | 'compare'>('map');
  const [facilities, setFacilities] = useState<Facility[]>([]);

  // region filter state
  const [regions, setRegions] = useState<string[]>([]);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);

  // type filter state
  const [facilityTypes, setFacilityTypes] = useState<string[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);

  // ---- Fetch facilities ----
  useEffect(() => {
    fetch('/api/facilities')
      .then((res) => res.json())
      .then((data: Facility[]) => {
        // fallback if missing "type"
        const updated = data.map((f) => ({
          ...f,
          type: f.type || 'Unknown',
        }));

        setFacilities(updated);

        // extract unique types
        const types = Array.from(new Set(updated.map((f) => f.type || 'Unknown')));
        setFacilityTypes(types);
      })
      .catch((err) => console.error('Error fetching facilities:', err));
  }, []);

  // ---- Fetch regions ----
  useEffect(() => {
    fetch('/api/regions')
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setRegions(data);
        else setRegions(['Ontario', 'Quebec', 'Alberta', 'British Columbia']);
      })
      .catch(() => setRegions(['Ontario', 'Quebec', 'Alberta', 'British Columbia']));
  }, []);

  // // ---- Apply both filters ----
  // let filteredFacilities = [...facilities];

  // // region filter
  // if (selectedRegions.length > 0) {
  //   filteredFacilities = filteredFacilities.filter((f) => selectedRegions.includes(f.region || ''));
  // }

  // // type filter
  // if (selectedTypes.length > 0) {
  //   filteredFacilities = filteredFacilities.filter((f) => selectedTypes.includes(f.type || 'Unknown'));
  // }

  //Refactored

  const applyFilters = (facilities: Facility[], selectedRegions: string[], selectedTypes: string[]): Facility[] => {
    return facilities
      .filter((f: Facility) => selectedRegions.length === 0 || selectedRegions.includes(f.region || ''))
      .filter((f: Facility) => selectedTypes.length === 0 || selectedTypes.includes(f.type || 'Unknown'));
  };

  // ---- Apply both filters ----
  const filteredFacilities = applyFilters(facilities, selectedRegions, selectedTypes);

  const defaultCenter: [number, number] = [43.6532, -79.3832];
  const defaultZoom = 6;

  return (
    <>
      {/* View toggle buttons */}
      <div style={{ position: 'absolute', zIndex: 1000, top: 10, right: 10, display: 'flex', gap: '10px' }}>
        <button onClick={() => setView('map')}>Map View</button>
        <button onClick={() => setView('compare')}>Compare Facilities</button>
      </div>

      {view === 'map' && (
        <>
          <RegionFilter regions={regions} selectedRegions={selectedRegions} onChange={setSelectedRegions} />

          <FacilityTypeFilter types={facilityTypes} selectedTypes={selectedTypes} onChange={setSelectedTypes} />

          <MapContainer
            center={defaultCenter}
            zoom={defaultZoom}
            scrollWheelZoom
            className="map-container"
            style={{ height: '100vh', width: '100%' }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            <MarkerClusterGroup
              maxClusterRadius={100}
              iconCreateFunction={createClusterCustomIcon}
              showCoverageOnHover={false}
            >
              {filteredFacilities.map((facility: Facility) => (
                <Marker key={facility.id} position={[facility.latitude, facility.longitude]}>
                  <Popup>
                    <strong>{facility.name}</strong>
                    <br />
                    <em>Type:</em> {facility.type}
                    <br />
                    <em>Region:</em> {facility.region}
                    <br />
                    Lat: {facility.latitude}
                    <br />
                    Lng: {facility.longitude}
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </>
      )}

      {view === 'compare' && <CompareFacilities />}
    </>
  );
}

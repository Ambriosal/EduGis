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

interface RegionInfo {
  region: string;
  facilities: number[]; // [ECE, Elem, Sec, PostSec]
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

  const [regionInfo, setRegionInfo] = useState<RegionInfo[]>([]);

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

  useEffect(() => {
    // No regions selected: clear backend stats
    if (selectedRegions.length === 0) {
      setRegionInfo([]);
      return;
    }

    const query = selectedRegions.map((r) => `regions=${encodeURIComponent(r)}`).join('&');

    fetch(`/api/facilities/info?${query}`)
      .then((res) => res.json())
      .then((data: RegionInfo[]) => {
        setRegionInfo(data);
      })
      .catch((err) => {
        console.error('Error fetching facilities info:', err);
        setRegionInfo([]);
      });
  }, [selectedRegions]);

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

  let totalFacilities = 0;
  let earlyChildhoodCount = 0;
  let elementaryCount = 0;
  let secondaryCount = 0;
  let postSecondaryCount = 0;

  // Map facility type strings to indexes in the facilities[] array
  const labelToIndex: Record<string, number> = {
    'Early Childhood Education': 0,
    Elementary: 1,
    Secondary: 2,
    'Post Secondary': 3,
  };

  // If we have backend region info, use that
  if (regionInfo.length > 0) {
    const sums = [0, 0, 0, 0];

    // Sum counts across regions
    regionInfo.forEach((r) => {
      r.facilities.forEach((count, idx) => {
        sums[idx] += count;
      });
    });

    // Which categories are active based on the type filter?
    const activeIndexes =
      selectedTypes.length === 0
        ? [0, 1, 2, 3]
        : selectedTypes.map((t) => labelToIndex[t]).filter((idx): idx is number => idx !== undefined);

    totalFacilities = activeIndexes.reduce((sum, idx) => sum + sums[idx], 0);

    earlyChildhoodCount = activeIndexes.includes(0) ? sums[0] : 0;
    elementaryCount = activeIndexes.includes(1) ? sums[1] : 0;
    secondaryCount = activeIndexes.includes(2) ? sums[2] : 0;
    postSecondaryCount = activeIndexes.includes(3) ? sums[3] : 0;
  } else {
    // Fallback: no selected regions or backend not used -> compute from filteredFacilities
    totalFacilities = filteredFacilities.length;

    const countType = (typeName: string) =>
      filteredFacilities.filter((f) => (f.type || '').toLowerCase() === typeName.toLowerCase()).length;

    earlyChildhoodCount = countType('Early Childhood Education');
    elementaryCount = countType('Elementary');
    secondaryCount = countType('Secondary');
    postSecondaryCount = countType('Post Secondary');
  }

  const percent = (count: number) => (totalFacilities === 0 ? 0 : ((count / totalFacilities) * 100).toFixed(1));

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

          <div
            style={{
              position: 'absolute',
              zIndex: 900,
              top: 70,
              right: 10,
              background: 'rgba(255,255,255,0.95)',
              padding: '10px 14px',
              borderRadius: '8px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.2)',
              fontSize: '14px',
              minWidth: '240px',
            }}
          >
            <h4 style={{ marginTop: 0, marginBottom: 8 }}>Facility Statistics</h4>
            <div>
              <strong>Total:</strong> {totalFacilities}
            </div>

            <div>
              <strong>Early Childhood:</strong> {earlyChildhoodCount} ({percent(earlyChildhoodCount)}%)
            </div>

            <div>
              <strong>Elementary:</strong> {elementaryCount} ({percent(elementaryCount)}%)
            </div>

            <div>
              <strong>Secondary:</strong> {secondaryCount} ({percent(secondaryCount)}%)
            </div>

            <div>
              <strong>Post Secondary:</strong> {postSecondaryCount} ({percent(postSecondaryCount)}%)
            </div>
          </div>

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

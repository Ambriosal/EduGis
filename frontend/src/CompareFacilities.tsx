import React, { useEffect, useState, useCallback } from 'react';
import CompareRegionFilter from './components/CompareRegionFilter';
import CompareFacilityTypeFilter from './components/CompareFacilityTypeFilter';
import { BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface FacilityCount {
  province: string;
  count: number;
}

interface FacilityRecord {
  type: string;
  province: string;
}

interface ChartDataPoint {
  province: string;
  [key: string]: string | number;
}

// --- MOCK FALLBACKS (moved outside component) ---
const mockFacilityTypes = ['Primary School', 'Secondary School', 'College'];
const mockRegions = ['ON', 'QC', 'BC', 'AB'];
const mockCompareData: FacilityCount[] = [
  { province: 'ON', count: 120 },
  { province: 'QC', count: 95 },
  { province: 'BC', count: 70 },
  { province: 'AB', count: 80 },
];

// Color palette for different facility types
const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function CompareFacilities() {
  const [facilityTypes, setFacilityTypes] = useState<string[]>(mockFacilityTypes);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [regions, setRegions] = useState<string[]>(mockRegions);
  const [selectedRegions, setSelectedRegions] = useState<string[]>([]);
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch distinct facility types
  useEffect(() => {
    fetch('/api/facilities')
      .then((res) => res.json())
      .then((data: FacilityRecord[]) => {
        const allTypes = Array.from(new Set(data.map((f) => f.type)));
        setFacilityTypes(allTypes);
      })
      .catch(() => {
        // fallback
        setFacilityTypes(mockFacilityTypes);
      });
  }, []);

  // Fetch regions list
  useEffect(() => {
    fetch('/api/regions')
      .then((res) => res.json())
      .then((data: string[]) => {
        if (Array.isArray(data)) setRegions(data);
      })
      .catch(() => {
        // fallback
        setRegions(mockRegions);
      });
  }, []);

  // Fetch and combine comparison data for multiple facility types
  const fetchData = useCallback(async () => {
    // If no facility types selected, show empty chart
    if (selectedTypes.length === 0) {
      setChartData([]);
      return;
    }

    setLoading(true);

    try {
      // Fetch data for each selected facility type
      const promises = selectedTypes.map(async (type) => {
        const typeParam = encodeURIComponent(type);
        const regionParam = selectedRegions.length > 0 ? `&provinces=${selectedRegions.join(',')}` : '';

        try {
          const res = await fetch(`/api/facilities/compare?type=${typeParam}${regionParam}`);
          if (!res.ok) throw new Error('API not available');
          const json: FacilityCount[] = await res.json();
          return { type, data: json };
        } catch {
          // Fallback to mock data when API is not available
          console.log(`Using mock data for ${type}`);
          let filteredMock = [...mockCompareData];
          if (selectedRegions.length > 0) {
            filteredMock = mockCompareData.filter((d) => selectedRegions.includes(d.province));
          }
          return { type, data: filteredMock };
        }
      });

      const results = await Promise.all(promises);

      // Combine data from all facility types into a single chart dataset
      const provincesMap = new Map<string, ChartDataPoint>();

      results.forEach(({ type, data }) => {
        data.forEach((item: FacilityCount) => {
          if (!provincesMap.has(item.province)) {
            provincesMap.set(item.province, { province: item.province });
          }
          const provinceData = provincesMap.get(item.province);
          if (provinceData) {
            provinceData[type] = item.count;
          }
        });
      });

      // Convert map to array and ensure it's always an array
      const combinedData = Array.from(provincesMap.values());
      console.log('Chart data:', combinedData);
      setChartData(combinedData);
    } catch (error) {
      console.error('Error fetching comparison data:', error);
      // Final fallback - use mock data for all selected types
      const provincesMap = new Map<string, ChartDataPoint>();
      selectedTypes.forEach((type) => {
        let filteredMock = [...mockCompareData];
        if (selectedRegions.length > 0) {
          filteredMock = mockCompareData.filter((d) => selectedRegions.includes(d.province));
        }
        filteredMock.forEach((item) => {
          if (!provincesMap.has(item.province)) {
            provincesMap.set(item.province, { province: item.province });
          }
          const provinceData = provincesMap.get(item.province);
          if (provinceData) {
            provinceData[type] = item.count;
          }
        });
      });
      setChartData(Array.from(provincesMap.values()));
    } finally {
      setLoading(false);
    }
  }, [selectedTypes, selectedRegions]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div style={{ padding: '20px', paddingTop: '60px', paddingLeft: '260px' }}>
      <h1 style={{ marginBottom: '20px', textAlign: 'center' }}>Compare Facility Types Across Provinces</h1>

      {/* Filters */}
      <div style={{ marginBottom: '20px' }}>
        <CompareRegionFilter regions={regions} selectedRegions={selectedRegions} onChange={setSelectedRegions} />
        <CompareFacilityTypeFilter types={facilityTypes} selectedTypes={selectedTypes} onChange={setSelectedTypes} />
      </div>

      {/* Instructions */}
      <div
        style={{
          marginTop: '280px',
          marginBottom: '20px',
          padding: '15px',
          background: '#f3f4f6',
          borderRadius: '8px',
          maxWidth: '800px',
        }}
      >
        <p>
          <strong>Instructions:</strong>
        </p>
        <ul style={{ marginBottom: 0 }}>
          <li>Select one or more facility types to compare</li>
          <li>Optionally filter by specific provinces (leave empty to show all)</li>
          <li>Each facility type will appear as a different colored bar</li>
        </ul>
      </div>

      {/* Loading indicator */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <p>Loading data...</p>
        </div>
      )}

      {/* Empty state */}
      {!loading && selectedTypes.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '16px' }}>
            Please select at least one facility type from the filter above to view the comparison chart.
          </p>
        </div>
      )}

      {/* Bar Chart */}
      {!loading && selectedTypes.length > 0 && chartData.length > 0 && (
        <div style={{ marginTop: '20px', width: '100%', height: '500px', maxWidth: '1000px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="province" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedTypes.map((type, index) => (
                <Bar key={type} dataKey={type} fill={COLORS[index % COLORS.length]} name={type} />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* No data state */}
      {!loading && selectedTypes.length > 0 && chartData.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', maxWidth: '600px', margin: '0 auto' }}>
          <p style={{ fontSize: '16px' }}>
            No data available for the selected filters. The backend API endpoint hasn't been created yet, so mock data
            will be used once you select a facility type.
          </p>
        </div>
      )}
    </div>
  );
}

// frontend/src/App.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import App from './App';

// ---- Test data ----
const mockFacilities = [
    {
        id: 1,
        name: 'Facility A',
        latitude: 43.0,
        longitude: -79.0,
        region: 'ON',
        type: 'a',
    },
    {
        id: 2,
        name: 'Facility B',
        latitude: 44.0,
        longitude: -80.0,
        region: 'QC',
        type: 'a',
    },
];

const mockRegions = ['Ontario', 'Quebec'];

// we'll capture the onChange passed into RegionFilter
let lastRegionOnChange: ((regions: string[]) => void) | null = null;

// ---- Mocks ----

// Mock RegionFilter so we can trigger onChange directly
jest.mock('./components/RegionFilter', () => {
    return (props: any) => {
        lastRegionOnChange = props.onChange;
        return <div data-testid="region-filter-mock">RegionFilterMock</div>;
    };
});

// Mock FacilityTypeFilter – we don't care about it in this test
jest.mock('./components/FacilityTypeFilter', () => {
    return () => <div data-testid="type-filter-mock">TypeFilterMock</div>;
});

// Mock react-leaflet so MapContainer / Marker / Popup don't use real Leaflet DOM stuff
jest.mock('react-leaflet', () => ({
    MapContainer: ({ children }: any) => (
        <div data-testid="map-container-mock">{children}</div>
    ),
    TileLayer: () => <div data-testid="tile-layer-mock" />,
    Marker: ({ children }: any) => (
        <div data-testid="marker-mock">{children}</div>
    ),
    Popup: ({ children }: any) => <div data-testid="popup-mock">{children}</div>,
}));

// Mock leaflet core used in App.tsx
jest.mock('leaflet', () => ({
    Icon: {
        Default: {
            prototype: {},
            mergeOptions: jest.fn(),
        },
    },
    divIcon: jest.fn(() => ({})),
    point: jest.fn(),
}));

// leaflet.markercluster is imported for side effects only – just stub it
jest.mock('leaflet.markercluster', () => ({}), { virtual: true });

beforeEach(() => {
    lastRegionOnChange = null;

    (global as any).fetch = jest.fn((url: string) => {
        if (url === '/api/facilities') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockFacilities),
            } as Response);
        }
        if (url === '/api/regions') {
            return Promise.resolve({
                ok: true,
                json: () => Promise.resolve(mockRegions),
            } as Response);
        }
        return Promise.reject(new Error(`Unexpected url: ${url}`));
    });
});

afterEach(() => {
    jest.clearAllMocks();
});

// - Tests 

test('renders facilities on the map and wires RegionFilter', async () => {
    render(<App />);

    // RegionFilter mock should appear
    expect(await screen.findByTestId('region-filter-mock')).toBeInTheDocument();

    // facilities should be fetched and markers rendered
    const markers = await screen.findAllByTestId('marker-mock');
    expect(markers).toHaveLength(2);

    // App should have called both backend endpoints
    expect((global as any).fetch).toHaveBeenCalledWith('/api/facilities');
    expect((global as any).fetch).toHaveBeenCalledWith('/api/regions');

    // RegionFilter should have received an onChange function
    expect(lastRegionOnChange).toBeInstanceOf(Function);
});

test('filters facilities when regions are selected', async () => {
    render(<App />);

    // wait for initial markers
    await screen.findAllByTestId('marker-mock');
    expect(screen.getAllByTestId('marker-mock')).toHaveLength(2);

    // simulate user selecting only "Ontario" via RegionFilter
    if (!lastRegionOnChange) {
        throw new Error('RegionFilter onChange was not captured');
    }
    lastRegionOnChange(['ON']);

    // wait for React state update and re-render
    await waitFor(() => {
        const markers = screen.getAllByTestId('marker-mock');
        expect(markers).toHaveLength(1);
    });

    expect(screen.getByText(/Facility A/)).toBeInTheDocument();
});

import React from 'react';
import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';
import App from './App';

// test data
const baseFacilities = [
  {
    id: 1,
    name: 'Facility A',
    latitude: 43.0,
    longitude: -79.0,
    region: 'ON',
    type: 'Clinic', // usually we only expect elementary, secondary, postsecondary etc but doesn't matter for test
  },
  {
    id: 2,
    name: 'Facility B',
    latitude: 44.0,
    longitude: -80.0,
    region: 'QC',
    type: 'Hospital', // usually we only expect elementary, secondary, postsecondary etc but doesn't matter for test
  },
];

const mockRegions = ['Ontario', 'Quebec'];

// we'll capture the onChange passed into RegionFilter & FacilityTypeFilter
let lastRegionOnChange: ((regions: string[]) => void) | null = null;
let lastTypeOnChange: ((types: string[]) => void) | null = null;

// we'll also capture what props the filters receive (for coverage)
let lastRegionsProp: string[] | null = null;
let lastTypesProp: string[] | null = null;

// ---- Mocks ----

// Mock RegionFilter
jest.mock('./components/RegionFilter', () => {
  const RegionFilterMock = (props: any) => {
    lastRegionOnChange = props.onChange;
    lastRegionsProp = props.regions;
    return <div data-testid="region-filter-mock">RegionFilterMock</div>;
  };
  RegionFilterMock.displayName = 'RegionFilterMock';
  return RegionFilterMock;
});

// Mock FacilityTypeFilter
jest.mock('./components/FacilityTypeFilter', () => {
  const FacilityTypeFilterMock = (props: any) => {
    lastTypeOnChange = props.onChange;
    lastTypesProp = props.types;
    return <div data-testid="type-filter-mock">FacilityTypeFilterMock</div>;
  };
  FacilityTypeFilterMock.displayName = 'FacilityTypeFilterMock';
  return FacilityTypeFilterMock;
});

// Mock CompareFacilities
jest.mock('./CompareFacilities', () => {
  const CompareFacilitiesMock = () => <div data-testid="compare-facilities-mock">CompareFacilitiesMock</div>;
  CompareFacilitiesMock.displayName = 'CompareFacilitiesMock';
  return CompareFacilitiesMock;
});

// Mock react-leaflet pieces
jest.mock('react-leaflet', () => ({
  MapContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="map-container-mock">{children}</div>
  ),
  TileLayer: () => <div data-testid="tile-layer-mock" />,
  Marker: ({ children }: { children?: React.ReactNode }) => <div data-testid="marker-mock">{children}</div>,
  Popup: ({ children }: { children?: React.ReactNode }) => <div data-testid="popup-mock">{children}</div>,
}));

// Mock leaflet
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

// Mock markercluster typings/module
jest.mock('leaflet.markercluster', () => ({}), { virtual: true });

jest.mock('react-leaflet-cluster', () => ({
  __esModule: true,
  default: ({ children }: { children?: React.ReactNode }) => <div data-testid="cluster-group-mock">{children}</div>,
}));

// ---- fetch mocking ----

beforeEach(() => {
  lastRegionOnChange = null;
  lastTypeOnChange = null;
  lastRegionsProp = null;
  lastTypesProp = null;

  (global as any).fetch = jest.fn((url: string) => {
    if (url === '/api/facilities') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(baseFacilities),
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

// tests

test('renders facilities on the map and wires filters', async () => {
  render(<App />);

  expect(await screen.findByTestId('region-filter-mock')).toBeInTheDocument();
  expect(await screen.findByTestId('type-filter-mock')).toBeInTheDocument();

  const markers = await screen.findAllByTestId('marker-mock');
  expect(markers).toHaveLength(2);

  expect((global as any).fetch).toHaveBeenCalledWith('/api/facilities');
  expect((global as any).fetch).toHaveBeenCalledWith('/api/regions');

  expect(lastRegionOnChange).toBeInstanceOf(Function);
  expect(lastTypeOnChange).toBeInstanceOf(Function);

  await waitFor(() => {
    expect(lastTypesProp).toEqual(expect.arrayContaining(['Clinic', 'Hospital']));
  });
});

test('filters facilities when regions are selected', async () => {
  render(<App />);

  await screen.findAllByTestId('marker-mock');
  expect(screen.getAllByTestId('marker-mock')).toHaveLength(2);

  if (!lastRegionOnChange) {
    throw new Error('RegionFilter onChange was not captured');
  }

  act(() => {
    lastRegionOnChange!(['ON']); // Simulate user selecting only "ON"
  });

  await waitFor(() => {
    const markers = screen.getAllByTestId('marker-mock');
    expect(markers).toHaveLength(1);
  });

  expect(screen.getByText(/Facility A/)).toBeInTheDocument();
});

test('filters facilities when types are selected', async () => {
  render(<App />);

  await screen.findAllByTestId('marker-mock');
  expect(screen.getAllByTestId('marker-mock')).toHaveLength(2);

  if (!lastTypeOnChange) {
    throw new Error('FacilityTypeFilter onChange was not captured');
  }

  // Only select "Hospital" type
  act(() => {
    lastTypeOnChange!(['Hospital']);
  });

  await waitFor(() => {
    const markers = screen.getAllByTestId('marker-mock');
    expect(markers).toHaveLength(1);
  });

  expect(screen.getByText(/Facility B/)).toBeInTheDocument();
});

test('falls back to default regions when /api/regions returns non-array', async () => {
  (global as any).fetch = jest.fn((url: string) => {
    if (url === '/api/facilities') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(baseFacilities),
      } as Response);
    }
    if (url === '/api/regions') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ not: 'an array' }), // triggers fallback branch
      } as Response);
    }
    return Promise.reject(new Error(`Unexpected url: ${url}`));
  });

  render(<App />);

  await screen.findByTestId('region-filter-mock');

  await waitFor(() => {
    expect(lastRegionsProp).toEqual(['Ontario', 'Quebec', 'Alberta', 'British Columbia']);
  });
});

test('can switch to compare view and render CompareFacilities', async () => {
  render(<App />);

  // test map view
  await screen.findByTestId('map-container-mock');

  expect(screen.queryByTestId('compare-facilities-mock')).not.toBeInTheDocument();

  const compareButton = screen.getByText(/Compare Facilities/i);

  fireEvent.click(compareButton);

  expect(await screen.findByTestId('compare-facilities-mock')).toBeInTheDocument();
});

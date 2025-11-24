// frontend/src/CompareFacilities.test.tsx
import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import CompareFacilities from './CompareFacilities';

let lastTypeOnChange: ((types: string[]) => void) | null = null;

// mocks

// mock region filter
jest.mock('./components/CompareRegionFilter', () => {
  const Mock = () => <div data-testid="compare-region-filter-mock">CompareRegionFilterMock</div>;
  Mock.displayName = 'CompareRegionFilterMock';
  return Mock;
});

jest.mock('./components/CompareFacilityTypeFilter', () => {
  const Mock = (props: { onChange: (types: string[]) => void }) => {
    lastTypeOnChange = props.onChange;
    return <div data-testid="compare-type-filter-mock">CompareFacilityTypeFilterMock</div>;
  };
  Mock.displayName = 'CompareFacilityTypeFilterMock';
  return Mock;
});

// recharts
jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children?: React.ReactNode }) => (
    <div data-testid="recharts-container-mock">{children}</div>
  ),
  BarChart: ({ children }: { children?: React.ReactNode }) => <div data-testid="barchart-mock">{children}</div>,
  CartesianGrid: () => <div />,
  XAxis: () => <div />,
  YAxis: () => <div />,
  Tooltip: () => <div />,
  Legend: () => <div />,
  Bar: () => <div />,
}));

beforeEach(() => {
  lastTypeOnChange = null;

  (global as any).fetch = jest.fn((url: string) => {
    if (url === '/api/facilities') {
      // used to derive facilityTypes
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { type: 'Clinic', province: 'ON' },
            { type: 'Hospital', province: 'QC' },
          ]),
      } as Response);
    }

    if (url === '/api/regions') {
      // used to set regions
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(['Ontario', 'Quebec']),
      } as Response);
    }

    if (url.startsWith('/api/facilities/compare')) {
      // this is used once we select a type
      return Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve([
            { region: 'ON', count: 5 },
            { region: 'QC', count: 3 },
          ]),
      } as Response);
    }

    return Promise.reject(new Error(`Unexpected URL: ${url}`));
  });
});

afterEach(() => {
  jest.clearAllMocks();
});

test('renders instructions, filters, and hits facilities/regions APIs', async () => {
  render(<CompareFacilities />);

  // check instructions
  expect(screen.getByText(/Select one or more facility types to compare/i)).toBeInTheDocument();

  // if no selected
  expect(screen.getByText(/Please select at least one facility type from the filter above/i)).toBeInTheDocument();

  // Filters render
  expect(await screen.findByTestId('compare-region-filter-mock')).toBeInTheDocument();
  expect(await screen.findByTestId('compare-type-filter-mock')).toBeInTheDocument();

  // useEffect hooks hit both endpoints
  await waitFor(() => {
    expect((global as any).fetch).toHaveBeenCalledWith('/api/facilities');
    expect((global as any).fetch).toHaveBeenCalledWith('/api/regions');
  });
});

test('fetches comparison data and renders chart when a type is selected', async () => {
  render(<CompareFacilities />);

  // Wait for filters to render and fetch to complete
  await screen.findByTestId('compare-type-filter-mock');

  if (!lastTypeOnChange) {
    throw new Error('CompareFacilityTypeFilter onChange not captured');
  }

  lastTypeOnChange(['Clinic']);

  await waitFor(() => {
    expect((global as any).fetch).toHaveBeenCalledWith('/api/facilities/compare?type=Clinic');
  });

  // barchart should render here
  expect(await screen.findByTestId('barchart-mock')).toBeInTheDocument();
});

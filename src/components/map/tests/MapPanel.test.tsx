import { describe, it, beforeEach } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import type { Vehicle } from "../../../stores/fleetStore";

// Mock theme as a jest.fn so tests can switch between "dark" and "light"
const useThemeMock = jest.fn(() => ({ theme: "dark" as "dark" | "light" }));
jest.mock("../../../contexts/ThemeContext", () => ({
  useTheme: useThemeMock,
}));

// Lightweight react-leaflet stand-ins so we can assert props without a real map
jest.mock("react-leaflet", () => {
  return {
    MapContainer: ({ children, ...rest }: any) => (
      <div data-testid="map" {...rest}>
        {children}
      </div>
    ),
    TileLayer: (props: any) => <div data-testid="tile" data-url={props.url} />,
    Marker: ({ children }: any) => <div data-testid="marker">{children}</div>,
    Tooltip: ({ children }: any) => <span>{children}</span>,
  };
});

// Stub Leaflet API used to create custom icons
jest.mock("leaflet", () => ({
  __esModule: true,
  default: {
    divIcon: jest.fn(() => ({})),
  },
}));

import MapPanel from "../MapPanel";

describe("<MapPanel />", () => {
  const vehicles: Vehicle[] = [
    {
      id: "EV-1",
      name: "V1",
      speed: 0,
      battery: 90,
      temperature: 20,
      tireFL: 32,
      tireFR: 32,
      tireRL: 32,
      tireRR: 32,
      motorEfficiency: 90,
      regenActive: true,
      status: "idle",
      distance: 0,
      lat: 50.9,
      lng: 6.9,
    },
    {
      id: "EV-2",
      name: "V2",
      speed: 0,
      battery: 50,
      temperature: 20,
      tireFL: 32,
      tireFR: 32,
      tireRL: 32,
      tireRR: 32,
      motorEfficiency: 90,
      regenActive: true,
      status: "idle",
      distance: 0,
      lat: 50.8,
      lng: 6.8,
    },
  ];

  beforeEach(() => {
    cleanup();
    useThemeMock.mockReset().mockReturnValue({ theme: "dark" });
  });

  it("uses Stadia smooth-dark tiles in dark mode and renders one marker per vehicle", () => {
    render(<MapPanel vehicles={vehicles} focus={vehicles[0]} />);

    const tile = screen.getByTestId("tile");
    expect(tile).toHaveAttribute(
      "data-url",
      "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png"
    );

    const markers = screen.getAllByTestId("marker");
    expect(markers.length).toBe(vehicles.length);
  });

  it("uses a light theme tile URL when theme is light", () => {
    // Flip theme for this test
    useThemeMock.mockReturnValue({ theme: "light" as const });

    render(<MapPanel vehicles={vehicles} focus={vehicles[0]} />);

    const tile = screen.getByTestId("tile");
    expect(tile).toHaveAttribute(
      "data-url",
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
    );
  });
});

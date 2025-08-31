import { render, screen, fireEvent } from "@testing-library/react";

const expandMock = jest.fn();
const openMobileMock = jest.fn();
const toggleDemoOfflineMock = jest.fn();
const toggleThemeMock = jest.fn();
const ackAllMock = jest.fn();
const ackAlertMock = jest.fn();

jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (_k: string, o?: any) => o?.defaultValue ?? _k }),
}));
 
// useTheme hook
jest.mock("../../../contexts/ThemeContext", () => ({
  useTheme: () => ({ theme: "light", toggleTheme: toggleThemeMock }),
}));

// useUI store: feed a snapshot to the selector
jest.mock("../../../stores/uiStore", () => ({
  useUI: (sel: any) =>
    sel({
      sidebarCollapsed: true,
      expand: expandMock,
      openMobile: openMobileMock,
      online: true,
      demoOffline: false,
      toggleDemoOffline: toggleDemoOfflineMock,
    }),
}));

// useFleet: alerts + handlers
jest.mock("../../../stores/fleetStore", () => ({
  useFleet: (sel: any) =>
    sel({
      alerts: [
        { id: "a1", vehicleId: "v1", type: "battery_low", severity: "warning", message: "Low battery", ts: 1700000000000 },
        { id: "a2", vehicleId: "v2", type: "speeding", severity: "info", message: "Speeding", ts: 1700000100000 },
      ],
      ackAll: ackAllMock,
      ackAlert: ackAlertMock,
    }),
}));

import HeaderBar from "../HeaderBar";

describe("<HeaderBar />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("opens alerts dropdown and acknowledges all", () => {
    render(<HeaderBar />);

    // Open dropdown
    fireEvent.click(screen.getByTitle(/alerts/i));
    expect(screen.getByText(/Unacknowledged/i)).toBeInTheDocument();
    expect(screen.getAllByText(/Acknowledge all/i).length).toBeGreaterThan(0);

    // Click "Acknowledge all"
    fireEvent.click(screen.getAllByText(/Acknowledge all/i)[0]);
    expect(ackAllMock).toHaveBeenCalledTimes(1);
  });

  it("toggles theme and offline demo", () => {
    render(<HeaderBar />);

    // Theme toggle
    fireEvent.click(screen.getByTitle(/Switch to dark mode/i));
    expect(toggleThemeMock).toHaveBeenCalledTimes(1);

    // Offline demo toggle
    fireEvent.click(screen.getByTitle(/Simulate offline/i));
    expect(toggleDemoOfflineMock).toHaveBeenCalledTimes(1);
  });

  it("shows both hamburger buttons in the right contexts", () => {
    render(<HeaderBar />);

    // Mobile hamburger is always rendered (hidden on lg via CSS, still in DOM)
    fireEvent.click(screen.getAllByLabelText(/Open sidebar/i)[0]);
    expect(openMobileMock).toHaveBeenCalledTimes(1);

    // Desktop hamburger appears when sidebarCollapsed=true
    fireEvent.click(screen.getAllByLabelText(/Open sidebar/i)[1]);
    expect(expandMock).toHaveBeenCalledTimes(1);
  });
});

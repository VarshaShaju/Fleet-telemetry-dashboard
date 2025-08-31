jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

// UI store: only what Sidebar uses (collapsed state + actions)
jest.mock("../../stores/uiStore", () => ({
  useUI: (sel: any) =>
    sel({
      sidebarCollapsed: false,
      collapse: jest.fn(),
      closeMobile: jest.fn(),
    }),
}));

// Fleet store: in-memory mutable state so selections re-render correctly
jest.mock("../../stores/fleetStore", () => {
  const state: any = {
    vehicles: [
      {
        id: "v1",
        name: "Vehicle 1",
        speed: 50,
        battery: 80,
        temperature: 22,
        tireFL: 36,
        tireFR: 36,
        tireRL: 34,
        tireRR: 34,
        motorEfficiency: 92,
        regenActive: true,
        status: "moving",
        distance: 123.4,
        lat: 40,
        lng: -74,
      },
      {
        id: "v2",
        name: "Vehicle 2",
        speed: 0,
        battery: 55,
        temperature: 21,
        tireFL: 36,
        tireFR: 36,
        tireRL: 34,
        tireRR: 34,
        motorEfficiency: 90,
        regenActive: false,
        status: "idle",
        distance: 200.1,
        lat: 41,
        lng: -73,
      },
    ],
    selectedVehicleId: "v1",
    search: "",
    filterStatus: "all",
    sortBy: null,
    setSearch: (q: string) => {
      state.search = q;
    },
    setFilterStatus: (s: any) => {
      state.filterStatus = s;
    },
    setSortBy: (s: any) => {
      state.sortBy = s;
    },
    selectVehicle: (id: string) => {
      state.selectedVehicleId = id;
    },
  };

  return {
    useFleet: (selector: any) => selector(state),
    selectFilteredSortedVehicles: (s: any) => s.vehicles,
  };
});

// Stub LanguageFlagDropdown so it doesn't run its own hooks/UI
jest.mock("../common/LanguageFlagDropdown", () => {
  const React = require("react");
  return {
    __esModule: true,
    default: () => React.createElement("div", { "data-testid": "flags" }),
  };
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Sidebar from "./Sidebar";

describe("<Sidebar />", () => {
  it("renders search, opens filter and sort, and shows ticks for current selections", async () => {
    render(<Sidebar variant="rail" />);

    // Search field exists
    expect(screen.getByPlaceholderText(/search/i)).toBeInTheDocument();

    // Open Filter menu
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Initially "allStatus" is selected
    expect(
      screen.getByRole("menuitemradio", { name: /allStatus/i })
    ).toHaveAttribute("aria-checked", "true");

    // Choose "moving" (menu closes)
    await userEvent.click(screen.getByRole("menuitemradio", { name: /moving/i }));
    expect(screen.queryByRole("menu")).toBeNull();

    // Reopen filter: "moving" should be selected now
    await userEvent.click(screen.getByRole("button", { name: /filter/i }));
    expect(
      screen.getByRole("menuitemradio", { name: /moving/i })
    ).toHaveAttribute("aria-checked", "true");

    // Open Sort menu
    await userEvent.click(screen.getByRole("button", { name: /sort/i }));
    expect(screen.getByRole("menu")).toBeInTheDocument();

    // Pick "metrics.battery" (menu closes)
    await userEvent.click(
      screen.getByRole("menuitemradio", { name: /metrics\.battery/i })
    );
    expect(screen.queryByRole("menu")).toBeNull();

    // Reopen sort: "metrics.battery" is selected
    await userEvent.click(screen.getByRole("button", { name: /sort/i }));
    expect(
      screen.getByRole("menuitemradio", { name: /metrics\.battery/i })
    ).toHaveAttribute("aria-checked", "true");
  });

  it("lists vehicles and allows selecting one", async () => {
    render(<Sidebar variant="rail" />);

    const v1 = screen.getByRole("button", { name: "Vehicle 1" });
    const v2 = screen.getByRole("button", { name: "Vehicle 2" });
    expect(v1).toBeInTheDocument();
    expect(v2).toBeInTheDocument();

    // Click should trigger the mocked selectVehicle and cause re-render with new selection
    await userEvent.click(v2);
  });
});

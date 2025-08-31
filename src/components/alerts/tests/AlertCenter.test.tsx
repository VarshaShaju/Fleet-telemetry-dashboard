import { describe, beforeEach, afterEach, it } from "@jest/globals";
import { render, screen, cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import AlertCenter from "../AlertCenter";
import { useFleet } from "../../../stores/fleetStore";

// i18n stub
jest.mock("react-i18next", () => ({ useTranslation: () => ({ t: (k: string) => k }) }));

describe("<AlertCenter />", () => {
  const initialState = useFleet.getState();

  beforeEach(() => {
    useFleet.setState({ alerts: [] });
    cleanup();
  });

  afterEach(() => {
    // restore other store fields if AlertCenter mutates more in the future
    useFleet.setState({ ...initialState, alerts: [] });
  });

  it("returns null when there are no alerts", () => {
    render(<AlertCenter />);
    expect(screen.queryByText("header.notifications")).toBeNull();
  });

  it("renders alerts and clears on 'Acknowledge all'", async () => {
    useFleet.setState({
      alerts: [
        { id: "a1", vehicleId: "EV-1", type: "speeding", severity: "warning", message: "A1", ts: 1 },
        { id: "a2", vehicleId: "EV-2", type: "battery_low", severity: "critical", message: "A2", ts: 2 },
      ],
    });

    render(<AlertCenter />);

    expect(screen.getByText("header.notifications")).toBeInTheDocument();
    expect(screen.getByText("A1")).toBeInTheDocument();
    expect(screen.getByText("A2")).toBeInTheDocument();

    await userEvent.click(screen.getByText("header.ackAll"));

    expect(screen.queryByText("header.notifications")).toBeNull();
  });
});

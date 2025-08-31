import { act } from "@testing-library/react";
import { useUI } from "../uiStore";

describe("uiStore", () => {
  const setNavigatorOnline = (value: boolean) => {
    Object.defineProperty(window.navigator, "onLine", {
      configurable: true,
      get: () => value,
    });
  };

  beforeEach(() => {
    // reset relevant fields without recreating the store
    act(() => {
      useUI.setState({
        mobileOpen: false,
        sidebarCollapsed: false,
        online: true,
        demoOffline: false,
        customizeMode: false,
      } as any);
    });
  });

  afterEach(() => {
    setNavigatorOnline(true);
  });

  it("opens/closes mobile drawer", () => {
    act(() => useUI.getState().openMobile());
    expect(useUI.getState().mobileOpen).toBe(true);

    act(() => useUI.getState().closeMobile());
    expect(useUI.getState().mobileOpen).toBe(false);
  });

  it("collapses/expands sidebar", () => {
    act(() => useUI.getState().collapse());
    expect(useUI.getState().sidebarCollapsed).toBe(true);

    act(() => useUI.getState().expand());
    expect(useUI.getState().sidebarCollapsed).toBe(false);
  });

  it("toggleCustomize flips customizeMode", () => {
    expect(useUI.getState().customizeMode).toBe(false);
    act(() => useUI.getState().toggleCustomize());
    expect(useUI.getState().customizeMode).toBe(true);
    act(() => useUI.getState().toggleCustomize());
    expect(useUI.getState().customizeMode).toBe(false);
  });

  it("demoOffline toggle flips effective online state", () => {
    // assume real network is online by default
    setNavigatorOnline(true);

    expect(useUI.getState().online).toBe(true);
    expect(useUI.getState().demoOffline).toBe(false);

    act(() => useUI.getState().toggleDemoOffline());
    expect(useUI.getState().demoOffline).toBe(true);
    // online should now reflect (navigator.onLine && !demoOffline) => false
    expect(useUI.getState().online).toBe(false);

    act(() => useUI.getState().toggleDemoOffline());
    expect(useUI.getState().demoOffline).toBe(false);
    expect(useUI.getState().online).toBe(true);
  });

  it("initNetworkWatch tracks browser online/offline events (with demoOffline=false)", () => {
    // Start with navigator online, attach listeners
    setNavigatorOnline(true);
    act(() => useUI.getState().initNetworkWatch());

    expect(useUI.getState().online).toBe(true);

    // Simulate browser going offline
    setNavigatorOnline(false);
    act(() => window.dispatchEvent(new Event("offline")));
    expect(useUI.getState().online).toBe(false);

    // Simulate browser coming back online
    setNavigatorOnline(true);
    act(() => window.dispatchEvent(new Event("online")));
    expect(useUI.getState().online).toBe(true);
  });

  it("initNetworkWatch respects demoOffline even when navigator is online", () => {
    // Browser says online, but demoOffline forces offline in the store
    setNavigatorOnline(true);
    act(() => useUI.getState().initNetworkWatch());
    act(() => useUI.getState().toggleDemoOffline());

    expect(useUI.getState().demoOffline).toBe(true);
    expect(useUI.getState().online).toBe(false);

    // Even if the browser fires an 'online' event, online stays false while demoOffline=true
    act(() => window.dispatchEvent(new Event("online")));
    expect(useUI.getState().online).toBe(false);

    // Turn demoOffline off → online should reflect navigator.onLine again
    act(() => useUI.getState().toggleDemoOffline());
    expect(useUI.getState().online).toBe(true);
  });
});

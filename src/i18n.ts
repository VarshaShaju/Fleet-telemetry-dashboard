import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const resources = {
  en: {
    common: {
      header: {
        title: "EV Fleet Dashboard",
        alerts: "Alerts",
        unack: "Unacknowledged",
        ackAll: "Acknowledge all",
        noAlerts: "No alerts",
        markRead: "Mark as read",
        themeLight: "Switch to light mode",
        themeDark: "Switch to dark mode",
        language: "Language",
        notifications: "Notifications"
      },
      overview: {
        title: "Overview",
        vehicles: "Vehicles",
        totalInFleet: "Total in fleet",
        avgBattery: "Average Battery",
        moving: "Vehicles Moving"
      },
      status: {
        active: "Active",
        inactive: "Inactive",
        shop: "In Shop",
        out: "Out of Service",
      },
      vehicle: {
        map: "Map",
        effTrend: "Efficiency Trend",
        effUnit: "kWh / 100 km (monthly)",
        expandMap: "Expand map",
        collapseMap: "Collapse map"
      },
      metrics: {
        speed: "Speed",
        battery: "Battery",
        temperature: "Temperature",
        tireFL: "Tire FL",
        tireFR: "Tire FR",
        tireRL: "Tire RL",
        tireRR: "Tire RR",
        motorEfficiency: "Motor Efficiency",
        regenerative: "Regenerative",
        status: "Status",
        distance: "Distance",
        location: "Location"
      },
      offline: {
        banner: "Offline mode: telemetry paused. Showing last known data."
      },
      search: "Search",
      filter: "Filter",
      sort: "Sort",
      allStatus: "All Status",
      none: "None",
      moving: "moving",
      charging: "charging",
      idle: "idle",
      enabled: "Enabled",
      disabled: "Disabled",
      severity: { critical: "critical", warning: "warning", info: "info" }
    }
  },
  de: {
    common: {
      header: {
        title: "EV-Flotten-Dashboard",
        alerts: "Warnungen",
        unack: "Ungelesen",
        ackAll: "Alle bestätigen",
        noAlerts: "Keine Meldungen",
        markRead: "Als gelesen markieren",
        themeLight: "Zum hellen Modus wechseln",
        themeDark: "Zum dunklen Modus wechseln",
        language: "Sprache",
        notifications: "Benachrichtigungen"
      },
      overview: {
        title: "Übersicht",
        vehicles: "Fahrzeuge",
        totalInFleet: "Gesamt in der Flotte",
        avgBattery: "Durchschn. Akkustand",
        moving: "Fahrzeuge in Bewegung"
      },
      status: {
        active: "Aktiv",
        inactive: "Inaktiv",
        shop: "In der Werkstatt",
        out: "Außer Betrieb",
      },
      vehicle: {
        map: "Karte",
        effTrend: "Effizienztrend",
        effUnit: "kWh / 100 km (monatlich)",
        expandMap: "Karte vergrößern",
        collapseMap: "Karte verkleinern"
      },
      metrics: {
        speed: "Geschwindigkeit",
        battery: "Akku",
        temperature: "Temperatur",
        tireFL: "Reifen vorn links",
        tireFR: "Reifen vorn rechts",
        tireRL: "Reifen hinten links",
        tireRR: "Reifen hinten rechts",
        motorEfficiency: "Motoreffizienz",
        regenerative: "Rekuperation",
        status: "Status",
        distance: "Strecke",
        location: "Standort"
      },
      offline: {
        banner: "Offline-Modus: Telemetrie pausiert. Zeigt die zuletzt bekannten Daten an."
      },
      search: "Suchen",
      filter: "Filter",
      sort: "Sortieren",
      allStatus: "Alle Status",
      none: "Keine",
      moving: "fahrend",
      charging: "Laden",
      idle: "Leerlauf",
      enabled: "Aktiviert",
      disabled: "Deaktiviert",
      severity: { critical: "kritisch", warning: "Warnung", info: "Info" }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: (localStorage.getItem("lang") as "en" | "de") || "en",
    fallbackLng: "en",
    ns: ["common"],
    defaultNS: "common",
    interpolation: { escapeValue: false }
  });

export default i18n;

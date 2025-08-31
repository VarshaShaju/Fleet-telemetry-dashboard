import { useMemo, useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "../../stores/fleetStore";
import { useTheme } from "../../contexts/ThemeContext";

const LIGHT_TILES = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Read key (works in Vercel and local if you add .env/.env.local)
const STADIA_KEY = import.meta.env.VITE_STADIA_API_KEY as string | undefined;

// Helpers to build Stadia URLs with/without key
const stadia = (path: string) => {
  const base = `https://tiles.stadiamaps.com/tiles/${path}/{z}/{x}/{y}{r}.png`;
  return STADIA_KEY ? `${base}?api_key=${STADIA_KEY}` : base;
};

// Dark base (true dark) + optional terrain tint overlay
const DARK_BASE = {
  url: stadia("alidade_smooth_dark"),
  attribution:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
    '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// Subtle green land tint; few labels. We’ll render this on top at low opacity.
const DARK_TERRAIN_OVERLAY = {
  url: stadia("terrain-background"),
  attribution:
    '&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, ' +
    '&copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>, ' +
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
};

// No-key dark fallback
const CARTO_DARK = {
  url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
    '&copy; <a href="https://carto.com/attributions">CARTO</a>',
};

const carSVG = (color: string) =>
  `<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
     <g transform="translate(0,0)">
       <path d="M3 13l1.6-4.2A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v4h-2a2 2 0 0 1-2-2H7a2 2 0 0 1-2 2H3v-4Z"
             fill="${color}" stroke="white" stroke-width="1.1" stroke-linejoin="round"/>
       <rect x="7.1" y="8.4" width="4.8" height="2.3" rx="0.4" fill="white" opacity="0.95"/>
       <rect x="12.3" y="8.4" width="4.0" height="2.3" rx="0.4" fill="white" opacity="0.95"/>
       <circle cx="7.5"  cy="17.5" r="1.6" fill="#111" stroke="white" stroke-width="0.7"/>
       <circle cx="16.5" cy="17.5" r="1.6" fill="#111" stroke="white" stroke-width="0.7"/>
     </g>
   </svg>`;

function carIcon(color: string) {
  return L.divIcon({
    html: carSVG(color),
    className: "ev-car-icon",
    iconSize: [28, 28],
    iconAnchor: [14, 14],
    tooltipAnchor: [0, -16],
  });
}

export default function MapPanel({
  vehicles,
  focus,
}: {
  vehicles: Vehicle[];
  focus: Vehicle;
}) {
  const center = useMemo(
    () => [focus.lat, focus.lng] as [number, number],
    [focus.lat, focus.lng]
  );
  const { theme } = useTheme();

  // If Stadia dark base errors (e.g., 401 in prod w/out key), swap to Carto.
  const [darkFallback, setDarkFallback] = useState(false);

  // Reset when theme toggles so we can retry Stadia
  useEffect(() => setDarkFallback(false), [theme]);

  const isDark = theme === "dark";

  return (
    <MapContainer center={center} zoom={13} style={{ height: 320, width: "100%" }}>
      {/* Base layer */}
      <TileLayer
        key={isDark ? (darkFallback ? "dark-carto" : "dark-stadia") : "light"}
        attribution={(isDark ? (darkFallback ? CARTO_DARK : DARK_BASE) : LIGHT_TILES).attribution}
        url={(isDark ? (darkFallback ? CARTO_DARK : DARK_BASE) : LIGHT_TILES).url}
        eventHandlers={{
          // If Stadia dark base fails, fall back to Carto Dark
          tileerror: () => {
            if (isDark && !darkFallback) setDarkFallback(true);
          },
        }}
      />

      {/* Optional overlay to add green tint — only when using Stadia dark base */}
      {isDark && !darkFallback && (
        <TileLayer
          key="dark-stadia-terrain-overlay"
          url={DARK_TERRAIN_OVERLAY.url}
          attribution={DARK_TERRAIN_OVERLAY.attribution}
          opacity={0.28}        // adjust tint strength here (0..1)
          zIndex={2}
        />
      )}

      {/* Markers */}
      {vehicles.map((v) => (
        <Marker
          key={v.id}
          position={[v.lat, v.lng]}
          icon={carIcon(v.id === focus.id ? "#ef4444" : "#3b82f6")}
        >
          <Tooltip>{v.name}</Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );
}

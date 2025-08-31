import { useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import type { Vehicle } from "../../stores/fleetStore";
import { useTheme } from "../../contexts/ThemeContext";

const LIGHT_TILES = {
  url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  attribution: "&copy; OpenStreetMap contributors",
};
const DARK_TILES = {
  url: "https://tiles.stadiamaps.com/tiles/alidade_smooth_dark/{z}/{x}/{y}{r}.png",
  attribution:
    '&copy; OpenStreetMap contributors, &copy; <a href="https://stadiamaps.com/">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/">OpenMapTiles</a>',
};

const carSVG = (color: string) =>
  `<svg width="28" height="28" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
     <g transform="translate(0,0)">
       <!-- car body -->
       <path d="M3 13l1.6-4.2A2 2 0 0 1 6.5 7h11a2 2 0 0 1 1.9 1.2L21 13v4h-2a2 2 0 0 1-2-2H7a2 2 0 0 1-2 2H3v-4Z"
             fill="${color}" stroke="white" stroke-width="1.1" stroke-linejoin="round"/>
       <!-- windows -->
       <rect x="7.1" y="8.4" width="4.8" height="2.3" rx="0.4" fill="white" opacity="0.95"/>
       <rect x="12.3" y="8.4" width="4.0" height="2.3" rx="0.4" fill="white" opacity="0.95"/>
       <!-- wheels -->
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

/* Renders a Leaflet map with one marker per vehicle and themed tiles. */
export default function MapPanel({ vehicles, focus }: { vehicles: Vehicle[]; focus: Vehicle }) {
  const center = useMemo(() => [focus.lat, focus.lng] as [number, number], [focus.lat, focus.lng]);
  const { theme } = useTheme();
  const tiles = theme === "dark" ? DARK_TILES : LIGHT_TILES;

  return (
    <MapContainer center={center} zoom={13} style={{ height: 320, width: "100%" }}>
      <TileLayer key={theme} attribution={tiles.attribution} url={tiles.url} />
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

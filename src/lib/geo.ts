export interface LatLng {
  lat: number;
  lng: number;
}

export function getAntipodal(lat: number, lng: number): LatLng {
  const antiLng = lng > 0 ? lng - 180 : lng + 180;
  return { lat: -lat, lng: antiLng };
}

export function validateLatLng(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

export function formatCoordinate(value: number, type: "lat" | "lng"): string {
  const abs = Math.abs(value).toFixed(4);
  if (type === "lat") return `${abs}° ${value >= 0 ? "N" : "S"}`;
  return `${abs}° ${value >= 0 ? "E" : "W"}`;
}

// Three.js SphereGeometry UV mapping:
//   lng 0° (Prime Meridian) → +X axis
//   lng 90°E → -Z axis
//   lat 90°N (North Pole) → +Y axis
export function latLngToCartesian(
  lat: number,
  lng: number,
  radius: number = 1
): [number, number, number] {
  const latRad = (lat * Math.PI) / 180;
  const lngRad = (lng * Math.PI) / 180;
  const x = radius * Math.cos(latRad) * Math.cos(lngRad);
  const y = radius * Math.sin(latRad);
  const z = -radius * Math.cos(latRad) * Math.sin(lngRad);
  return [x, y, z];
}

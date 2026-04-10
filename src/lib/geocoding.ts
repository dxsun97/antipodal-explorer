export interface PlaceInfo {
  placeName: string;
  country: string;
  loading: boolean;
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal
): Promise<{ placeName: string; country: string }> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&zoom=10&accept-language=en`;
  const res = await fetch(url, {
    headers: { "User-Agent": "AntipodalExplorer/1.0" },
    signal,
  });

  if (!res.ok) {
    return { placeName: "Unknown", country: "" };
  }

  const data = await res.json();

  if (data.error) {
    return { placeName: "Open Ocean", country: "" };
  }

  const placeName =
    data.address?.city ||
    data.address?.town ||
    data.address?.village ||
    data.address?.state ||
    data.name ||
    "Unknown";
  const country = data.address?.country || "";
  return { placeName, country };
}

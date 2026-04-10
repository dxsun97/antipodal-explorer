import { useState, useEffect } from "react";
import { reverseGeocode } from "../lib/geocoding";

interface GeoResult {
  placeName: string;
  country: string;
  loading: boolean;
}

export function useReverseGeocode(
  lat: number | null,
  lng: number | null
): GeoResult {
  const hasCoords = lat !== null && lng !== null;

  const [result, setResult] = useState<GeoResult>({
    placeName: "",
    country: "",
    loading: false,
  });

  useEffect(() => {
    if (!hasCoords) return;

    const controller = new AbortController();
    const timeout = setTimeout(() => {
      setResult((r) => ({ ...r, loading: true }));

      reverseGeocode(lat, lng, controller.signal)
        .then(({ placeName, country }) => {
          if (!controller.signal.aborted) {
            setResult({ placeName, country, loading: false });
          }
        })
        .catch(() => {
          if (!controller.signal.aborted) {
            setResult({ placeName: "Unknown", country: "", loading: false });
          }
        });
    }, 300);

    return () => {
      clearTimeout(timeout);
      controller.abort();
    };
  }, [lat, lng, hasCoords]);

  return result;
}

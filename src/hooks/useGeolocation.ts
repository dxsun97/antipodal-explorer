import { useState, useCallback, useRef, useEffect } from "react";

interface GeolocationState {
  error: string | null;
  loading: boolean;
  source: "gps" | "ip" | null;
}

type LocationCallback = (location: { lat: number; lng: number }) => void;

async function ipFallback(): Promise<{ lat: number; lng: number }> {
  const services = [
    async () => {
      const res = await fetch("https://api.ipbase.com/v1/json/");
      const data = await res.json();
      return { lat: data.latitude, lng: data.longitude };
    },
    async () => {
      const res = await fetch("https://freeipapi.com/api/json");
      const data = await res.json();
      return { lat: data.latitude, lng: data.longitude };
    },
  ];

  for (const service of services) {
    try {
      const loc = await service();
      if (loc.lat != null && loc.lng != null) return loc;
    } catch {
      continue;
    }
  }
  throw new Error("All IP geolocation services failed");
}

export function useGeolocation(onDetected?: LocationCallback) {
  const [state, setState] = useState<GeolocationState>({
    error: null,
    loading: false,
    source: null,
  });
  const callbackRef = useRef(onDetected);
  useEffect(() => {
    callbackRef.current = onDetected;
  });

  const resolve = useCallback((location: { lat: number; lng: number }) => {
    callbackRef.current?.(location);
  }, []);

  const requestLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setState((s) => ({ ...s, loading: true, error: null }));
      ipFallback()
        .then((location) => {
          setState({ error: "Approximate location via IP", loading: false, source: "ip" });
          resolve(location);
        })
        .catch(() =>
          setState((s) => ({ ...s, error: "Could not determine location", loading: false }))
        );
      return;
    }

    setState((s) => ({ ...s, loading: true, error: null }));

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const location = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setState({ error: null, loading: false, source: "gps" });
        resolve(location);
      },
      (err) => {
        let hint = "";
        if (err.code === err.PERMISSION_DENIED) {
          hint = "Allow location access in your browser/OS settings. ";
        } else if (err.code === err.POSITION_UNAVAILABLE) {
          hint = "Enable Location Services in your OS settings for this browser. ";
        }

        // Fall back to IP geolocation
        ipFallback()
          .then((location) => {
            setState({ error: hint + "Using approximate IP location.", loading: false, source: "ip" });
            resolve(location);
          })
          .catch(() =>
            setState((s) => ({
              ...s,
              error: hint + "Could not determine location.",
              loading: false,
            }))
          );
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
    );
  }, [resolve]);

  return { ...state, requestLocation };
}

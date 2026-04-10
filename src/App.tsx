import { useState, useMemo, useEffect, useCallback } from "react";
import { EarthGlobe } from "./components/globe/EarthGlobe";
import { ControlPanel } from "./components/panels/ControlPanel";
import { getAntipodal } from "./lib/geo";
import { useGeolocation } from "./hooks/useGeolocation";
import { useReverseGeocode } from "./hooks/useReverseGeocode";
import type { LatLng } from "./lib/geo";

export default function App() {
  const [location, setLocation] = useState<LatLng | null>(null);
  const [focusTarget, setFocusTarget] = useState<LatLng | null>(null);

  const handleLocationChange = useCallback((lat: number, lng: number) => {
    const loc = { lat, lng };
    setLocation(loc);
    setFocusTarget(loc);
  }, []);

  const { requestLocation, ...geoState } = useGeolocation(({ lat, lng }) =>
    handleLocationChange(lat, lng)
  );

  const antipodal = useMemo(
    () => (location ? getAntipodal(location.lat, location.lng) : null),
    [location]
  );

  const currentGeo = useReverseGeocode(
    location?.lat ?? null,
    location?.lng ?? null
  );
  const antipodalGeo = useReverseGeocode(
    antipodal?.lat ?? null,
    antipodal?.lng ?? null
  );

  // Auto-detect location on mount
  useEffect(() => {
    requestLocation();
  }, [requestLocation]);

  const handleLocate = useCallback((target: LatLng) => {
    setFocusTarget({ ...target });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-black">
      <EarthGlobe
        currentLocation={location}
        antipodalLocation={antipodal}
        focusTarget={focusTarget}
      />

      {/* Title - top left */}
      <div className="pointer-events-none absolute left-4 top-4 z-10 md:left-6 md:top-6">
        <div className="animate-fade-up">
          <h1 className="font-sans text-lg font-light tracking-wide text-white/80 md:text-xl">
            Antipodal
            <span className="ml-1.5 font-medium text-white">Explorer</span>
          </h1>
          <p className="mt-0.5 text-[10px] tracking-[0.2em] text-white/30 uppercase">
            The other side of the world
          </p>
        </div>
      </div>

      <ControlPanel
        location={location}
        antipodal={antipodal}
        onLocationChange={handleLocationChange}
        onDetectLocation={requestLocation}
        onLocate={handleLocate}
        geoLoading={geoState.loading}
        geoError={geoState.error}
        currentPlaceInfo={currentGeo}
        antipodalPlaceInfo={antipodalGeo}
      />
    </div>
  );
}

import { useState, useRef, useCallback } from 'react';
import { ChevronUp } from 'lucide-react';
import { LocationInput } from './LocationInput';
import { LocationCard } from './LocationCard';
import type { LatLng } from '../../lib/geo';

interface PlaceInfo {
  placeName: string;
  country: string;
  loading: boolean;
}

interface ControlPanelProps {
  location: LatLng | null;
  antipodal: LatLng | null;
  onLocationChange: (lat: number, lng: number) => void;
  onDetectLocation: () => void;
  onLocate: (target: LatLng) => void;
  geoLoading: boolean;
  geoError: string | null;
  currentPlaceInfo: PlaceInfo;
  antipodalPlaceInfo: PlaceInfo;
}

export function ControlPanel({
  location,
  antipodal,
  onLocationChange,
  onDetectLocation,
  onLocate,
  geoLoading,
  geoError,
  currentPlaceInfo,
  antipodalPlaceInfo
}: ControlPanelProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartY = useRef(0);
  const sheetRef = useRef<HTMLDivElement>(null);

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    const dy = touchStartY.current - e.changedTouches[0].clientY;
    if (dy > 40) setMobileOpen(true);
    else if (dy < -40) setMobileOpen(false);
  }, []);

  return (
    <>
      {/* Desktop: side panel */}
      <div className="pointer-events-none absolute inset-0 z-10 hidden md:flex items-start justify-end p-6">
        <div
          className="pointer-events-auto flex w-80 flex-col gap-2.5 animate-fade-up"
          style={{ animationDelay: '0.15s' }}>
          <LocationInput
            onLocationChange={onLocationChange}
            onDetectLocation={onDetectLocation}
            geoLoading={geoLoading}
            geoError={geoError}
          />

          {location && (
            <div
              className="animate-fade-up"
              style={{ animationDelay: '0.25s' }}>
              <LocationCard
                type="current"
                lat={location.lat}
                lng={location.lng}
                onLocate={() => onLocate(location)}
                {...currentPlaceInfo}
              />
            </div>
          )}

          {antipodal && (
            <div
              className="animate-fade-up"
              style={{ animationDelay: '0.35s' }}>
              <LocationCard
                type="antipodal"
                lat={antipodal.lat}
                lng={antipodal.lng}
                onLocate={() => onLocate(antipodal)}
                {...antipodalPlaceInfo}
              />
            </div>
          )}
        </div>
      </div>

      {/* Mobile: bottom sheet */}
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 z-10 flex flex-col md:hidden"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}>
        {/* Toggle handle */}
        <div className="pointer-events-auto flex justify-center pb-1">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="flex items-center gap-1 rounded-t-xl bg-white/6 px-5 py-1.5 backdrop-blur-xl border border-b-0 border-white/8">
            <ChevronUp
              className={`h-4 w-4 text-white/50 transition-transform duration-300 ${mobileOpen ? 'rotate-180' : ''}`}
            />
            <span className="text-[11px] font-normal tracking-wide text-white/50">
              {mobileOpen ? 'Close' : 'Controls'}
            </span>
          </button>
        </div>

        {/* Sheet content */}
        <div
          ref={sheetRef}
          className={`pointer-events-auto transition-all duration-400 ease-out border-t border-white/8 bg-black/70 backdrop-blur-2xl ${
            mobileOpen ? 'max-h-[70vh]' : 'max-h-0 border-transparent'
          } overflow-hidden`}>
          <div
            className="panel-scroll overflow-y-auto p-4 space-y-2.5"
            style={{ maxHeight: 'calc(70vh - 8px)' }}>
            <LocationInput
              onLocationChange={onLocationChange}
              onDetectLocation={onDetectLocation}
              geoLoading={geoLoading}
              geoError={geoError}
            />

            {location && (
              <LocationCard
                type="current"
                lat={location.lat}
                lng={location.lng}
                onLocate={() => onLocate(location)}
                {...currentPlaceInfo}
              />
            )}

            {antipodal && (
              <LocationCard
                type="antipodal"
                lat={antipodal.lat}
                lng={antipodal.lng}
                onLocate={() => onLocate(antipodal)}
                {...antipodalPlaceInfo}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

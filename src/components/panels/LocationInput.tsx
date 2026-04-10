import { useState } from 'react';
import { Search, Locate, Loader } from 'lucide-react';
import { validateLatLng } from '../../lib/geo';

interface LocationInputProps {
  onLocationChange: (lat: number, lng: number) => void;
  onDetectLocation: () => void;
  geoLoading: boolean;
  geoError: string | null;
}

export function LocationInput({
  onLocationChange,
  onDetectLocation,
  geoLoading,
  geoError
}: LocationInputProps) {
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [error, setError] = useState('');

  const filterNumeric = (value: string) =>
    value
      .replace(/[^0-9.-]/g, '')
      .replace(/(?!^)-/g, '')
      .replace(/(\..*)\./, '$1');

  const clamp = (value: string, min: number, max: number) => {
    if (value === '' || value === '-' || value === '.') return value;
    const num = parseFloat(value);
    if (isNaN(num)) return value;
    if (num < min) return String(min);
    if (num > max) return String(max);
    return value;
  };

  const handleLatChange = (value: string) => {
    setLat(filterNumeric(value));
  };

  const handleLngChange = (value: string) => {
    setLng(filterNumeric(value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(lat);
    const lngNum = parseFloat(lng);

    if (isNaN(latNum) || isNaN(lngNum)) {
      setError('Enter valid numbers');
      return;
    }
    if (!validateLatLng(latNum, lngNum)) {
      setError('Lat: -90~90, Lng: -180~180');
      return;
    }

    setError('');
    onLocationChange(latNum, lngNum);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-2xl">
      {/* Top accent line */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/40 to-transparent" />

      <div className="p-4">
        <p className="mb-3 text-[11px] font-normal tracking-[0.15em] text-white/40 uppercase">
          Enter Coordinates
        </p>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-[10px] font-medium tracking-wider text-white/30 uppercase">
                Lat
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="40.7128"
                value={lat}
                onChange={(e) => handleLatChange(e.target.value)}
                onBlur={() => setLat(clamp(lat, -90, 90))}
                className="w-full rounded-lg border border-white/6 bg-white/4 px-3 py-2 font-mono text-[13px] text-white/90 placeholder:text-white/20 transition-colors focus:border-cyan-500/40 focus:bg-white/6 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1 block text-[10px] font-medium tracking-wider text-white/30 uppercase">
                Lng
              </label>
              <input
                type="text"
                inputMode="decimal"
                placeholder="-74.0060"
                value={lng}
                onChange={(e) => handleLngChange(e.target.value)}
                onBlur={() => setLng(clamp(lng, -180, 180))}
                className="w-full rounded-lg border border-white/6 bg-white/4 px-3 py-2 font-mono text-[13px] text-white/90 placeholder:text-white/20 transition-colors focus:border-cyan-500/40 focus:bg-white/6 focus:outline-none"
              />
            </div>
          </div>

          {error && <p className="text-[11px] text-red-400/80">{error}</p>}
          {geoError && (
            <p className="text-[11px] text-amber-400/70">{geoError}</p>
          )}

          <div className="flex gap-2">
            <button
              type="submit"
              className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/8 px-3 py-2 text-[12px] font-medium tracking-wide text-white/80 transition-all hover:bg-white/14 hover:text-white active:scale-[0.98]">
              <Search className="h-3 w-3" />
              Find Antipode
            </button>
            <button
              type="button"
              onClick={onDetectLocation}
              disabled={geoLoading}
              className="flex items-center gap-1.5 rounded-xl border border-cyan-500/20 bg-cyan-500/6 px-3 py-2 text-[12px] font-medium tracking-wide text-cyan-300/80 transition-all hover:bg-cyan-500/12 hover:text-cyan-200 active:scale-[0.98] disabled:opacity-40">
              {geoLoading ? (
                <Loader className="h-3 w-3 animate-spin" />
              ) : (
                <Locate className="h-3 w-3" />
              )}
              <span className="hidden min-[400px]:inline">Detect</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

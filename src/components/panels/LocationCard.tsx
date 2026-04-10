import { Crosshair, Navigation } from 'lucide-react';
import { formatCoordinate } from '../../lib/geo';

interface LocationCardProps {
  type: 'current' | 'antipodal';
  lat: number;
  lng: number;
  placeName: string;
  country: string;
  loading: boolean;
  onLocate?: () => void;
}

export function LocationCard({
  type,
  lat,
  lng,
  placeName,
  country,
  loading,
  onLocate
}: LocationCardProps) {
  const isCurrent = type === 'current';

  const accentLine = isCurrent
    ? 'from-transparent via-cyan-400/40 to-transparent'
    : 'from-transparent via-orange-400/40 to-transparent';
  const dotBg = isCurrent ? 'bg-cyan-400' : 'bg-orange-400';
  const dotShadow = isCurrent
    ? 'shadow-[0_0_6px_rgba(6,182,212,0.6)]'
    : 'shadow-[0_0_6px_rgba(249,115,22,0.6)]';
  const labelColor = isCurrent ? 'text-cyan-300/90' : 'text-orange-300/90';
  const btnHover = isCurrent
    ? 'hover:bg-cyan-500/15'
    : 'hover:bg-orange-500/15';
  const btnText = isCurrent ? 'text-cyan-400/70' : 'text-orange-400/70';

  return (
    <div className="group relative overflow-hidden rounded-2xl border border-white/8 bg-white/3 backdrop-blur-2xl">
      {/* Top accent line */}
      <div
        className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r ${accentLine}`}
      />

      <div className="p-4">
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              className={`h-1.5 w-1.5 rounded-full ${dotBg} ${dotShadow}`}
            />
            <span
              className={`text-[11px] font-medium tracking-widest uppercase ${labelColor}`}>
              {isCurrent ? 'Your Location' : 'Antipode'}
            </span>
          </div>
          <button
            onClick={onLocate}
            className={`rounded-lg p-1.5 transition-all ${btnText} ${btnHover} active:scale-90`}
            title="Fly to this location">
            <Crosshair className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Place name */}
        <div className="mb-3">
          {loading ? (
            <div className="animate-shimmer h-5 w-3/4 rounded bg-white/4" />
          ) : placeName ? (
            <div className="flex items-start gap-1.5">
              <Navigation className="mt-0.5 h-3 w-3 shrink-0 text-white/20" />
              <div>
                <p className="text-[13px] font-normal leading-tight text-white/90">
                  {placeName}
                </p>
                {country && (
                  <p className="mt-0.5 text-[11px] text-white/35">{country}</p>
                )}
              </div>
            </div>
          ) : (
            <p className="text-[11px] text-white/25 italic">Awaiting data</p>
          )}
        </div>

        {/* Coordinates */}
        <div className="flex gap-4 rounded-lg bg-white/3 px-3 py-2">
          <div className="flex-1">
            <p className="text-[9px] font-medium tracking-[0.15em] text-white/25 uppercase">
              Lat
            </p>
            <p className="font-mono text-[12px] text-white/70">
              {formatCoordinate(lat, 'lat')}
            </p>
          </div>
          <div className="w-px bg-white/6" />
          <div className="flex-1">
            <p className="text-[9px] font-medium tracking-[0.15em] text-white/25 uppercase">
              Lng
            </p>
            <p className="font-mono text-[12px] text-white/70">
              {formatCoordinate(lng, 'lng')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

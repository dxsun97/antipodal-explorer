import { Suspense, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import { MathUtils } from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EarthSphere } from "./EarthSphere";
import { Atmosphere } from "./Atmosphere";
import { Starfield } from "./Starfield";
import { LocationMarker } from "./LocationMarker";
import { ArcLine } from "./ArcLine";
import { CameraAnimator } from "./CameraAnimator";
import { latLngToCartesian } from "../../lib/geo";
import type { LatLng } from "../../lib/geo";

export type { OrbitControls as OrbitControlsImpl } from "three-stdlib";

const INTRO_TARGET_DIST = 2.8;

function CameraIntro({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  const done = useRef(false);

  useFrame(({ camera }) => {
    if (done.current) return;

    const dist = camera.position.length();
    if (dist > INTRO_TARGET_DIST + 0.05) {
      const newDist = MathUtils.lerp(dist, INTRO_TARGET_DIST, 0.03);
      camera.position.setLength(newDist);
      if (controlsRef.current) controlsRef.current.update();
    } else {
      done.current = true;
    }
  });

  return null;
}

function AdaptiveRotateSpeed({ controlsRef }: { controlsRef: React.RefObject<OrbitControlsImpl | null> }) {
  useFrame(({ camera }) => {
    if (controlsRef.current) {
      const dist = camera.position.length();
      controlsRef.current.rotateSpeed = Math.max(0.05, (dist - 1) / 5);
    }
  });
  return null;
}

interface EarthGlobeProps {
  currentLocation: LatLng | null;
  antipodalLocation: LatLng | null;
  focusTarget: LatLng | null;
}

export function EarthGlobe({
  currentLocation,
  antipodalLocation,
  focusTarget,
}: EarthGlobeProps) {
  const controlsRef = useRef<OrbitControlsImpl>(null);

  const currentPos = currentLocation
    ? latLngToCartesian(currentLocation.lat, currentLocation.lng, 1.03)
    : null;
  const antipodalPos = antipodalLocation
    ? latLngToCartesian(antipodalLocation.lat, antipodalLocation.lng, 1.03)
    : null;

  return (
    <Canvas
      camera={{ position: [0, 0, 8], fov: 45 }}
      style={{
        width: "100%",
        height: "100%",
        touchAction: "none",
        background: "radial-gradient(ellipse at center, #0a1628 0%, #000 100%)",
      }}
      gl={{ antialias: true }}
    >
      <Starfield />

      <Suspense fallback={null}>
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 3, 5]} intensity={1.5} />
        <EarthSphere />
        <Atmosphere />
      </Suspense>

      {currentPos && (
        <LocationMarker position={currentPos} color="#06b6d4" />
      )}

      {antipodalPos && (
        <LocationMarker position={antipodalPos} color="#f97316" />
      )}

      {currentPos && antipodalPos && (
        <ArcLine from={currentPos} to={antipodalPos} />
      )}

      <CameraIntro controlsRef={controlsRef} />
      <CameraAnimator target={focusTarget} controlsRef={controlsRef} />
      <AdaptiveRotateSpeed controlsRef={controlsRef} />

      <OrbitControls
        ref={controlsRef}
        enablePan={false}
        enableZoom
        zoomSpeed={0.8}
        minDistance={1.3}
        maxDistance={6}
        enableDamping
        dampingFactor={0.05}
      />
    </Canvas>
  );
}

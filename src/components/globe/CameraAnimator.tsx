import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Vector3, Spherical, MathUtils } from "three";
import { latLngToCartesian } from "../../lib/geo";
import type { LatLng } from "../../lib/geo";
import type { OrbitControlsImpl } from "./EarthGlobe";

interface CameraAnimatorProps {
  target: LatLng | null;
  controlsRef: React.RefObject<OrbitControlsImpl | null>;
}

export function CameraAnimator({ target, controlsRef }: CameraAnimatorProps) {
  const goalSpherical = useRef<Spherical | null>(null);
  const animatingRef = useRef(false);

  useEffect(() => {
    if (!target) return;

    const [x, y, z] = latLngToCartesian(target.lat, target.lng, 1);
    const dir = new Vector3(x, y, z).normalize();
    const spherical = new Spherical().setFromVector3(dir);
    goalSpherical.current = spherical;
    animatingRef.current = true;
  }, [target]);

  useFrame(() => {
    if (!animatingRef.current || !goalSpherical.current || !controlsRef.current)
      return;

    const controls = controlsRef.current!;
    const camera = controls.object;
    const currentSpherical = new Spherical().setFromVector3(camera.position);

    const goalPhi = goalSpherical.current.phi;
    const goalTheta = goalSpherical.current.theta;

    // Lerp spherical angles
    currentSpherical.phi = MathUtils.lerp(currentSpherical.phi, goalPhi, 0.05);

    // Handle theta wrapping for shortest path
    let dTheta = goalTheta - currentSpherical.theta;
    if (dTheta > Math.PI) dTheta -= Math.PI * 2;
    if (dTheta < -Math.PI) dTheta += Math.PI * 2;
    currentSpherical.theta += dTheta * 0.05;

    // Apply back to camera
    const newPos = new Vector3().setFromSpherical(currentSpherical);
    newPos.setLength(camera.position.length());
    camera.position.copy(newPos);
    controls.update();

    // Check if close enough to stop
    if (
      Math.abs(currentSpherical.phi - goalPhi) < 0.005 &&
      Math.abs(dTheta) < 0.005
    ) {
      animatingRef.current = false;
    }
  });

  return null;
}

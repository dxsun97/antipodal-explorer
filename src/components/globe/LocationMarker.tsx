import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { DoubleSide, Vector3 } from "three";
import type { Group, MeshBasicMaterial } from "three";

interface LocationMarkerProps {
  position: [number, number, number];
  color: string;
}

const BASE_DISTANCE = 2.8;

export function LocationMarker({ position, color }: LocationMarkerProps) {
  const groupRef = useRef<Group>(null);
  const glowRef = useRef<MeshBasicMaterial>(null);
  const posVec = new Vector3(...position);
  const elapsed = useRef(0);

  useFrame(({ camera }, delta) => {
    elapsed.current += delta;

    if (groupRef.current) {
      const dist = camera.position.distanceTo(posVec);
      groupRef.current.scale.setScalar(dist / BASE_DISTANCE);
      // Billboard: always face camera so ring never clips
      groupRef.current.quaternion.copy(camera.quaternion);
    }

    if (glowRef.current) {
      glowRef.current.opacity = 0.2 + Math.sin(elapsed.current * 3) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={position}>
      {/* Core dot */}
      <mesh>
        <circleGeometry args={[0.012, 16]} />
        <meshBasicMaterial color="#ffffff" side={DoubleSide} />
      </mesh>

      {/* Color ring */}
      <mesh>
        <ringGeometry args={[0.012, 0.02, 24]} />
        <meshBasicMaterial color={color} side={DoubleSide} />
      </mesh>

      {/* Glow */}
      <mesh>
        <circleGeometry args={[0.035, 24]} />
        <meshBasicMaterial
          ref={glowRef}
          color={color}
          transparent
          opacity={0.2}
          side={DoubleSide}
        />
      </mesh>
    </group>
  );
}

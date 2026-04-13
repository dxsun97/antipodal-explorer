import { useRef } from "react";
import { useTexture } from "@react-three/drei";
import { SRGBColorSpace, type Mesh } from "three";

export function EarthSphere() {
  const meshRef = useRef<Mesh>(null);
  const texture = useTexture(`${import.meta.env.BASE_URL}earth-blue-marble.jpg`, (t) => {
    t.colorSpace = SRGBColorSpace;
    t.anisotropy = 16;
  });

  return (
    <mesh ref={meshRef}>
      <sphereGeometry args={[1, 128, 128]} />
      <meshBasicMaterial map={texture} />
    </mesh>
  );
}

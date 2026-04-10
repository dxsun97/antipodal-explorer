import { shaderMaterial } from "@react-three/drei";
import { extend } from "@react-three/fiber";
import { BackSide } from "three";

const AtmosphereMaterial = shaderMaterial(
  {},
  // vertex
  `varying vec3 vNormal;
   void main() {
     vNormal = normalize(normalMatrix * normal);
     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
   }`,
  // fragment
  `varying vec3 vNormal;
   void main() {
     float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.0);
     gl_FragColor = vec4(0.3, 0.6, 1.0, 1.0) * intensity;
   }`
);

extend({ AtmosphereMaterial });

declare module "@react-three/fiber" {
  interface ThreeElements {
    atmosphereMaterial: ThreeElements["shaderMaterial"];
  }
}

export function Atmosphere() {
  return (
    <mesh>
      <sphereGeometry args={[1.02, 64, 64]} />
      <atmosphereMaterial transparent side={BackSide} />
    </mesh>
  );
}

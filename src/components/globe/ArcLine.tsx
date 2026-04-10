import { Line } from "@react-three/drei";

interface ArcLineProps {
  from: [number, number, number];
  to: [number, number, number];
}

export function ArcLine({ from, to }: ArcLineProps) {
  return (
    <Line
      points={[from, [0, 0, 0], to]}
      color="#f97316"
      lineWidth={1.5}
      transparent
      opacity={0.5}
      dashed
      dashScale={20}
      dashSize={0.05}
      gapSize={0.03}
    />
  );
}

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Configuration for different glasses models
const GLASSES_CONFIGS = {
  
  "glasses_3.glb": {
    scaleMultiplier: 5.3,
    yOffsetMultiplier: 0.2,
    rotation: { x: Math.PI / 2, y: Math.PI, z: 0 },
  },
  "glasses_4.glb": {
    scaleMultiplier: 1.0,
    yOffsetMultiplier: -0.5,
    rotation: { x: Math.PI / 2, y: Math.PI, z: 0 },
  },
  "glasses_5.glb": {
    scaleMultiplier: 0.6,
    yOffsetMultiplier: -0.9,
    rotation: { x: Math.PI / 2, y: Math.PI, z: 0 },
  },
  
};

function GlassesObject({ faceData, modelName }) {
  const ref = useRef();
  const { scene } = useGLTF(`/${modelName}`);

  // Get configuration for the current modelName or fallback to defaults
  const config = GLASSES_CONFIGS[modelName] || {
    scaleMultiplier: 1.0,
    yOffsetMultiplier: 0,
    rotation: { x: 0, y: 0, z: 0 },
  };

  useEffect(() => {
    const { x, y, z } = config.rotation;
    scene.rotation.set(x, y, z);
  }, [scene, config.rotation]);

  useFrame(() => {
    if (!faceData) return;

    const leftEye = faceData[33];
    const rightEye = faceData[263];

    if (!leftEye || !rightEye) return;

    // Midpoint between eyes as base position
    const midX = (leftEye.x + rightEye.x) / 2;
    const midY = (leftEye.y + rightEye.y) / 2;

    // Distance between eyes for scale
    const eyeDist = Math.sqrt(
      Math.pow(leftEye.x - rightEye.x, 2) + Math.pow(leftEye.y - rightEye.y, 2)
    );

    // Convert normalized coordinates to world coords
    const x = (midX - 0.5) * -2;
    let y = -(midY - 0.5) * 2;

    // Apply vertical offset multiplier based on eye distance
    y += eyeDist * config.yOffsetMultiplier;

    ref.current.position.set(x, y, 0);

    // Apply scale multiplier
    const scl = eyeDist * config.scaleMultiplier;
    ref.current.scale.set(scl, scl, scl);

    // Calculate rotation angle based on eye line slope
    const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x);
    ref.current.rotation.set(0, 0, angle);
  });

  return <primitive ref={ref} object={scene} />;
}

export default function VirtualGlasses({ faceData, modelName = "glasses_4.glb" }) {
  return (
    <Canvas
      style={{ position: "absolute", top: 0, left: 0, pointerEvents: "none" }}
      camera={{ position: [0, 0, 2.5] }}
    >
      <ambientLight intensity={1} />
      <GlassesObject faceData={faceData} modelName={modelName} />
    </Canvas>
  );
}

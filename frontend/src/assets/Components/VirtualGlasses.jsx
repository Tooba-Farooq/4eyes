/*import React, { useRef, useEffect } from "react";
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
*/

import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";

// Key landmarks from Benson Ruan's working implementation
const LANDMARKS = {
  MIDDLE_BETWEEN_EYES: 168,
  LEFT_EYE: 143,
  RIGHT_EYE: 372,
  NOSE_BOTTOM: 2
};

// Configuration for different glasses models
const GLASSES_CONFIGS = {
  "glasses_3.glb": {
    scale: 1.3, // Much smaller base scale
    offset: { x: 0, y: -0.02, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  },
  "glasses_4.glb": {
    scale: 0.27,
    offset: { x: 0, y: -0.1, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  },
  "glasses_5.glb": {
    scale: 0.15,
    offset: { x: 0, y: -0.1, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  },
};

function GlassesObject({ faceData, modelName }) {
  const ref = useRef();
  const { scene } = useGLTF(`/${modelName}`);

  const config = GLASSES_CONFIGS[modelName] || {
    scale: 0.012,
    offset: { x: 0, y: -0.02, z: 0 },
    rotation: { x: 0, y: Math.PI, z: 0 },
  };

  useEffect(() => {
    const { x, y, z } = config.rotation;
    scene.rotation.set(x, y, z);
  }, [scene, config.rotation]);

  useFrame(() => {
    if (!faceData || !ref.current) return;

    // Use the correct landmarks (from working examples)
    const middleEye = faceData[LANDMARKS.MIDDLE_BETWEEN_EYES];
    const leftEye = faceData[LANDMARKS.LEFT_EYE];
    const rightEye = faceData[LANDMARKS.RIGHT_EYE];

    if (!middleEye || !leftEye || !rightEye) return;

    // Calculate position: Use middle point between eyes as anchor
    // Convert normalized coords (0-1) to Three.js world space (-1 to 1)
    // Account for mirrored video
    const x = -(middleEye.x - 0.5) * 2;
    const y = (0.5 - middleEye.y) * 2;
    
    // Z depth is unreliable in MediaPipe JS, so we use a fixed depth
    // and scale based on eye distance instead
    const z = 0;

    // Apply config offset
    ref.current.position.set(
      x + config.offset.x,
      y + config.offset.y,
      z + config.offset.z
    );

    // Calculate scale based on distance between eyes
    const eyeDistance = Math.sqrt(
      Math.pow(leftEye.x - rightEye.x, 2) +
      Math.pow(leftEye.y - rightEye.y, 2)
    );

    // Scale proportionally to face size
    const scale = eyeDistance * config.scale;
    ref.current.scale.set(scale, scale, scale);

    // Calculate head tilt angle
    const angle = Math.atan2(
      rightEye.y - leftEye.y,
      rightEye.x - leftEye.x
    );
    
    // Apply rotation to match head tilt (only Z-axis rotation)
    ref.current.rotation.z = -angle;
  });

  return <primitive ref={ref} object={scene} />;
}

export default function VirtualGlasses({ faceData, modelName = "glasses_4.glb" }) {
  return (
    <Canvas
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
      }}
      // Use orthographic camera instead of perspective to avoid depth issues
      orthographic
      camera={{
        zoom: 500,
        position: [0, 0, 100],
        near: 0.1,
        far: 1000,
      }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <GlassesObject faceData={faceData} modelName={modelName} />
    </Canvas>
  );
}
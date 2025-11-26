import React, { useRef, useEffect } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import { LANDMARKS, GLASSES_CONFIGS } from "../../API/glasses"; // adjust path accordingly

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

    const middleEye = faceData[LANDMARKS.MIDDLE_BETWEEN_EYES];
    const leftEye = faceData[LANDMARKS.LEFT_EYE];
    const rightEye = faceData[LANDMARKS.RIGHT_EYE];

    if (!middleEye || !leftEye || !rightEye) return;

    const x = -(middleEye.x - 0.5) * 2;
    const y = (0.5 - middleEye.y) * 2;
    const z = 0;

    ref.current.position.set(
      x + config.offset.x,
      y + config.offset.y,
      z + config.offset.z
    );

    const eyeDistance = Math.sqrt(
      Math.pow(leftEye.x - rightEye.x, 2) +
      Math.pow(leftEye.y - rightEye.y, 2)
    );

    const scale = eyeDistance * config.scale;
    ref.current.scale.set(scale, scale, scale);

    const angle = Math.atan2(
      rightEye.y - leftEye.y,
      rightEye.x - leftEye.x
    );
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
      orthographic
      camera={{ zoom: 500, position: [0, 0, 100], near: 0.1, far: 1000 }}
      gl={{ alpha: true, antialias: true }}
    >
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={0.8} />
      <directionalLight position={[-5, -5, -5]} intensity={0.3} />
      <GlassesObject faceData={faceData} modelName={modelName} />
    </Canvas>
  );
}
// glassesConfig.js
export const LANDMARKS = {
  MIDDLE_BETWEEN_EYES: 168,
  LEFT_EYE: 143,
  RIGHT_EYE: 372,
  NOSE_BOTTOM: 2
};

export const GLASSES_CONFIGS = {
  "glasses_3.glb": {
    scale: 1.3,
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

export const GLASSES_OPTIONS = [
  { id: "glasses_3.glb", name: "Round Frame Sunnies", price: "Rs.2500", image: "1.png" },
  { id: "glasses_4.glb", name: "Round Frame", price: "Rs.6000", image: "2.png" },
  { id: "glasses_5.glb", name: "Star Funky Shades", price: "Rs.500", image: "3.png" },
];
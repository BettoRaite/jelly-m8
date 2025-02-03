// presets.ts
export type GradientPreset = {
  background: string;
  animation: string;
  transformOrigin?: string;
  opacity?: number;
};

export const PRESETS = {
  DEFAULT: [
    {
      background:
        "radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%)",
      animation: "moveVertical",
    },
    {
      background:
        "radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%)",
      animation: "moveInCircle",
      transformOrigin: "calc(50% - 400px)",
    },
    {
      background:
        "radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%)",
      animation: "moveInCircle",
      transformOrigin: "calc(50% + 400px)",
    },
  ],
  BUBBLE: [
    {
      background:
        "radial-gradient(circle at center, rgba(255, 105, 180, 0.8) 0, rgba(255, 105, 180, 0) 50%)",
      animation: "moveVertical",
      opacity: 0.8,
    },
    {
      background:
        "radial-gradient(circle at center, rgba(255, 192, 203, 0.8) 0, rgba(255, 192, 203, 0) 50%)",
      animation: "moveInCircle",
      transformOrigin: "calc(50% - 300px)",
    },
    {
      background:
        "radial-gradient(circle at center, rgba(173, 216, 230, 0.8) 0, rgba(173, 216, 230, 0) 50%)",
      animation: "moveHorizontal",
      opacity: 0.7,
    },
  ],
  FIRE: [
    {
      background:
        "radial-gradient(circle at center, rgba(255, 69, 0, 0.8) 0, rgba(255, 69, 0, 0) 50%)",
      animation: "moveVertical",
    },
    {
      background:
        "radial-gradient(circle at center, rgba(255, 140, 0, 0.8) 0, rgba(255, 140, 0, 0) 50%)",
      animation: "moveInCircle",
      transformOrigin: "calc(50% - 400px)",
    },
    {
      background:
        "radial-gradient(circle at center, rgba(255, 215, 0, 0.8) 0, rgba(255, 215, 0, 0) 50%)",
      animation: "moveHorizontal",
    },
  ],
};

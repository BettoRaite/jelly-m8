import { joinClasses } from "@/lib/utils/strings";
import { PRESETS } from "@/lib/bg-presets";

type Props = {
  className?: string;
  preset?: keyof typeof PRESETS;
};

function AnimatedGradientBackground({ className, preset = "DEFAULT" }: Props) {
  const gradients = PRESETS[preset];

  return (
    <div
      className={joinClasses(
        "bg-gray-500 bg-clip-padding backdrop-filter backdrop-blur bg-opacity-10 backdrop-saturate-100",
        "backdrop-contrast-100 gradient-bg absolute w-screen h-screen -z-100 overflow-hidden",
        "bg-gradient-to-br from-[rgb(108,0,162)] to-[rgb(0,17,82)]",
        className
      )}
    >
      <svg className="fixed top-0 left-0 w-0 h-0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
        </filter>
      </svg>

      <div className="gradients-container w-full h-full filter blur-[40px]">
        {gradients.map((gradient, index) => (
          <div
            key={index}
            className={`g${
              index + 1
            } absolute w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] mix-blend-hard-light opacity-${
              gradient.opacity || 100
            } animate-${gradient.animation}`}
            style={{
              background: gradient.background,
              transformOrigin: gradient.transformOrigin,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default AnimatedGradientBackground;

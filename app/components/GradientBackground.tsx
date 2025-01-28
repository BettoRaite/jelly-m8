const GradientBackground = () => {
  return (
    <div className="bg-gray-500 bg-clip-padding backdrop-filter  backdrop-blur bg-opacity-10 backdrop-saturate-100 backdrop-contrast-100 gradient-bg absolute w-screen h-screen -z-10 overflow-hidden bg-gradient-to-br from-[rgb(108,0,162)] to-[rgb(0,17,82)]">
      <svg className="fixed top-0 left-0 w-0 h-0">
        <filter id="goo">
          <feGaussianBlur in="SourceGraphic" stdDeviation="40" />
        </filter>
      </svg>

      <div className="gradients-container w-full h-full filter blur-[40px]">
        <div
          className="g1 absolute w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] mix-blend-hard-light opacity-100 animate-moveVertical"
          style={{
            background:
              "radial-gradient(circle at center, rgba(18, 113, 255, 0.8) 0, rgba(18, 113, 255, 0) 50%)",
          }}
        ></div>
        <div
          className="g2 absolute w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] mix-blend-hard-light opacity-100 animate-moveInCircle"
          style={{
            background:
              "radial-gradient(circle at center, rgba(221, 74, 255, 0.8) 0, rgba(221, 74, 255, 0) 50%)",
            transformOrigin: "calc(50% - 400px)",
          }}
        ></div>
        <div
          className="g3 absolute w-[80%] h-[80%] top-[calc(50%-40%+200px)] left-[calc(50%-40%-500px)] mix-blend-hard-light opacity-100 animate-moveInCircle"
          style={{
            background:
              "radial-gradient(circle at center, rgba(100, 220, 255, 0.8) 0, rgba(100, 220, 255, 0) 50%)",
            transformOrigin: "calc(50% + 400px)",
          }}
        ></div>
        <div
          className="g4 absolute w-[80%] h-[80%] top-[calc(50%-40%)] left-[calc(50%-40%)] mix-blend-hard-light opacity-70 animate-moveHorizontal"
          style={{
            background:
              "radial-gradient(circle at center, rgba(200, 50, 50, 0.8) 0, rgba(200, 50, 50, 0) 50%)",
            transformOrigin: "calc(50% - 200px)",
          }}
        ></div>
        <div
          className="g5 absolute w-[160%] h-[160%] top-[calc(50%-80%)] left-[calc(50%-80%)] mix-blend-hard-light opacity-100 animate-moveInCircle"
          style={{
            background:
              "radial-gradient(circle at center, rgba(180, 180, 50, 0.8) 0, rgba(180, 180, 50, 0) 50%)",
            transformOrigin: "calc(50% - 800px) calc(50% + 200px)",
          }}
        ></div>
        <div
          className="interactive absolute w-full h-full top-[-50%] left-[-50%] mix-blend-hard-light opacity-70"
          style={{
            background:
              "radial-gradient(circle at center, rgba(140, 100, 255, 0.8) 0, rgba(140, 100, 255, 0) 50%)",
          }}
        ></div>
      </div>
    </div>
  );
};

export default GradientBackground;

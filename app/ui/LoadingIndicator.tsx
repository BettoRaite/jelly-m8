function LoadingIndicator({
  size = "w-5 h-5",
  borderWidth = "border-4",
  borderColor = "border-white",
  borderBottomColor = "border-b-transparent",
  borderRadius = "rounded-full",
  animationDuration = "1s",
  animationTimingFunction = "linear",
  animationIterationCount = "infinite",
  className = "",
}) {
  const animationStyle = {
    animationDuration: `${animationDuration} ${animationTimingFunction} ${animationIterationCount}`,
  };

  return (
    <div
      className={`${className} ${size} ${borderWidth} ${borderColor} ${borderBottomColor} ${borderRadius} inline-block box-border animate-rotation`}
      style={animationStyle}
    />
  );
}

export default LoadingIndicator;

const Skeleton = ({ width = "100%", height = "20px", className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-300 rounded ${className}`}
      style={{ width, height }}
    />
  );
};

export default Skeleton;

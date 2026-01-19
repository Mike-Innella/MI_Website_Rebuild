export default function SkeletonBase({
  className = "",
  style = {},
  variant = "rect", // rect | text | circle
  lines = 1, // for text variant
}) {
  if (variant === "text") {
    return (
      <div className={`skel-text ${className}`} style={style}>
        {Array.from({ length: lines }).map((_, i) => (
          <div key={i} className="skel skel-line" />
        ))}
      </div>
    );
  }

  return (
    <div
      className={`skel skel-${variant} ${className}`}
      style={style}
      aria-hidden="true"
    />
  );
}

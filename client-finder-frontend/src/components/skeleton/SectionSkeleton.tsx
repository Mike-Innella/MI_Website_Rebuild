import SkeletonBase from "./SkeletonBase";

export default function SectionSkeleton({ cardCount = 2 }) {
  return (
    <div className="skel-section" aria-hidden="true">
      <div className="skel-section-header">
        <SkeletonBase variant="rect" style={{ width: 140, height: 12, borderRadius: 999 }} />
        <SkeletonBase variant="rect" style={{ width: "74%", height: 34 }} />
        <SkeletonBase variant="rect" style={{ width: "92%", height: 16 }} />
        <SkeletonBase variant="rect" style={{ width: "78%", height: 16 }} />
      </div>
      <div className="skel-section-grid">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div key={index} className="skel-card">
            <SkeletonBase variant="rect" style={{ width: "64%", height: 16 }} />
            <SkeletonBase variant="rect" style={{ width: "94%", height: 13 }} />
            <SkeletonBase variant="rect" style={{ width: "86%", height: 13 }} />
            <SkeletonBase variant="rect" style={{ width: "70%", height: 13 }} />
            <SkeletonBase variant="rect" style={{ width: "46%", height: 14, borderRadius: 999 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

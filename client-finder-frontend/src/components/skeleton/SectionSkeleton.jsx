import SkeletonBase from "./SkeletonBase";

export default function SectionSkeleton({ cardCount = 3 }) {
  return (
    <div className="skel-section" aria-hidden="true">
      <div className="skel-section-header">
        <SkeletonBase variant="rect" style={{ width: 120, height: 12, borderRadius: 999 }} />
        <SkeletonBase variant="rect" style={{ width: "75%", height: 32 }} />
        <SkeletonBase variant="rect" style={{ width: "90%", height: 18 }} />
      </div>
      <div className="skel-section-grid">
        {Array.from({ length: cardCount }).map((_, index) => (
          <div key={index} className="skel-card">
            <SkeletonBase variant="rect" style={{ width: "70%", height: 18 }} />
            <SkeletonBase variant="rect" style={{ width: "96%", height: 12 }} />
            <SkeletonBase variant="rect" style={{ width: "88%", height: 12 }} />
            <SkeletonBase variant="rect" style={{ width: "60%", height: 12 }} />
          </div>
        ))}
      </div>
    </div>
  );
}

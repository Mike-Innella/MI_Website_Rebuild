import SectionSkeleton from "./SectionSkeleton";
import SkeletonBase from "./SkeletonBase";

export default function PageSkeleton() {
  return (
    <div className="skel-page" aria-hidden="true">
      <div className="skel-shell">
        <div className="skel-nav">
          <div className="skel-nav-left">
            <SkeletonBase variant="circle" style={{ width: 48, height: 48 }} />
            <SkeletonBase variant="rect" style={{ width: 170, height: 18 }} />
          </div>
          <div className="skel-nav-links">
            <SkeletonBase variant="rect" style={{ width: 144, height: 36, borderRadius: 999 }} />
            <SkeletonBase variant="rect" style={{ width: 144, height: 36, borderRadius: 999 }} />
          </div>
          <div className="skel-nav-actions">
            <SkeletonBase
              className="skel-hide-mobile"
              variant="rect"
              style={{ width: 214, height: 42, borderRadius: 999 }}
            />
            <SkeletonBase
              className="skel-hide-desktop"
              variant="rect"
              style={{ width: 38, height: 38, borderRadius: 12 }}
            />
            <SkeletonBase variant="circle" style={{ width: 38, height: 38 }} />
          </div>
        </div>

        <div className="skel-hero">
          <div className="skel-hero-stack">
            <SkeletonBase variant="rect" style={{ width: "100%", height: 52 }} />
            <SkeletonBase variant="rect" style={{ width: "84%", height: 52 }} />
            <SkeletonBase variant="rect" style={{ width: "72%", height: 18 }} />
            <SkeletonBase variant="rect" style={{ width: "58%", height: 16 }} />
          </div>
          <div className="skel-hero-options">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="skel-hero-card">
                <SkeletonBase variant="rect" style={{ width: "72%", height: 18 }} />
                <SkeletonBase variant="rect" style={{ width: "88%", height: 14 }} />
                <SkeletonBase variant="rect" style={{ width: "66%", height: 14 }} />
                <SkeletonBase variant="rect" style={{ width: "52%", height: 14, borderRadius: 999 }} />
              </div>
            ))}
          </div>
          <SkeletonBase variant="rect" style={{ width: "42%", height: 14 }} />
        </div>

        <SectionSkeleton cardCount={2} />
        <SectionSkeleton cardCount={1} />
        <SectionSkeleton cardCount={2} />
        <SectionSkeleton cardCount={2} />
        <SectionSkeleton cardCount={2} />
        <SectionSkeleton cardCount={1} />
      </div>
    </div>
  );
}

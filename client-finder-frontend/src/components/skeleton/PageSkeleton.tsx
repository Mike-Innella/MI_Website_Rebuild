import SectionSkeleton from "./SectionSkeleton";
import SkeletonBase from "./SkeletonBase";

export default function PageSkeleton() {
  return (
    <div className="skel-page" aria-hidden="true">
      <div className="skel-shell">
        <div className="skel-nav">
          <div className="skel-nav-left">
            <SkeletonBase variant="circle" style={{ width: 44, height: 44 }} />
            <SkeletonBase variant="rect" style={{ width: 180, height: 20 }} />
          </div>
          <div className="skel-nav-right">
            <SkeletonBase variant="rect" style={{ width: 90, height: 32, borderRadius: 999 }} />
            <SkeletonBase variant="rect" style={{ width: 90, height: 32, borderRadius: 999 }} />
            <SkeletonBase variant="rect" style={{ width: 110, height: 32, borderRadius: 999 }} />
            <SkeletonBase variant="rect" style={{ width: 120, height: 36, borderRadius: 999 }} />
          </div>
        </div>

        <div className="skel-hero">
          <div className="skel-hero-grid">
            <div className="skel-hero-copy">
              <SkeletonBase variant="rect" style={{ width: "45%", height: 14 }} />
              <SkeletonBase variant="rect" style={{ width: "100%", height: 44 }} />
              <SkeletonBase variant="rect" style={{ width: "84%", height: 44 }} />
              <SkeletonBase variant="rect" style={{ width: "72%", height: 18 }} />
              <SkeletonBase variant="rect" style={{ width: "60%", height: 18 }} />
              <div className="skel-cta-row">
                <SkeletonBase variant="rect" style={{ width: 220, height: 44, borderRadius: 999 }} />
                <SkeletonBase variant="rect" style={{ width: 140, height: 44, borderRadius: 999 }} />
              </div>
              <SkeletonBase variant="rect" style={{ width: 260, height: 36, borderRadius: 999 }} />
            </div>
            <div className="skel-hero-side">
              <SkeletonBase variant="rect" style={{ height: 220 }} />
              <SkeletonBase variant="rect" style={{ height: 160 }} />
            </div>
          </div>
        </div>

        <SectionSkeleton />
        <SectionSkeleton />
        <SectionSkeleton />
      </div>
    </div>
  );
}

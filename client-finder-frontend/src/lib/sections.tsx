import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/skeleton/SectionSkeleton";

const createSection = (loader, cardCount, key) => {
  const fallback = <SectionSkeleton cardCount={cardCount} />;
  return {
    key,
    Component: dynamic(loader, { loading: () => fallback }),
    fallback,
  };
};

export const homeSections = [
  createSection(() => import("@/components/sections/OfferSection"), 2, "offer-business"),
  createSection(() => import("@/components/sections/ProofSection"), 1, "recent-rebuild"),
  createSection(() => import("@/components/sections/ProcessSection"), 2, "process"),
  createSection(() => import("@/components/sections/CtaSection"), 2, "lead-magnet"),
  createSection(() => import("@/components/sections/ProblemSolutionSection"), 2, "offer-single"),
  createSection(() => import("@/components/sections/FinalCtaSection"), 1, "final-cta"),
];

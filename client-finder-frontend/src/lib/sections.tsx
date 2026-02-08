import dynamic from "next/dynamic";
import SectionSkeleton from "@/components/skeleton/SectionSkeleton";

const createSection = (loader, cardCount, key, anchorId) => {
  const fallback = <SectionSkeleton cardCount={cardCount} />;
  return {
    key,
    anchorId,
    Component: dynamic(loader, { loading: () => fallback }),
    fallback,
    eager: false,
  };
};

export const homeSections = [
  { ...createSection(() => import("@/components/sections/AudienceFitSection"), 1, "fit", "fit"), eager: true },
  {
    ...createSection(() => import("@/components/sections/SevenDayChangesSection"), 1, "seven-day-changes", "seven-day-changes"),
    eager: true,
  },
  createSection(() => import("@/components/sections/AboutSection"), 1, "about", "about"),
  createSection(() => import("@/components/sections/OfferSection"), 2, "offer-business", "offer-business"),
  { ...createSection(() => import("@/components/sections/ProcessSection"), 2, "process", "process"), eager: true },
  createSection(() => import("@/components/sections/ProofSection"), 1, "recent-rebuild", "recent-rebuild"),
  { ...createSection(() => import("@/components/sections/CtaSection"), 2, "lead-magnet", "review"), eager: true },
  createSection(() => import("@/components/sections/ProblemSolutionSection"), 2, "offer-single", "offer-single"),
  createSection(() => import("@/components/sections/FinalCtaSection"), 1, "final-cta", "final-cta"),
];

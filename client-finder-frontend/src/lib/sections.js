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
  createSection(
    () => import("@/components/sections/ProblemSolutionSection"),
    2,
    "problem-solution",
  ),
  createSection(() => import("@/components/sections/ProofSection"), 2, "proof"),
  createSection(() => import("@/components/sections/OfferSection"), 3, "offer"),
  createSection(() => import("@/components/sections/PricingSection"), 3, "pricing"),
  createSection(() => import("@/components/sections/ProcessSection"), 3, "process"),
  createSection(() => import("@/components/sections/CtaSection"), 1, "cta"),
];

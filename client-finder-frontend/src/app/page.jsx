import { Box } from "@mui/material";
import Navbar from "@/components/layout/Navbar";
import HeroSection from "@/components/sections/HeroSection";
import LazyMount from "@/components/utils/LazyMount";
import { homeSections } from "@/lib/sections";
import { jsonLd } from "@/lib/siteConfig";

export default function Page() {
  return (
    <Box
      sx={{
        position: "relative",
        background:
          "radial-gradient(circle at 30% 20%, var(--glow-1), transparent 55%), radial-gradient(circle at 70% 10%, var(--glow-2), transparent 40%)",
      }}
    >
      <Box
        aria-hidden
        sx={{
          position: "absolute",
          top: 0,
          left: "50%",
          transform: "translateX(-50%)",
          width: "min(1200px, 95vw)",
          height: { xs: "420px", md: "520px", lg: "620px" },
          background:
            "radial-gradient(circle at center, var(--glow-1), transparent 70%)",
          pointerEvents: "none",
          zIndex: 0,
        }}
      />
      <Box sx={{ position: "relative", zIndex: 1 }}>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <Navbar />
        <HeroSection />
        {homeSections.map(({ key, Component, fallback }) => (
          <LazyMount key={key} fallback={fallback}>
            <Component />
          </LazyMount>
        ))}
      </Box>
    </Box>
  );
}

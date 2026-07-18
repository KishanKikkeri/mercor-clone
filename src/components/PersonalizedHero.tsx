"use client";

import { useEffect, useState } from "react";
import { usePersonalize } from "@/hooks/usePersonalize";
import { PageHero } from "./PageHero";
import Link from "next/link";
import { HeroCMS } from "@/lib/types";
import { DEBUG } from "@/lib/debug";

interface PersonalizedHeroProps {
  fallback: HeroCMS;
}

export function PersonalizedHero({ fallback }: PersonalizedHeroProps) {
  const { sdk, loading } = usePersonalize();
  const [hero, setHero] = useState<HeroCMS>(fallback);
  const [isPersonalized, setIsPersonalized] = useState(false);

  useEffect(() => {
    if (loading || !sdk) return;

    const aliases = sdk.getVariantAliases();
    const experiences = sdk.getExperiences();

    if (DEBUG.enabled && DEBUG.personalize) {
      console.groupCollapsed("[Personalize Hero Debug]");
      console.log("Resolved Variant Aliases:", aliases);
      console.log("Total Experiences Found:", experiences.length);

      experiences.forEach((exp, index) => {
        console.groupCollapsed(`Experience Resolution #${index + 1}: ${exp.shortUid}`);
        
        console.log("Experience Name:", (exp as any).name ?? "N/A");
        console.log("Experience Short UID:", exp.shortUid);
        console.log("Experience Status:", (exp as any).status ?? "N/A");
        console.log("Active Variant Short UID:", exp.activeVariantShortUid ?? "None (No active variant resolved)");
        console.log("Active Variant Alias:", (exp as any).activeVariantAlias ?? "N/A");
        console.log("All Variants:", (exp as any).variants ?? "N/A");
        console.log("Audience Information:", (exp as any).audience ?? "N/A");
        console.log("Entry Variant Information:", (exp as any).entryVariant ?? "N/A");
        console.log("Entry Variant Alias:", (exp as any).entryVariantAlias ?? "N/A");
        console.log("Matching Status:", (exp as any).matchingStatus ?? (exp as any).isMatched ?? "N/A");
        console.log("Eligibility Status:", (exp as any).eligibilityStatus ?? (exp as any).isEligible ?? "N/A");
        
        console.log("Resolution / Evaluation Flags:", {
          isActive: (exp as any).isActive,
          isVariantResolved: !!exp.activeVariantShortUid,
          hasFallback: (exp as any).hasFallback,
          audienceMatched: (exp as any).audienceMatched,
        });

        console.log("Raw Experience Object:");
        console.dir(exp);
        
        console.groupEnd();
      });
      console.groupEnd();
    }

    if (aliases && aliases.length > 0) {
      // Fetch personalized hero content
      fetch(`/api/personalized-hero?aliases=${encodeURIComponent(aliases.join(","))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hero) {
            setHero(data.hero);
            setIsPersonalized(true);

            // Trigger SDK impression logs for the active experiences at the edge
            try {
              const experiences = sdk.getExperiences();
              experiences.forEach((exp) => {
                if (exp.activeVariantShortUid) {
                  sdk.triggerImpression(exp.shortUid);
                }
              });
            } catch (impErr) {
              if (process.env.NODE_ENV === "development") {
                console.error("[Personalize Hero] Failed to trigger SDK impressions:", impErr);
              }
            }
          }
        })
        .catch((err) => {
          if (process.env.NODE_ENV === "development") {
            console.error("[Personalize Hero] Failed to load personalized variant:", err);
          }
        });
    }
  }, [sdk, loading]);

  const heroHeading = hero.heading || fallback.heading;
  const heroSubheading = hero.subheading || fallback.subheading;
  const heroCtaText = hero.cta_button_text || fallback.cta_button_text;
  const heroCtaLink = hero.cta_button_link || fallback.cta_button_link;
  const heroBgImage = hero.background_image || fallback.background_image;

  return (
    <PageHero
      eyebrow={isPersonalized ? "Recommended for you" : "Now hiring"}
      title={heroHeading}
      subtitle={heroSubheading}
      size="lg"
      backgroundImage={heroBgImage}
    >
      {heroCtaText && (
        <Link
          href={heroCtaLink || "/jobs"}
          className="inline-flex items-center rounded-lg bg-purple-600 px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:bg-purple-700 hover:shadow-lg hover:shadow-purple-100 active:scale-[0.98] btn-hover-effect"
        >
          {heroCtaText}
        </Link>
      )}
    </PageHero>
  );
}

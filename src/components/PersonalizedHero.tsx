"use client";

import { useEffect, useState } from "react";
import { usePersonalize } from "@/hooks/usePersonalize";
import { PageHero } from "./PageHero";
import Link from "next/link";
import { HeroCMS } from "@/lib/types";

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

    if (process.env.NODE_ENV === "development") {
      console.log(
        `%c[Personalize Debug]`,
        "color: #ec4899; font-weight: bold;",
        `\nResolved Variant Aliases:\n`,
        aliases,
        `\nActive Experiences:\n`,
        experiences.map((exp) => ({
          experienceShortUid: exp.shortUid,
          activeVariantShortUid: exp.activeVariantShortUid,
          name: (exp as any).name || "N/A",
        }))
      );
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

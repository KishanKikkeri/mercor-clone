"use client";

import { useEffect, useState, useRef } from "react";
import { usePersonalize } from "@/hooks/usePersonalize";
import { PageHero } from "./PageHero";
import Link from "next/link";
import { HeroCMS } from "@/lib/types";
import { getBehaviorState } from "@/lib/behavior/engine";

interface PersonalizedHeroProps {
  fallback: HeroCMS;
}

export function PersonalizedHero({ fallback }: PersonalizedHeroProps) {
  const { sdk, loading } = usePersonalize();
  const [hero, setHero] = useState<HeroCMS>(fallback);
  const [isPersonalized, setIsPersonalized] = useState(false);
  const lastLoggedAliasesRef = useRef<string>("");
  const lastLoggedExperiencesRef = useRef<string>("");

  useEffect(() => {
    if (loading || !sdk) return;

    const aliases = sdk.getVariantAliases();
    const experiences = sdk.getExperiences();

    const aliasesKey = aliases.join(",");
    const experiencesKey = JSON.stringify(
      experiences.map((exp) => ({
        shortUid: exp.shortUid,
        activeVariantShortUid: exp.activeVariantShortUid,
      }))
    );

    const hasChanged =
      aliasesKey !== lastLoggedAliasesRef.current ||
      experiencesKey !== lastLoggedExperiencesRef.current;

    if (aliases && aliases.length > 0) {
      if (hasChanged) {
        lastLoggedAliasesRef.current = aliasesKey;
        lastLoggedExperiencesRef.current = experiencesKey;
      }

      // Fetch personalized hero content
      fetch(`/api/personalized-hero?aliases=${encodeURIComponent(aliases.join(","))}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.hero) {
            setHero(data.hero);
            setIsPersonalized(true);

            if (process.env.NODE_ENV === "development" && hasChanged) {
              const exp = experiences[0] || { shortUid: "N/A", activeVariantShortUid: null };
              const resolvedPersona = getBehaviorState().currentPersona;

              console.log(
                `%c🎯 Personalization\n\n` +
                `Resolved Experience:\n` +
                `${(exp as any).name || "Homepage Hero"}\n\n` +
                `Matched Audience:\n` +
                `${(exp as any).audienceName || (exp as any).audience?.name || (resolvedPersona ? `${resolvedPersona} Audience` : "N/A")}\n\n` +
                `Active Variant:\n` +
                `${(exp as any).activeVariantName || (exp.activeVariantShortUid === "0" ? "Default Hero" : resolvedPersona ? `${resolvedPersona} Hero` : "N/A")}\n\n` +
                `Variant Alias:\n` +
                `${aliases.join(", ")}\n\n` +
                `Status:\n` +
                `✓ Personalized content loaded\n\n` +
                `===========================================================`,
                "color: #ec4899;"
              );
            }

            // Trigger SDK impression logs for the active experiences at the edge
            try {
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
    } else {
      if (hasChanged) {
        lastLoggedAliasesRef.current = aliasesKey;
        lastLoggedExperiencesRef.current = experiencesKey;

        // Reset to default CMS hero content
        setHero(fallback);
        setIsPersonalized(false);

        if (process.env.NODE_ENV === "development") {
          const exp = experiences[0] || { shortUid: "N/A", activeVariantShortUid: null };
          console.log(
            `%c🎯 Personalization\n\n` +
            `Resolved Experience:\n` +
            `${(exp as any).name || "Homepage Hero"}\n\n` +
            `Matched Audience:\n` +
            `Default Audience\n\n` +
            `Active Variant:\n` +
            `Default Hero\n\n` +
            `Variant Alias:\n` +
            `None\n\n` +
            `Status:\n` +
            `✓ Fallback content loaded\n\n` +
            `===========================================================`,
            "color: #ec4899;"
          );
        }
      }
    }
  }, [sdk, loading, fallback]);

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

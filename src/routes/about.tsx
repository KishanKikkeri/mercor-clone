import { createFileRoute } from "@tanstack/react-router";
import { PageHero } from "@/components/PageHero";
import { SectionHeader } from "@/components/SectionHeader";
import { CTASection } from "@/components/CTASection";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Mercor" },
      {
        name: "description",
        content:
          "Mercor is a modern job platform connecting people with meaningful work across the world's most innovative companies.",
      },
      { property: "og:title", content: "About — Mercor" },
      {
        property: "og:description",
        content:
          "Connecting people with work that matters at the world's most innovative companies.",
      },
      { property: "og:url", content: "/about" },
    ],
    links: [{ rel: "canonical", href: "/about" }],
  }),
  component: AboutPage,
});

const values = [
  {
    title: "Opportunity",
    body: "We believe great work should be accessible to talented people wherever they live. Every role we list is a real door to walk through.",
  },
  {
    title: "Simplicity",
    body: "Job hunting is stressful enough. Our platform strips away noise so you can focus on the roles that actually fit.",
  },
  {
    title: "Trust",
    body: "We only work with companies we'd recommend to a friend. Clear descriptions, honest compensation, and no dark patterns.",
  },
];

const steps = [
  {
    n: "01",
    title: "Explore Categories",
    body: "Browse open roles by field of interest and discipline.",
  },
  {
    n: "02",
    title: "Find the Right Opportunity",
    body: "Read full job descriptions, team details, and company context.",
  },
  {
    n: "03",
    title: "Apply",
    body: "Click Apply on any role and take the next step in your career.",
  },
];

function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Mercor"
        title="Connecting people with work that matters."
        subtitle="We're building the modern home for opportunities at the world's most ambitious teams."
      />

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader title="Our mission" />
        <div className="mt-6 space-y-4 text-base leading-relaxed text-slate-300">
          <p>
            Careers are shaped by the opportunities you can actually see. Too many
            talented people never hear about the roles that would change their lives —
            not because they aren't qualified, but because the market is fragmented,
            noisy, and hard to navigate.
          </p>
          <p>
            Mercor exists to fix that. We curate roles from the teams doing the most
            interesting work in tech, present them with the context you need to decide,
            and get out of your way. No spam, no dark patterns, no games — just a
            clean path from curiosity to conversation.
          </p>
        </div>
      </section>

      <section className="border-t border-slate-800 bg-slate-950/40">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
          <SectionHeader title="What we believe" subtitle="The principles behind everything we build." />
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {values.map((v) => (
              <div
                key={v.title}
                className="rounded-xl border border-slate-800 bg-slate-950/60 p-6"
              >
                <h3 className="text-lg font-semibold text-white">{v.title}</h3>
                <p className="mt-2 text-sm text-slate-400">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 sm:py-24 lg:px-8">
        <SectionHeader title="How it works" align="center" />
        <div className="mx-auto mt-12 grid max-w-5xl gap-6 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="rounded-xl border border-slate-800 bg-slate-950/60 p-6">
              <div className="font-mono text-sm text-blue-400">{s.n}</div>
              <h3 className="mt-3 text-lg font-semibold text-white">{s.title}</h3>
              <p className="mt-2 text-sm text-slate-400">{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <CTASection
        headline="Ready to explore what's out there?"
        buttonLabel="Explore Jobs"
        buttonHref="/jobs"
      />
    </div>
  );
}

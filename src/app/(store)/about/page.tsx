import { Metadata } from "next"

export const metadata: Metadata = {
  title: "About Us | Zero Limit",
  description: "Learn about Zero Limit — premium fashion for the bold and confident.",
}

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-3xl">
      <div className="text-center mb-16">
        <p className="text-[11px] tracking-[0.4em] uppercase text-muted-foreground mb-3">Our Story</p>
        <h1 className="text-3xl md:text-4xl font-light mb-4">About Zero Limit</h1>
      </div>

      <div className="prose prose-neutral dark:prose-invert max-w-none space-y-12">
        <section>
          <h2 className="text-2xl font-light mb-4">Beyond Limits. Beyond Style.</h2>
          <p className="text-muted-foreground leading-relaxed">
            Zero Limit was born from a simple belief: fashion should be fearless. We create premium streetwear
            and essentials for people who refuse to blend in — those who set their own standards and break through
            every boundary.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">Our Mission</h2>
          <p className="text-muted-foreground leading-relaxed">
            We&apos;re here to redefine contemporary fashion in Nigeria and beyond. Every piece we design combines
            premium fabrics with bold aesthetics, creating clothing that speaks to confidence, individuality,
            and the refusal to settle for less.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">Quality First</h2>
          <p className="text-muted-foreground leading-relaxed">
            From our graphic tees to our checkered shirts and quarter zips, every Zero Limit product goes through
            rigorous quality checks. We source the finest materials and work with skilled craftspeople to ensure
            each piece meets our exacting standards.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-light mb-4">Join the Movement</h2>
          <p className="text-muted-foreground leading-relaxed">
            Zero Limit isn&apos;t just a brand — it&apos;s a community of like-minded individuals who believe in pushing
            boundaries. Follow us on social media and be part of the story.
          </p>
        </section>
      </div>
    </div>
  )
}

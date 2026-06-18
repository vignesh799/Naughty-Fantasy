import Link from "next/link";
import { ArrowUpRight, Flame, HeartHandshake, MoonStar } from "lucide-react";

const stories = [
  {
    title: "Dress the mood",
    copy: "Lace, satin, and sculpted silhouettes designed to turn getting ready into its own ritual.",
    href: "/categories/lingerie",
    icon: MoonStar,
    tone: "story-pink",
  },
  {
    title: "Play together",
    copy: "Curated couples edits made for curiosity, communication, and unforgettable nights in.",
    href: "/categories/couples-collection",
    icon: HeartHandshake,
    tone: "story-teal",
  },
  {
    title: "Enter the fantasy",
    copy: "Masks, prompts, and polished accessories that invite imagination without losing elegance.",
    href: "/categories/fantasy-collections",
    icon: Flame,
    tone: "story-gold",
  },
];

export function SensualStory() {
  return (
    <section className="overflow-hidden bg-[#090508] py-16 text-white">
      <div className="container-pad">
        <div className="max-w-2xl">
          <p className="text-sm font-semibold uppercase text-[#ff4c91]">Set the scene</p>
          <h2 className="mt-3 text-3xl font-semibold md:text-5xl">Desire has more than one color.</h2>
          <p className="mt-4 text-base text-white/65 md:text-lg">
            Explore a more expressive edit of intimate style, shared play, and private wellness.
          </p>
        </div>
        <div className="mt-10 grid gap-px overflow-hidden rounded-lg border border-white/10 bg-white/10 md:grid-cols-3">
          {stories.map((story) => (
            <Link key={story.title} href={story.href} className={`group relative min-h-72 overflow-hidden bg-[#0d080c] p-6 ${story.tone}`}>
              <story.icon className="size-8 text-white/90" />
              <div className="absolute inset-x-6 bottom-6">
                <div className="flex items-center justify-between gap-4">
                  <h3 className="text-2xl font-semibold">{story.title}</h3>
                  <ArrowUpRight className="size-5 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" />
                </div>
                <p className="mt-3 max-w-sm text-sm leading-6 text-white/65">{story.copy}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

import { Link } from "@remix-run/react";

/** Closing band: the headline sits on a looping fight, a zombie losing health while numbers drift off it. */
const floaters = [
  {
    text: "-6.0",
    color: "#ff7b7b",
    left: "-4.5rem",
    top: "-6.5rem",
    delay: "0s",
    size: "text-3xl",
    weight: 700,
  },
  {
    text: "-9.0",
    color: "#ff3030",
    left: "0.5rem",
    top: "-8.5rem",
    delay: "0.9s",
    size: "text-5xl",
    weight: 800,
  },
  {
    text: "-3.0",
    color: "#ffd700",
    left: "4rem",
    top: "-5.5rem",
    delay: "1.8s",
    size: "text-3xl",
    weight: 700,
  },
  {
    text: "-6.0",
    color: "#ff7b7b",
    left: "-2.5rem",
    top: "-9.5rem",
    delay: "2.7s",
    size: "text-3xl",
    weight: 700,
  },
  {
    text: "-2.0",
    color: "#50c878",
    left: "2.5rem",
    top: "-7.5rem",
    delay: "3.6s",
    size: "text-2xl",
    weight: 700,
  },
];

export function FinalCta() {
  return (
    <div className="relative min-h-[30rem] overflow-hidden rounded-3xl bg-[#1c2230] text-[#eceef2] lg:min-h-[34rem] 2xl:min-h-[40rem]">
      <div className="absolute inset-x-0 bottom-0 h-20 bg-[#2b3a2c]" aria-hidden="true" />
      <div className="absolute inset-x-0 bottom-20 h-3 bg-[#41703b]" aria-hidden="true" />

      <div className="relative z-10 flex h-full min-h-[30rem] flex-col justify-between gap-10 p-8 sm:p-12 lg:min-h-[34rem] lg:p-16 2xl:min-h-[40rem]">
        <div className="max-w-2xl">
          <h2 className="font-heading text-[clamp(2.5rem,5vw,6rem)]">Fights worth watching.</h2>
          <p className="mt-5 max-w-lg text-lg leading-relaxed text-[#b8bec9] 2xl:text-xl">
            Free and open source. Install it in a minute, tune every number, and tell us what you
            would change.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 pb-24 lg:pb-20">
          <Link
            to="/downloads"
            className="inline-flex items-center rounded-full bg-primary-600 px-8 py-4 text-base font-semibold text-white transition-colors hover:bg-primary-500"
          >
            Download VitalStrike
          </Link>
          <a
            href="https://discord.gg/b4nxvp8NcH"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center rounded-full bg-white/10 px-8 py-4 text-base font-semibold transition-colors hover:bg-white/20"
          >
            Join the Discord
          </a>
          <span className="px-2 text-[15px] text-[#9aa1ad]">Paper 26.1+ · Java 25 · GPL-3.0</span>
        </div>
      </div>

      {/* the fight, bottom right */}
      <div
        aria-hidden="true"
        className="absolute bottom-[5.75rem] right-[10%] z-0 hidden sm:block lg:right-[14%]"
      >
        <div className="relative flex flex-col items-center">
          <div className="relative h-0 w-0">
            {floaters.map((f, i) => (
              <span
                key={i}
                className={`absolute whitespace-nowrap tabular-nums motion-safe:animate-[vs-float_3.6s_ease-out_infinite] motion-safe:opacity-0 ${f.size}`}
                style={{
                  color: f.color,
                  left: f.left,
                  top: f.top,
                  animationDelay: f.delay,
                  fontWeight: f.weight,
                }}
              >
                {f.text}
              </span>
            ))}
          </div>

          <div className="mb-3 flex items-center gap-2 text-sm">
            <div className="h-3.5 w-[6.75rem] overflow-hidden rounded-[3px] bg-[#3a3f49]">
              <div className="h-full w-full origin-left bg-[#ff4d4d] motion-safe:animate-[vs-hp_7.2s_steps(10,end)_infinite]" />
            </div>
          </div>

          <svg
            viewBox="0 0 16 32"
            shapeRendering="crispEdges"
            className="h-48 w-24 2xl:h-64 2xl:w-32"
          >
            <rect x="4" y="0" width="8" height="8" fill="#6fa55a" />
            <rect x="5" y="3" width="2" height="2" fill="#1b2a17" />
            <rect x="9" y="3" width="2" height="2" fill="#1b2a17" />
            <rect x="6" y="6" width="4" height="1" fill="#46703a" />
            <rect x="4" y="8" width="8" height="12" fill="#2f7a8f" />
            <rect x="0" y="8" width="4" height="12" fill="#6fa55a" />
            <rect x="12" y="8" width="4" height="12" fill="#6fa55a" />
            <rect x="4" y="20" width="4" height="12" fill="#3a3f8f" />
            <rect x="8" y="20" width="4" height="12" fill="#2f337a" />
          </svg>
        </div>
      </div>
    </div>
  );
}

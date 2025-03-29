import { BsLightningCharge } from "react-icons/bs";

export function BlogHeader() {
  return (
    <header className="text-center mb-24 space-y-8">
      <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-300 transform hover:scale-105 group">
        <BsLightningCharge className="w-4 h-4 group-hover:animate-bounce" />
        <span className="text-sm font-semibold tracking-wide">
          Development Updates
        </span>
      </div>
      <div className="space-y-6">
        <h1 className="text-6xl font-black tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-500 dark:from-primary-300 dark:via-primary-400 dark:to-primary-500 animate-gradient-x relative">
          VitalStrike Changelog
          <div className="absolute -top-8 -right-8 w-24 h-24 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
        </h1>
        <p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light relative z-10">
          Explore the journey of continuous improvement and innovation behind
          <span className="font-medium text-primary dark:text-primary-400 ml-2 inline-flex items-center gap-1">
            VitalStrike
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </span>
        </p>
      </div>
    </header>
  );
}

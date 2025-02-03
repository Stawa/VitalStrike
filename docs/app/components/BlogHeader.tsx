import { BsLightningCharge } from "react-icons/bs";

export function BlogHeader() {
	return (
		<header className="text-center mb-24 space-y-8">
			<div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary/15 transition-all duration-300 transform hover:scale-105">
				<BsLightningCharge className="w-4 h-4 animate-pulse" />
				<span className="text-sm font-semibold tracking-wide">Development Updates</span>
			</div>
			<div className="space-y-6">
				<h1 className="text-6xl font-black tracking-tight sm:text-7xl bg-clip-text text-transparent bg-gradient-to-r from-primary via-primary-600 to-primary-500 dark:from-primary-300 dark:via-primary-400 dark:to-primary-500 animate-gradient-x">
					VitalStrike Changelog
				</h1>
				<p className="max-w-2xl mx-auto text-xl text-gray-600 dark:text-gray-300 leading-relaxed font-light">
					Explore the journey of continuous improvement and innovation behind
					<span className="font-medium text-primary dark:text-primary-400 ml-2">VitalStrike</span>
				</p>
			</div>
		</header>
	);
}
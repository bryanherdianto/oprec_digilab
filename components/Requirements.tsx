import { HoverEffect } from "@/components/ui/card-hover-effect";

export function Requirements() {
    return (
        <div id="recruitment" className="max-w-5xl mx-auto px-8 min-h-screen">
            <div className="text-center px-4 py-16 max-w-3xl mx-auto">
                <p className="text-md font-mono font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-black">
                    Joining Criteria
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                    What are the requirements for joining?
                </h2>
                <p className="text-neutral-600 text-base sm:text-lg">
                    Ensure you meet the following criteria to be eligible for joining our Digital Laboratory.
                </p>
            </div>
            <HoverEffect items={projects} />
        </div>
    );
}
export const projects = [
    {
        title: "1. Computer Engineering Student from the 2023 or 2024 cohort",
        description: ""
    },
    {
        title: "2. Minimum GPA of 3.00",
        description: ""
    },
    {
        title: "3. PSD and MBD score above 80",
        description: "*only for 2023 cohort"
    },
];
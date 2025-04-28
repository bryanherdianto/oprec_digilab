"use client";

import Carousel from "@/components/ui/carousel";
import DSD from "../public/DSD.jpg";
import PSD from "../public/PSD.jpg";
import Progdas from "../public/Progdas.jpg";
import Proglan from "../public/Proglan.jpg";
import MBD from "../public/MBD.jpg";
import IOT from "../public/IOT.jpg";

export function Labs() {
    const slideData = [
        {
            title: "Fundamentals of Digital System",
            src: DSD.src,
        },
        {
            title: "Digital System Design",
            src: PSD.src,
        },
        {
            title: "Basic Programming",
            src: Progdas.src,
        },
        {
            title: "Algorithm Programming",
            src: Proglan.src,
        },
        {
            title: "Embedded Systems",
            src: MBD.src,
        },
        {
            title: "Internet of Things",
            src: IOT.src,
        },
    ];
    return (
        <div className="overflow-hidden w-full min-h-screen py-20">
            <div className="text-center px-4 py-16 max-w-3xl mx-auto">
                <p className="text-md font-mono font-medium mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-zinc-900">
                    What labs do we have?
                </p>
                <h2 className="text-4xl sm:text-5xl font-extrabold text-white mb-4">
                    Explore the Labs We Oversee
                </h2>
                <p className="text-neutral-600 text-base sm:text-lg">
                    Our Digital Laboratory manages several key labs covering fundamental and advanced topics designed to equip students with practical skills for the future.
                </p>
            </div>
            <Carousel slides={slideData} />
        </div>
    );
}
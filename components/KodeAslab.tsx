"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".repeat(3).split("");
const EXTRA_OFFSET = 24;

function LetterReel({
    direction,
    trigger,
}: {
    direction: "up" | "down";
    trigger: number;
}) {
    const [translateY, setTranslateY] = useState(0);

    function useLetterHeight() {
        const [letterHeight, setLetterHeight] = useState(128); // default to large screen

        useEffect(() => {
            const checkSize = () => {
                if (window.innerWidth < 640) {
                    setLetterHeight(60);
                } else {
                    setLetterHeight(128);
                }
            };

            checkSize(); // Run once on mount
            window.addEventListener('resize', checkSize); // Watch for changes
            return () => window.removeEventListener('resize', checkSize);
        }, []);

        return letterHeight;
    }

    const LETTER_HEIGHT = useLetterHeight();

    useEffect(() => {
        const middlePosition = 26 * LETTER_HEIGHT;

        if (trigger === 0) {
            setTranslateY(-middlePosition);
            return;
        }

        const minOffset = 5;
        const maxOffset = EXTRA_OFFSET;
        const randomOffset = Math.floor(Math.random() * (maxOffset - minOffset + 1) + minOffset) * LETTER_HEIGHT;
        let targetPosition;

        if (direction === "up") {
            targetPosition = -middlePosition - randomOffset;
        } else {
            targetPosition = -middlePosition + randomOffset;
        }

        targetPosition = Math.max(-(ALPHABET.length * LETTER_HEIGHT - LETTER_HEIGHT), targetPosition);
        targetPosition = Math.min(-LETTER_HEIGHT, targetPosition);

        setTranslateY(targetPosition);
    }, [trigger, direction]);

    return (
        <div className="h-screen w-[40px] sm:w-[100px] relative overflow-hidden">
            <div
                className="absolute top-0 left-0 transition-transform duration-[3000ms] ease-in-out"
                style={{
                    transform: `translateY(${translateY}px)`,
                }}
            >
                {ALPHABET.map((letter, index) => (
                    <div
                        key={`${letter}-${index}`}
                        className="h-[60px] sm:h-[128px] w-[40px] sm:w-[100px] flex items-center justify-center text-5xl sm:text-9xl font-mono text-white"
                        style={{
                            textShadow: "none",
                        }}
                    >
                        {letter}
                    </div>
                ))}
            </div>
        </div>
    );
}

export default function KodeAslab() {
    const [cycle, setCycle] = useState(0);
    const [, setShowLines] = useState(false);
    const router = useRouter();

    const leftDirection = cycle % 2 === 0 ? "up" : "down";
    const rightDirection = cycle % 2 === 0 ? "down" : "up";

    useEffect(() => {
        const cycleLength = 10000;
        const idleDuration = 2000;
        const slideSettleTime = 3000;

        const mainInterval = setInterval(() => {
            setTimeout(() => {
                setShowLines(true);
                setCycle((prev) => prev + 1);
                setTimeout(() => setShowLines(false), 2800);
            }, cycleLength - idleDuration - slideSettleTime);
        }, cycleLength);

        return () => {
            clearInterval(mainInterval);
        };
    }, []);

    return (
        <div className="relative flex items-center justify-center">
            <p className="text-xl sm:text-4xl md:text-5xl font-mono text-white mr-4 sm:mr-7">What&apos;s your code?</p>
            <LetterReel direction={leftDirection} trigger={cycle} />
            <LetterReel direction={rightDirection} trigger={cycle} />
            <Button size="lg" className='font-sans text-lg rounded-full absolute bottom-[25vh]' variant='outline' onClick={() => router.push("/login")}>Join Now</Button>
        </div>
    );
}
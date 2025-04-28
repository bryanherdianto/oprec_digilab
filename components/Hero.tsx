'use client';

import React, { useState, useEffect } from 'react';
import { FlipWords } from "../components/ui/flip-words";

function Hero() {
    const words = ["innovative", "aspirable", "better", "creative", "inspiring"];

    // Add state for countdown values
    const [countdown, setCountdown] = useState({
        days: 15,
        hours: 10,
        minutes: 24,
        seconds: 59
    });

    // Update countdown based on target date
    useEffect(() => {
        // Target date: May 18, 2025 (one month after current date)
        const targetDate = new Date('2025-05-18T00:00:00').getTime();

        const updateCountdown = () => {
            const now = new Date().getTime();
            const timeRemaining = targetDate - now;

            if (timeRemaining <= 0) {
                // Countdown finished
                setCountdown({ days: 0, hours: 0, minutes: 0, seconds: 0 });
                return;
            }

            // Calculate remaining time
            const days = Math.min(99, Math.floor(timeRemaining / (1000 * 60 * 60 * 24)));
            const hours = Math.min(99, Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
            const minutes = Math.min(99, Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60)));
            const seconds = Math.min(99, Math.floor((timeRemaining % (1000 * 60)) / 1000));

            setCountdown({ days, hours, minutes, seconds });
        };

        // Initial update
        updateCountdown();

        // Update every second
        const intervalId = setInterval(updateCountdown, 1000);

        // Cleanup interval on unmount
        return () => clearInterval(intervalId);
    }, []);

    // Format number to always have two digits
    const formatTwoDigits = (num: number): string => {
        return num < 10 ? `0${num}` : `${num}`;
    };

    return (
        <div id="home" className="min-h-screen w-full flex flex-col justify-center items-center gap-8 px-4 pt-30 mx-auto">
            <div className="text-4xl sm:text-5xl font-normal text-neutral-600 dark:text-neutral-400">
                <div>
                    Become<FlipWords words={words} />
                </div>
                <div>
                    by joining <span className="font-bold">Digilab</span>
                </div>
            </div>
            <p className="text-lg font-medium text-neutral-500 dark:text-neutral-400 mt-4">
                Until May 18th 2025
            </p>
            <div className="grid grid-flow-col gap-5 text-center auto-cols-max mt-2">
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.days } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.days} days`}>
                            {formatTwoDigits(countdown.days)}
                        </span>
                    </span>
                    days
                </div>
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.hours } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.hours} hours`}>
                            {formatTwoDigits(countdown.hours)}
                        </span>
                    </span>
                    hours
                </div>
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.minutes } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.minutes} minutes`}>
                            {formatTwoDigits(countdown.minutes)}
                        </span>
                    </span>
                    min
                </div>
                <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                    <span className="countdown font-mono text-4xl sm:text-5xl">
                        <span style={{ "--value": countdown.seconds } as React.CSSProperties} aria-live="polite" aria-label={`${countdown.seconds} seconds`}>
                            {formatTwoDigits(countdown.seconds)}
                        </span>
                    </span>
                    sec
                </div>
            </div>
            <a 
                href="https://drive.google.com/linktian" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="font-sans text-lg rounded-full px-6 py-3 mt-6 bg-transparent border border-white hover:bg-white/10 text-white transition-colors duration-200"
            >
                Download Guidebook
            </a>
        </div>
    )
}

export default Hero
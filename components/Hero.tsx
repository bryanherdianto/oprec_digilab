'use client';

import React, { useState, useEffect } from 'react';
import { FlipWords } from "../components/ui/flip-words";
import { Button } from './ui/button';

function Hero() {
    const words = ["better", "inspiring", "modern"];

    // Add state for countdown values
    const [countdown, setCountdown] = useState({
        days: 15,
        hours: 10,
        minutes: 24,
        seconds: 59
    });

    // Update countdown based on target date
    useEffect(() => {
        // Target date: May 9, 2025 (one month after current date)
        const targetDate = new Date('2025-05-09T00:00:00').getTime();

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
        <div id="home" className="min-h-screen w-full flex flex-col justify-center items-center px-4 pt-20 mx-auto">
            <div className="text-4xl sm:text-5xl font-normal text-neutral-600 dark:text-neutral-400">
                <div>
                    Become<FlipWords words={words} />
                </div>
                <div>
                    people by joining <span className="font-bold">Digilab</span>
                </div>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 lg:gap-12 mt-20">
                <div className="flex flex-col justify-center items-center">
                    <div>
                        Deadline: <strong>May 9, 2025</strong>
                    </div>
                    <div className="grid grid-flow-col gap-5 text-center auto-cols-max">
                        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                            <span className="countdown font-mono text-4xl sm:text-5xl">
                                <span
                                    style={{ "--value": countdown.days } as React.CSSProperties}
                                    aria-live="polite"
                                    aria-label={`${countdown.days} days`}
                                >
                                    {formatTwoDigits(countdown.days)}
                                </span>
                            </span>
                            days
                        </div>
                        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                            <span className="countdown font-mono text-4xl sm:text-5xl">
                                <span
                                    style={{ "--value": countdown.hours } as React.CSSProperties}
                                    aria-live="polite"
                                    aria-label={`${countdown.hours} hours`}
                                >
                                    {formatTwoDigits(countdown.hours)}
                                </span>
                            </span>
                            hours
                        </div>
                        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                            <span className="countdown font-mono text-4xl sm:text-5xl">
                                <span
                                    style={{ "--value": countdown.minutes } as React.CSSProperties}
                                    aria-live="polite"
                                    aria-label={`${countdown.minutes} minutes`}
                                >
                                    {formatTwoDigits(countdown.minutes)}
                                </span>
                            </span>
                            min
                        </div>
                        <div className="flex flex-col p-2 bg-neutral rounded-box text-neutral-content">
                            <span className="countdown font-mono text-4xl sm:text-5xl">
                                <span
                                    style={{ "--value": countdown.seconds } as React.CSSProperties}
                                    aria-live="polite"
                                    aria-label={`${countdown.seconds} seconds`}
                                >
                                    {formatTwoDigits(countdown.seconds)}
                                </span>
                            </span>
                            sec
                        </div>
                    </div>
                </div>
                <div className="flex justify-center items-center px-0">
                    <a>
                        <Button size="lg" className="font-sans text-lg rounded-md" variant="outline">
                            View Booklet →
                        </Button>
                    </a>
                </div>
            </div>

        </div>
    )
}

export default Hero
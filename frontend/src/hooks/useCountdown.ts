import { useEffect, useState } from 'react';

type TimeLeft = {
    years: number;
    days: number;
    hours: number;
    minutes: number;
    seconds: number;
};

export function useCountdown(targetDate: Date | null): TimeLeft {
    const calculateTimeLeft = (): TimeLeft => {
        if (!targetDate) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        const now = new Date();
        const difference = targetDate.getTime() - now.getTime();

        if (difference <= 0) {
            return { years: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
        }

        // Simple calculation approach to avoid edge cases with date manipulations
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = millisecondsPerSecond * 60;
        const millisecondsPerHour = millisecondsPerMinute * 60;
        const millisecondsPerDay = millisecondsPerHour * 24;
        const millisecondsPerYear = millisecondsPerDay * 365; // Approximation

        // Calculate years (approximate)
        const years = Math.floor(difference / millisecondsPerYear);
        const remainingAfterYears = difference % millisecondsPerYear;

        // Calculate remaining components
        const days = Math.floor(remainingAfterYears / millisecondsPerDay);
        const hours = Math.floor(
            (remainingAfterYears % millisecondsPerDay) / millisecondsPerHour
        );
        const minutes = Math.floor(
            (remainingAfterYears % millisecondsPerHour) / millisecondsPerMinute
        );
        const seconds = Math.floor(
            (remainingAfterYears % millisecondsPerMinute) /
                millisecondsPerSecond
        );

        // Ensure all values are non-negative (defensive programming)
        return {
            years: Math.max(0, years),
            days: Math.max(0, days),
            hours: Math.max(0, hours),
            minutes: Math.max(0, minutes),
            seconds: Math.max(0, seconds),
        };
    };

    const [timeLeft, setTimeLeft] = useState<TimeLeft>(calculateTimeLeft());

    useEffect(() => {
        if (!targetDate) return;

        const timer = setInterval(() => {
            setTimeLeft(calculateTimeLeft());
        }, 1000);

        return () => clearInterval(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [targetDate]);

    return timeLeft;
}

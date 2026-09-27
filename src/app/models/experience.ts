export const totalExperience = new Date(2020, 10, 3); // November 3, 2020
export const relevantExperience = new Date(2022, 3, 14);    // April 14, 2022

export function yearsSince(start: Date, now: number): number {
    const msPerYear = 1000 * 60 * 60 * 24 * 365.25; // 365.25 accounts for leap years
    return (now - start.getTime()) / msPerYear;
}
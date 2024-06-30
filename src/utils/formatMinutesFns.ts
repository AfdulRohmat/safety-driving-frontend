import { format } from 'date-fns';

export function formatDecimalMinutes(minutes: any) {
    // Convert minutes to milliseconds
    const milliseconds = minutes * 60 * 1000;

    // Create a new date starting from epoch and adding the milliseconds in UTC
    const date = new Date(milliseconds);

    // Extract hours, minutes, and seconds
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = Math.floor(minutes % 60);
    const seconds = Math.floor((minutes * 60) % 60);

    // Pad the values to ensure two digits
    const paddedHours = String(hours).padStart(2, '0');
    const paddedMinutes = String(remainingMinutes).padStart(2, '0');
    const paddedSeconds = String(seconds).padStart(2, '0');

    // Format the time as HH:mm:ss
    const formattedTime = `${paddedHours}:${paddedMinutes}:${paddedSeconds}`;

    return formattedTime;
}
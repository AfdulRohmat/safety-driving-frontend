import { format, parseISO } from 'date-fns';

// Function to format the date
export function formatDateFns(dateString: any) {
    // Parse the ISO date string
    const date = parseISO(dateString);

    // Format the date to dd:MM:yyyy HH:mm:ss
    const formattedDate = format(date, 'dd-MM-yyyy - HH:mm:ss');

    return formattedDate;
}
// Calculate difference between two Date objects in minutes
export const calculateMinutes = (inTime, outTime) => {
    if (!inTime || !outTime) return 0;

    const diffMs = outTime - inTime;
    if (diffMs < 0) return 0; // Prevent negative time

    return Math.floor(diffMs / 60000);
};

// Convert minutes to "Xh Ym" format
export const formatDuration = (totalMinutes) => {
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;
    return `${hours}h ${minutes}m`;
};

// Format Date object to YYYY-MM-DD string key
export const formatDateKey = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

import * as FileSystem from 'expo-file-system/legacy';
import * as Sharing from 'expo-sharing';
import { getAllRecords } from './storage';

export const exportToCSV = async () => {
    try {
        const data = await getAllRecords();
        const records = Object.values(data).sort((a, b) => new Date(b.date) - new Date(a.date));

        if (records.length === 0) {
            return false; // No data
        }

        // CSV Header
        let csvContent = "Date,In Time,Out Time,Total Minutes,Total Hours\n";

        // CSV Rows
        records.forEach(record => {
            const date = record.date;
            const inTime = new Date(record.inTime).toLocaleTimeString();
            const outTime = new Date(record.outTime).toLocaleTimeString();
            const totalMinutes = record.totalMinutes;
            const totalHours = (totalMinutes / 60).toFixed(2);

            csvContent += `${date},${inTime},${outTime},${totalMinutes},${totalHours}\n`;
        });

        // Create file
        const fileUri = FileSystem.documentDirectory + 'office_hours_history.csv';
        await FileSystem.writeAsStringAsync(fileUri, csvContent, { encoding: 'utf8' });

        // Share
        if (await Sharing.isAvailableAsync()) {
            await Sharing.shareAsync(fileUri);
            return true;
        } else {
            console.log("Sharing is not available");
            return false;
        }
    } catch (error) {
        console.error("Error exporting CSV:", error);
        throw error;
    }
};

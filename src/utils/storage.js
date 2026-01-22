import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@office_hours_logs';

// Save a new record or update an existing one for a specific date
export const saveRecord = async (dateKey, record) => {
    try {
        const existingData = await getAllRecords();
        const updatedData = { ...existingData, [dateKey]: record };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedData));
        return true;
    } catch (e) {
        console.error('Failed to save record', e);
        return false;
    }
};

// Get all records
export const getAllRecords = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
        return jsonValue != null ? JSON.parse(jsonValue) : {};
    } catch (e) {
        console.error('Failed to fetch records', e);
        return {};
    }
};

// Clear all data (optional utility)
export const clearAllData = async () => {
    try {
        await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (e) {
        console.error('Failed to clear data', e);
    }
};

// Delete a specific record by date key
export const deleteRecord = async (dateKey) => {
    try {
        const existingData = await getAllRecords();
        if (existingData[dateKey]) {
            delete existingData[dateKey];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(existingData));
            return true;
        }
        return false;
    } catch (e) {
        console.error('Failed to delete record', e);
        return false;
    }
};

const RATE_KEY = '@office_hours_rate';

// Save hourly rate
export const saveHourlyRate = async (rate) => {
    try {
        await AsyncStorage.setItem(RATE_KEY, rate.toString());
        return true;
    } catch (e) {
        console.error('Failed to save rate', e);
        return false;
    }
};

// Get hourly rate
export const getHourlyRate = async () => {
    try {
        const rate = await AsyncStorage.getItem(RATE_KEY);
        return rate || '';
    } catch (e) {
        console.error('Failed to get rate', e);
        return '';
    }
};

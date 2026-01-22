import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { getAllRecords, clearAllData, deleteRecord, saveHourlyRate, getHourlyRate } from '../utils/storage';
import { formatDuration } from '../utils/calculations';
import WeeklyChart from '../components/WeeklyChart';
import { exportToCSV } from '../utils/export';
import * as Haptics from 'expo-haptics';

export default function HistoryScreen() {
    const [allRecords, setAllRecords] = useState({});
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const [filteredRecords, setFilteredRecords] = useState([]);
    const [totalMinutes, setTotalMinutes] = useState(0);
    const [hourlyRate, setHourlyRate] = useState('');
    const [salary, setSalary] = useState(0);

    // Initial Load
    useFocusEffect(
        useCallback(() => {
            loadData();
            loadRate();
        }, [])
    );

    const loadRate = async () => {
        const savedRate = await getHourlyRate();
        if (savedRate) setHourlyRate(savedRate);
    };

    const handleRateChange = (text) => {
        setHourlyRate(text);
        saveHourlyRate(text);
    };

    useEffect(() => {
        filterDataByMonth();
    }, [allRecords, currentMonth]);

    const loadData = async () => {
        const data = await getAllRecords();
        setAllRecords(data);
    };

    const filterDataByMonth = () => {
        const year = currentMonth.getFullYear();
        const month = currentMonth.getMonth();

        const recordsArray = Object.values(allRecords).filter(record => {
            const recordDate = new Date(record.date);
            return recordDate.getFullYear() === year && recordDate.getMonth() === month;
        }).sort((a, b) => new Date(b.date) - new Date(a.date));

        setFilteredRecords(recordsArray);

        const total = recordsArray.reduce((sum, record) => sum + record.totalMinutes, 0);
        setTotalMinutes(total);
        setSalary(0);
    };

    const calculateSalary = () => {
        if (!hourlyRate) {
            Alert.alert('Input Error', 'Please enter an hourly rate.');
            return;
        }
        const rate = parseFloat(hourlyRate);
        if (isNaN(rate)) {
            Alert.alert('Input Error', 'Invalid hourly rate.');
            return;
        }

        const totalHours = totalMinutes / 60;
        const estimatedSalary = totalHours * rate;
        setSalary(estimatedSalary.toFixed(2));
    };

    const changeMonth = (offset) => {
        const newDate = new Date(currentMonth);
        newDate.setMonth(newDate.getMonth() + offset);
        setCurrentMonth(newDate);
    };

    const handleExport = async () => {
        try {
            await exportToCSV();
        } catch (e) {
            Alert.alert('Error', 'Failed to export data.');
        }
    };

    const handleClearData = async () => {
        Alert.alert(
            "Reset Data",
            "Are you sure you want to delete all history? This cannot be undone.",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete All",
                    style: "destructive",
                    onPress: async () => {
                        await clearAllData();
                        loadData();
                        setSalary(0);
                    }
                }
            ]
        );
    };

    const handleDeleteRecord = (dateKey) => {
        Alert.alert(
            "Delete Entry",
            `Are you sure you want to delete the record for ${dateKey}?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    style: "destructive",
                    onPress: async () => {
                        const success = await deleteRecord(dateKey);
                        if (success) {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                            loadData(); // Reload to refresh list and totals
                        } else {
                            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
                            Alert.alert('Error', 'Failed to delete record.');
                        }
                    }
                }
            ]
        );
    };

    const renderItem = ({ item }) => (
        <View style={styles.recordCard}>
            <View style={styles.recordHeader}>
                <Text style={styles.recordDate}>{new Date(item.date).toLocaleDateString([], { weekday: 'short', day: '2-digit', month: 'short' })}</Text>
                <TouchableOpacity onPress={() => handleDeleteRecord(item.date)}>
                    <Text style={{ fontSize: 16 }}>🗑️</Text>
                </TouchableOpacity>
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                <Text style={styles.recordDuration}>{formatDuration(item.totalMinutes)}</Text>
            </View>
            <View style={styles.recordDetails}>
                <Text style={styles.recordTimeLabel}>In: <Text style={styles.recordTimeValue}>{new Date(item.inTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></Text>
                <Text style={styles.recordTimeLabel}>Out: <Text style={styles.recordTimeValue}>{new Date(item.outTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text></Text>
            </View>
        </View>
    );

    // Memoize the header to prevent re-renders of the TextInput when scrolling or updating unrelated state
    const ListHeader = useMemo(() => {
        return (
            <View>
                {/* Month Navigator */}
                <View style={styles.monthNavContainer}>
                    <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(-1)}>
                        <Text style={styles.navButtonText}>←</Text>
                    </TouchableOpacity>
                    <View style={styles.monthLabelContainer}>
                        <Text style={styles.monthTitle}>
                            {currentMonth.toLocaleDateString('default', { month: 'long', year: 'numeric' })}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.navButton} onPress={() => changeMonth(1)}>
                        <Text style={styles.navButtonText}>→</Text>
                    </TouchableOpacity>
                </View>

                {/* Weekly Chart */}
                <WeeklyChart data={filteredRecords.map(r => ({ date: r.date, hours: r.totalMinutes / 60 }))} />

                {/* Summary Card */}
                <View style={styles.summaryCard}>
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Month Total</Text>
                        <Text style={styles.totalValue}>{formatDuration(totalMinutes)}</Text>
                    </View>

                    <View style={styles.divider} />

                    <View style={styles.salarySection}>
                        <View style={styles.inputWrapper}>
                            <Text style={styles.currencySymbol}>₹</Text>
                            <TextInput
                                style={styles.rateInput}
                                placeholder="Rate/Hr"
                                placeholderTextColor="#999"
                                keyboardType="numeric"
                                value={hourlyRate}
                                onChangeText={handleRateChange}
                                returnKeyType="done"
                            />
                        </View>
                        <TouchableOpacity style={styles.calcButton} onPress={calculateSalary}>
                            <Text style={styles.calcButtonText}>Calculate</Text>
                        </TouchableOpacity>
                    </View>

                    {salary > 0 && (
                        <View style={styles.salaryResult}>
                            <Text style={styles.salaryLabel}>Estimated Salary</Text>
                            <Text style={styles.salaryValue}>₹{salary}</Text>
                        </View>
                    )}
                </View>

                {/* List Header */}
                <Text style={styles.sectionHeader}>Daily Records ({filteredRecords.length})</Text>
            </View>
        );
    }, [currentMonth, filteredRecords, totalMinutes, hourlyRate, salary]);
    // ^ explicitly depend on hourlyRate so it updates, but the INPUT component stays mounted if structure matches

    const ListFooter = (
        <View style={styles.footerContainer}>
            <TouchableOpacity style={styles.exportButton} onPress={handleExport}>
                <Text style={styles.exportButtonText}>📂 Export to CSV</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetLink} onPress={handleClearData}>
                <Text style={styles.resetLinkText}>Reset All App Data</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <FlatList
                data={filteredRecords}
                renderItem={renderItem}
                keyExtractor={item => item.date}
                contentContainerStyle={styles.listContent}
                showsVerticalScrollIndicator={false}
                ListHeaderComponent={ListHeader}
                ListFooterComponent={ListFooter}
                ListEmptyComponent={
                    <View style={styles.emptyState}>
                        <Text style={styles.emptyText}>No records found for this month.</Text>
                    </View>
                }
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F7',
    },
    listContent: {
        padding: 20,
        paddingBottom: 40,
    },
    footerContainer: {
        marginTop: 20,
    },
    monthNavContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 6,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 4,
    },
    navButton: {
        padding: 10,
        width: 44,
        alignItems: 'center',
    },
    navButtonText: {
        fontSize: 20,
        color: '#007AFF',
        fontWeight: 'bold',
    },
    monthLabelContainer: {
        flex: 1,
        alignItems: 'center',
    },
    monthTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    summaryCard: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 16,
        marginBottom: 24,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
    },
    totalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    totalLabel: {
        fontSize: 16,
        color: '#3C3C4399', // ios secondary label color
        fontWeight: '500',
    },
    totalValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#1C1C1E',
    },
    divider: {
        height: 1,
        backgroundColor: '#E5E5EA',
        marginBottom: 16,
    },
    salarySection: {
        flexDirection: 'row',
        gap: 12,
    },
    inputWrapper: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#F2F2F7',
        borderRadius: 10,
        paddingHorizontal: 12,
        height: 44,
    },
    currencySymbol: {
        fontSize: 16,
        color: '#8E8E93',
        marginRight: 4,
    },
    rateInput: {
        flex: 1,
        fontSize: 16,
        color: '#1C1C1E',
    },
    calcButton: {
        backgroundColor: '#007AFF',
        paddingHorizontal: 16,
        borderRadius: 10,
        justifyContent: 'center',
        height: 44,
    },
    calcButtonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
    },
    salaryResult: {
        marginTop: 16,
        alignItems: 'center',
        backgroundColor: '#F0F9F0',
        padding: 12,
        borderRadius: 10,
    },
    salaryLabel: {
        fontSize: 12,
        color: '#2E7D32',
        fontWeight: '600',
        textTransform: 'uppercase',
        marginBottom: 4,
    },
    salaryValue: {
        fontSize: 24,
        fontWeight: '700',
        color: '#2E7D32',
    },
    sectionHeader: {
        fontSize: 13,
        color: '#8E8E93',
        textTransform: 'uppercase',
        fontWeight: '600',
        marginBottom: 10,
        marginLeft: 4,
    },
    recordCard: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
    },
    recordHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    recordDate: {
        fontSize: 16,
        fontWeight: '600',
        color: '#1C1C1E',
    },
    recordDuration: {
        fontSize: 16,
        fontWeight: '700',
        color: '#007AFF',
    },
    recordDetails: {
        flexDirection: 'row',
        gap: 16,
    },
    recordTimeLabel: {
        fontSize: 14,
        color: '#8E8E93',
    },
    recordTimeValue: {
        color: '#3C3C43',
        fontWeight: '500',
    },
    emptyState: {
        padding: 40,
        alignItems: 'center',
    },
    emptyText: {
        color: '#8E8E93',
        fontSize: 16,
    },
    exportButton: {
        backgroundColor: '#fff',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 10,
        borderWidth: 1,
        borderColor: '#007AFF',
    },
    exportButtonText: {
        color: '#007AFF',
        fontSize: 16,
        fontWeight: '600',
    },
    resetLink: {
        padding: 16,
        alignItems: 'center',
    },
    resetLinkText: {
        color: '#FF3B30', // iOS system red
        fontSize: 14,
        fontWeight: '500',
    },
});

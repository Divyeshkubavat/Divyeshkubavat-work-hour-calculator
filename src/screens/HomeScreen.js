import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Haptics from 'expo-haptics';
import { calculateMinutes, formatDuration, formatDateKey } from '../utils/calculations';
import { saveRecord } from '../utils/storage';

export default function HomeScreen({ navigation }) {
  const [date, setDate] = useState(new Date());
  const [inTime, setInTime] = useState(new Date());
  const [outTime, setOutTime] = useState(new Date());

  // Pickers visibility
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showInPicker, setShowInPicker] = useState(false);
  const [showOutPicker, setShowOutPicker] = useState(false);

  // Dashboard State
  const [greeting, setGreeting] = useState('Good Morning');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  const triggerHaptic = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const handleCalculateAndSave = async () => {
    triggerHaptic();

    const totalMinutes = calculateMinutes(inTime, outTime);
    if (totalMinutes <= 0) {
      Alert.alert('Invalid Time', 'Out Time must be after In Time.');
      return;
    }

    const durationStr = formatDuration(totalMinutes);
    const dateKey = formatDateKey(date);

    const record = {
      date: dateKey,
      inTime: inTime.toISOString(),
      outTime: outTime.toISOString(),
      totalMinutes: totalMinutes,
    };

    const success = await saveRecord(dateKey, record);
    if (success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      Alert.alert('Success', `Logged ${durationStr} for ${dateKey}!`);
    } else {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      Alert.alert('Error', 'Failed to save record.');
    }
  };

  // Quick Actions
  const setNowIn = () => {
    triggerHaptic();
    setInTime(new Date());
  };

  const setNowOut = () => {
    triggerHaptic();
    setOutTime(new Date());
  };

  return (
    <View style={styles.container}>
      {/* Header Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>{greeting},</Text>
        <Text style={styles.subGreeting}>Ready to log your work?</Text>
      </View>

      {/* Main Action Card */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{ flex: 1 }}>
            <Text style={styles.label}>Date</Text>
            <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.dateButton}>
              <Text style={styles.dateText}>{date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showDatePicker && (
          <DateTimePicker value={date} mode="date" display="default" onChange={(e, d) => { setShowDatePicker(false); if (d) setDate(d); }} />
        )}

        <View style={styles.divider} />

        {/* Grid for Times */}
        <View style={styles.timeGrid}>
          <View style={styles.timeCol}>
            <Text style={styles.label}>Punch In</Text>
            <TouchableOpacity onPress={() => setShowInPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeText}>{inTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={setNowIn} style={styles.quickBtn}>
              <Text style={styles.quickBtnText}>⚡ NOW</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.verticalDivider} />

          <View style={styles.timeCol}>
            <Text style={styles.label}>Punch Out</Text>
            <TouchableOpacity onPress={() => setShowOutPicker(true)} style={styles.timeButton}>
              <Text style={styles.timeText}>{outTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={setNowOut} style={styles.quickBtn}>
              <Text style={styles.quickBtnText}>⚡ NOW</Text>
            </TouchableOpacity>
          </View>
        </View>

        {showInPicker && (
          <DateTimePicker value={inTime} mode="time" is24Hour={true} onChange={(e, d) => { setShowInPicker(false); if (d) setInTime(d); }} />
        )}
        {showOutPicker && (
          <DateTimePicker value={outTime} mode="time" is24Hour={true} onChange={(e, d) => { setShowOutPicker(false); if (d) setOutTime(d); }} />
        )}
      </View>

      {/* Big Action Button */}
      <TouchableOpacity style={styles.saveBtn} onPress={handleCalculateAndSave}>
        <Text style={styles.saveBtnText}>Save Entry</Text>
      </TouchableOpacity>

      {/* Footer Link */}
      <TouchableOpacity style={styles.historyLink} onPress={() => { triggerHaptic(); navigation.navigate('History'); }}>
        <Text style={styles.historyLinkText}>View History Log →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FE', // Very light blue-grey
    padding: 24,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 30,
  },
  greeting: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1A1A1A',
    letterSpacing: -1,
  },
  subGreeting: {
    fontSize: 18,
    color: '#666',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 8,
    marginBottom: 24,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  dateButton: {
    backgroundColor: '#F2F2F7',
    padding: 12,
    borderRadius: 12,
    alignItems: 'flex-start',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginBottom: 20,
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  timeCol: {
    flex: 1,
  },
  verticalDivider: {
    width: 1,
    backgroundColor: '#E5E5EA',
    marginHorizontal: 20,
  },
  timeButton: {
    marginBottom: 10,
  },
  timeText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  quickBtn: {
    backgroundColor: '#EBF3FF',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  quickBtnText: {
    fontSize: 12,
    color: '#007AFF',
    fontWeight: '700',
  },
  saveBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  historyLink: {
    marginTop: 30,
    alignItems: 'center',
  },
  historyLinkText: {
    color: '#8E8E93',
    fontSize: 16,
    fontWeight: '600',
  },
});

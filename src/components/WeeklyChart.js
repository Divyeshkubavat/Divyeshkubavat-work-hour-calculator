import React from 'react';
import { View, Text, Dimensions, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

export default function WeeklyChart({ data }) {
    if (!data || data.length === 0) {
        return null; // Return null to render nothing if no data
    }

    // Format labels
    const labels = data.map(item => {
        const d = new Date(item.date);
        return `${d.getDate()}`; // Just the day number
    });

    const values = data.map(item => item.hours);

    // Dynamic width calculation: 50px per bar, min screen width
    const screenWidth = Dimensions.get("window").width;
    const dynamicWidth = Math.max(screenWidth - 40, data.length * 50);

    const chartConfig = {
        backgroundGradientFrom: "#fff",
        backgroundGradientTo: "#fff",
        color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
        strokeWidth: 2,
        barPercentage: 0.7,
        decimalPlaces: 1,
        fillShadowGradient: '#007AFF',
        fillShadowGradientOpacity: 1,
        labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Daily Hours Summary</Text>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}>
                <BarChart
                    data={{
                        labels: labels,
                        datasets: [
                            {
                                data: values
                            }
                        ]
                    }}
                    width={dynamicWidth}
                    height={250}
                    yAxisLabel=""
                    yAxisSuffix="h"
                    chartConfig={chartConfig}
                    verticalLabelRotation={0}
                    showValuesOnTopOfBars={true}
                    fromZero={true}
                    style={{ borderRadius: 16 }}
                />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        borderRadius: 16,
        paddingVertical: 15,
        marginBottom: 20,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 4,
        overflow: 'hidden' // Ensure scrollview stays in bounds
    },
    title: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 10,
        color: '#333',
    }
});

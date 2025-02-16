import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { StatusBar } from 'expo-status-bar';

const mockHistory = [
  {
    id: '1',
    from: 'Central Park, NY',
    to: 'Times Square, NY',
    distance: 2.5,
    fare: 6.25,
    date: '2024-02-20',
  },
  {
    id: '2',
    from: 'Brooklyn Bridge',
    to: 'Manhattan Bridge',
    distance: 1.8,
    fare: 4.50,
    date: '2024-02-19',
  },
];

export default function HistoryScreen() {
  const renderItem = ({ item }) => (
    <View style={styles.historyItem}>
      <View style={styles.routeContainer}>
        <Text style={styles.locationText}>{item.from}</Text>
        <Text style={styles.arrow}>→</Text>
        <Text style={styles.locationText}>{item.to}</Text>
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.distanceText}>{item.distance.toFixed(1)} km</Text>
        <Text style={styles.fareText}>${item.fare.toFixed(2)}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <View style={styles.header}>
        <Text style={styles.title}>Trip History</Text>
      </View>
      <FlatList
        data={mockHistory}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e5e5',
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
  },
  listContainer: {
    padding: 15,
  },
  historyItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  routeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  locationText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  arrow: {
    fontSize: 20,
    color: '#007AFF',
    marginHorizontal: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
    paddingTop: 10,
  },
  distanceText: {
    fontSize: 14,
    color: '#666',
  },
  fareText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#007AFF',
  },
  dateText: {
    fontSize: 14,
    color: '#666',
  },
});
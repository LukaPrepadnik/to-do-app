import React from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Task} from '../types';

type Props = NativeStackScreenProps<any>;

const DetailsScreen: React.FC<Props> = ({route}) => {
  const {task} = route.params as {task: Task};

  // Funkcija za formatiranje datuma v bolj berljivo obliko
  const formatDate = (dateString: string) => {
    const [year, month, day] = dateString.split('-');
    return `${day}. ${month}. ${year}`;
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.title}>{task.name}</Text>
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{task.category}</Text>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.detailRow}>
          <Text style={styles.value}>{task.description || 'Brez opisa'}</Text>
        </View>

        <View style={styles.dateContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Rok izvedbe</Text>
            <Text style={styles.dateValue}>{formatDate(task.deadline)}</Text>
          </View>

          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>Opomnik</Text>
            <Text style={styles.dateValue}>{formatDate(task.reminder)}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.taskId}>ID: {task.id}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    backgroundColor: '#fff',
    padding: 20,
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eaeaea',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    flex: 1,
  },
  categoryBadge: {
    backgroundColor: '#e0f2f1',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 16,
    marginLeft: 8,
  },
  categoryText: {
    color: '#00796b',
    fontWeight: '600',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  detailRow: {
    marginBottom: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
    marginBottom: 8,
  },
  value: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
  },
  dateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  dateItem: {
    flex: 1,
    padding: 12,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    marginHorizontal: 4,
    alignItems: 'center',
  },
  dateLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  taskId: {
    marginTop: 8,
    marginBottom: 20,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
    paddingRight: 16,
  },
});

export default DetailsScreen;

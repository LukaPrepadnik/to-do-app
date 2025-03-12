import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Task} from '../types';

type Props = NativeStackScreenProps<any>;

const DetailsScreen: React.FC<Props> = ({route}) => {
  const {task} = route.params as {task: Task};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{task.name}</Text>
      <Text style={styles.category}>{task.category}</Text>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Opis:</Text>
        <Text style={styles.value}>{task.description || 'Brez opisa'}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Rok:</Text>
        <Text style={styles.value}>{task.deadline}</Text>
      </View>

      <View style={styles.detailRow}>
        <Text style={styles.label}>Opomnik:</Text>
        <Text style={styles.value}>{task.reminder}</Text>
      </View>

      <Text style={styles.taskId}>ID: {task.id}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 4,
    color: '#333',
  },
  category: {
    fontSize: 14,
    color: '#666',
    marginBottom: 16,
  },
  detailRow: {
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    paddingBottom: 6,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#444',
  },
  value: {
    fontSize: 16,
    color: '#555',
  },
  taskId: {
    marginTop: 20,
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
  },
});

export default DetailsScreen;

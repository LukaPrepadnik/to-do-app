import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import DatePicker from 'react-native-date-picker';
import {Picker} from '@react-native-picker/picker';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {TaskCategory, Task} from '../types';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

type Props = NativeStackScreenProps<any> & {
  addTask: (newTask: Task) => void;
};

const AddTaskScreen: React.FC<Props> = ({navigation, addTask}) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<TaskCategory>('Delo');
  const [deadline, setDeadline] = useState(new Date());
  const [reminder, setReminder] = useState(new Date());
  const [deadlineOpen, setDeadlineOpen] = useState(false);
  const [reminderOpen, setReminderOpen] = useState(false);

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
    });
    return subscriber;
  }, []);

  const handleAddTask = async () => {
    const newTask: Task = {
      id: String(new Date().getTime()),
      name,
      description,
      category,
      deadline: deadline.toISOString().split('T')[0],
      reminder: reminder.toISOString().split('T')[0],
      userId: user?.uid,
    };

    console.log(newTask);

    await addTask(newTask);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Ime opravila:</Text>
      <TextInput
        style={styles.input}
        value={name}
        onChangeText={setName}
        placeholder="Vnesite ime opravila"
      />

      <Text style={styles.label}>Opis opravila:</Text>
      <TextInput
        style={styles.input}
        value={description}
        onChangeText={setDescription}
        placeholder="Vnesite opis opravila"
      />

      <Text style={styles.label}>Kategorija:</Text>
      <View style={styles.pickerContainer}>
        <Picker
          selectedValue={category}
          onValueChange={itemValue => setCategory(itemValue as TaskCategory)}>
          <Picker.Item label="Šola" value="Šola" />
          <Picker.Item label="Delo" value="Delo" />
          <Picker.Item label="Osebno" value="Osebno" />
          <Picker.Item label="Nakupi" value="Nakupi" />
          <Picker.Item label="Zdravje" value="Zdravje" />
          <Picker.Item label="Drugo" value="Drugo" />
        </Picker>
      </View>

      <Text style={styles.label}>Rok opravila:</Text>
      <TouchableOpacity
        onPress={() => setDeadlineOpen(true)}
        style={styles.dateInput}>
        <Text style={styles.dateText}>
          {deadline.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={deadlineOpen}
        date={deadline}
        onConfirm={date => {
          setDeadline(date);
          setDeadlineOpen(false);
        }}
        onCancel={() => setDeadlineOpen(false)}
      />

      <Text style={styles.label}>Datum opomnika:</Text>
      <TouchableOpacity
        onPress={() => setReminderOpen(true)}
        style={styles.dateInput}>
        <Text style={styles.dateText}>
          {reminder.toISOString().split('T')[0]}
        </Text>
      </TouchableOpacity>
      <DatePicker
        modal
        open={reminderOpen}
        date={reminder}
        onConfirm={date => {
          setReminder(date);
          setReminderOpen(false);
        }}
        onCancel={() => setReminderOpen(false)}
      />

      <TouchableOpacity style={styles.addButton} onPress={handleAddTask}>
        <Text style={styles.addButtonText}>Dodaj opravilo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  label: {
    fontWeight: 'bold',
    marginVertical: 8,
    fontSize: 16,
    color: '#333',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    marginBottom: 16,
    borderRadius: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 5,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  dateText: {
    fontSize: 16,
    color: '#333',
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: '#f9f9f9',
  },
  addButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default AddTaskScreen;

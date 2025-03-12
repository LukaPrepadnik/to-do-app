import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Task} from '../types';

type Props = NativeStackScreenProps<any> & {
  tasks: Task[];
};

const HomeScreen: React.FC<Props> = ({navigation, tasks}) => {
  console.log(tasks);
  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.taskItem}
            onPress={() => navigation.navigate('Details', {task: item})}>
            <Text style={styles.taskName}>{item.name}</Text>
            <Text style={styles.taskDeadline}>Rok: {item.deadline}</Text>
          </TouchableOpacity>
        )}
      />
      <Button
        title="Dodaj opravilo"
        onPress={() => navigation.navigate('AddTask')}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  taskItem: {padding: 15, borderBottomWidth: 1, borderBottomColor: '#ddd'},
  taskName: {fontSize: 18, fontWeight: 'bold'},
  taskDeadline: {fontSize: 14, color: 'gray'},
});

export default HomeScreen;

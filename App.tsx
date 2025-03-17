import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {StyleSheet} from 'react-native';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import AddTask from './screens/AddTask';
import LoginScreen from './screens/Login';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Task} from './types';
//import {initialTasks} from './tasks';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc as FirebaseDoc,
} from '@react-native-firebase/firestore';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  //const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const db = getFirestore();
        const tasksCollection = collection(db, 'tasks');
        const taskSnapshot = await getDocs(tasksCollection);

        if (taskSnapshot.empty) {
          console.log('Zbirka "tasks" je prazna');
        }

        const taskList = taskSnapshot.docs.map(doc => {
          console.log(doc.data());
          return {id: doc.id, ...doc.data()};
        });

        setTasks(taskList);
      } catch (error) {
        console.error('Napaka pri pridobivanju nalog:', error);
      }
    };

    fetchTasks();
  }, []);

  console.log(tasks);

  const addTask = async (newTask: Task) => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'tasks'), {
        name: newTask.name,
        description: newTask.description,
        category: newTask.category,
        deadline: newTask.deadline,
        reminder: newTask.reminder,
      });
      setTasks(prevTasks => [...prevTasks, {...newTask, id: docRef.id}]);
      console.log('Task uspešno dodan v Firestore z ID:', docRef.id);
    } catch (error) {
      console.error('Napaka pri dodajanju taska:', error);
    }
  };

  const deleteTask = async (id: string) => {
    try {
      const db = getFirestore();
      const taskDocRef = FirebaseDoc(db, 'tasks', id);
      await deleteDoc(taskDocRef);
      setTasks(prevTasks => prevTasks.filter(task => task.id !== id));
      console.log('Task uspešno izbrisan iz Firestore:', id);
    } catch (error) {
      console.error('Napaka pri brisanju taska:', error);
    }
  };

  console.log(user);

  const renderScreens = () => (
    <Stack.Navigator>
      {!user ? (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Home"
            options={{
              title: 'Domov',
            }}>
            {props => (
              <HomeScreen {...props} tasks={tasks} deleteTask={deleteTask} />
            )}
          </Stack.Screen>
          <Stack.Screen
            name="Details"
            component={DetailsScreen}
            options={{title: 'Podrobnosti'}}
          />
          <Stack.Screen name="AddTask" options={{title: 'Dodajanje opravila'}}>
            {props => <AddTask {...props} addTask={addTask} />}
          </Stack.Screen>
        </>
      )}
    </Stack.Navigator>
  );

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>{renderScreens()}</NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logoutButton: {
    padding: 10,
  },
  logoutText: {
    fontSize: 16,
    color: '#007BFF',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;

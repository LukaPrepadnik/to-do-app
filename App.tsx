/* eslint-disable react/no-unstable-nested-components */
import React, {useState, useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {StyleSheet, Alert} from 'react-native';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import AddTask from './screens/AddTask';
import LoginScreen from './screens/Login';
import SettingsScreen from './screens/Settings';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {Task} from './types';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';
import {
  getFirestore,
  getDocs,
  collection,
  addDoc,
  deleteDoc,
  doc as FirebaseDoc,
  query,
  where,
} from '@react-native-firebase/firestore';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

messaging().setBackgroundMessageHandler(async remoteMessage => {
  console.log('Message handled in the background!', remoteMessage);
});

const TasksStack = ({tasks, deleteTask, addTask}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="TasksList"
        options={{
          title: 'Opravila',
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
    </Stack.Navigator>
  );
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<any[]>([]);
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const setupPushNotifications = async () => {
      const token = await messaging().getToken();
      console.log('FCM Token:', token);

      return messaging().onTokenRefresh(newToken => {
        console.log('FCM Token refreshed:', newToken);
        // You could send this to your backend if needed
      });
    };

    const unsubscribe = setupPushNotifications();
    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      // Handle the message for when the app is in foreground
      console.log('Received foreground message:', remoteMessage);

      if (remoteMessage.notification) {
        Alert.alert(
          remoteMessage.notification.title || 'Novo sporočilo',
          remoteMessage.notification.body || '',
        );
      }
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'App opened from quit state by notification:',
            remoteMessage,
          );
        }
      });
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(userState => {
      setUser(userState);
      setLoading(false);
    });
    return subscriber;
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      // Preveri, če je uporabnik prijavljen
      if (!user) {
        setTasks([]);
        return;
      }

      try {
        const db = getFirestore();
        // Ustvari poizvedbo, ki vrne samo opravila trenutnega uporabnika
        const q = query(
          collection(db, 'tasks'),
          where('userId', '==', user.uid),
        );
        const taskSnapshot = await getDocs(q);
        if (taskSnapshot.empty) {
          console.log('Uporabnik nima opravil');
        }
        const taskList = taskSnapshot.docs.map(doc => {
          return {id: doc.id, ...doc.data()};
        });
        setTasks(taskList);
      } catch (error) {
        console.error('Napaka pri pridobivanju nalog:', error);
      }
    };

    fetchTasks();
  }, [user]);

  const addTask = async (newTask: Task) => {
    try {
      const db = getFirestore();
      const docRef = await addDoc(collection(db, 'tasks'), {
        name: newTask.name,
        description: newTask.description,
        category: newTask.category,
        deadline: newTask.deadline,
        reminder: newTask.reminder,
        userId: newTask.userId,
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

  const TabNavigator = () => {
    return (
      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: '#007BFF',
          tabBarInactiveTintColor: 'gray',
          headerShown: false,
          tabBarIconStyle: {display: 'none'},
          tabBarItemStyle: {justifyContent: 'center'},
          tabBarLabelStyle: {fontSize: 18, marginTop: 10},
        }}>
        <Tab.Screen
          name="Tasks"
          options={{
            tabBarLabel: 'Opravila',
            tabBarIcon: () => null,
          }}>
          {() => (
            <TasksStack
              tasks={tasks}
              deleteTask={deleteTask}
              addTask={addTask}
            />
          )}
        </Tab.Screen>
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarLabel: 'Profil',
            tabBarIcon: () => null,
          }}
        />
      </Tab.Navigator>
    );
  };

  if (loading) {
    return null;
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      <NavigationContainer>
        {!user ? (
          <Stack.Navigator>
            <Stack.Screen
              name="Login"
              component={LoginScreen}
              options={{headerShown: false}}
            />
          </Stack.Navigator>
        ) : (
          <TabNavigator />
        )}
      </NavigationContainer>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});

export default App;

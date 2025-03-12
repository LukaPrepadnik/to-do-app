import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import DetailsScreen from './screens/Details';
import {useState} from 'react';
import {Task} from './types';
import {initialTasks} from './tasks';
import AddTask from './screens/AddTask';

const Stack = createNativeStackNavigator();

const App: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const addTask = (newTask: Task) => {
    setTasks(prevTasks => [...prevTasks, newTask]);
  };

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{title: 'Domov'}}>
          {props => <HomeScreen {...props} tasks={tasks} />}
        </Stack.Screen>
        <Stack.Screen
          name="Details"
          component={DetailsScreen}
          options={{title: 'Podrobnosti'}}
        />
        <Stack.Screen name="AddTask" options={{title: 'Dodajajanje opravila'}}>
          {props => <AddTask {...props} addTask={addTask} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;

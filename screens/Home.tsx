import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Button,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Task} from '../types';
import {RectButton, Swipeable} from 'react-native-gesture-handler';
import React, {useState, useRef, useEffect} from 'react';
import messaging from '@react-native-firebase/messaging';

type Props = NativeStackScreenProps<any> & {
  tasks: Task[];
  deleteTask: (id: string) => void;
};

const HomeScreen: React.FC<Props> = ({navigation, tasks, deleteTask}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState<string | null>(null);
  const [notificationMessage, setNotificationMessage] = useState<string | null>(
    null,
  );
  const swipeableRef = useRef<any>(null);

  useEffect(() => {
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification) {
        setNotificationMessage(
          remoteMessage.notification.body || 'Novo sporočilo',
        );
      }
    });

    return unsubscribe;
  }, []);

  const confirmDelete = (id: string) => {
    setTaskToDelete(id);
    setModalVisible(true);
  };

  const handleConfirmDelete = async () => {
    if (taskToDelete) {
      await deleteTask(taskToDelete);
      setTaskToDelete(null);
    }
    setModalVisible(false);
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const handleCancelDelete = () => {
    setTaskToDelete(null);
    setModalVisible(false);
    if (swipeableRef.current) {
      swipeableRef.current.close();
    }
  };

  const renderRightAction = (taskId: string) => (
    <RectButton
      style={styles.deleteButton}
      onPress={() => confirmDelete(taskId)}>
      <Text style={styles.deleteText}>Izbriši</Text>
    </RectButton>
  );

  return (
    <View style={styles.container}>
      {notificationMessage && (
        <View style={styles.notificationBanner}>
          <Text style={styles.notificationText}>{notificationMessage}</Text>
        </View>
      )}

      <FlatList
        data={tasks}
        keyExtractor={item => item.id}
        renderItem={({item}) => (
          <Swipeable
            ref={ref => {
              if (item.id === taskToDelete) {
                swipeableRef.current = ref;
              }
            }}
            renderRightActions={() => renderRightAction(item.id)}
            friction={2}
            overshootRight={false}>
            <TouchableOpacity
              style={styles.taskItem}
              onPress={() => navigation.navigate('Details', {task: item})}>
              <Text style={styles.taskName}>{item.name}</Text>
              <Text style={styles.taskDeadline}>Rok: {item.deadline}</Text>
            </TouchableOpacity>
          </Swipeable>
        )}
      />

      <Button
        title="Dodaj opravilo"
        onPress={() => navigation.navigate('AddTask')}
      />

      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={handleCancelDelete}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>
              Ali ste prepričani, da želite izbrisati to opravilo?
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelDelete}>
                <Text style={styles.buttonText}>Prekliči</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleConfirmDelete}>
                <Text style={[styles.buttonText, styles.confirmText]}>
                  Potrdi
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  notificationBanner: {
    backgroundColor: '#ffeb3b',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  notificationText: {
    textAlign: 'center',
    fontWeight: 'bold',
  },
  taskItem: {
    padding: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  taskName: {fontSize: 18, fontWeight: 'bold'},
  taskDeadline: {fontSize: 14, color: 'gray'},
  deleteButton: {
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
  },
  deleteText: {color: 'white', fontWeight: 'bold', padding: 10},
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalText: {
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    justifyContent: 'space-between',
  },
  modalButton: {
    borderRadius: 5,
    padding: 10,
    elevation: 2,
    marginHorizontal: 10,
    minWidth: 100,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#FF3B30',
  },
  cancelButton: {
    backgroundColor: '#E5E5EA',
  },
  buttonText: {
    fontWeight: 'bold',
  },
  confirmText: {
    color: 'white',
  },
});

export default HomeScreen;

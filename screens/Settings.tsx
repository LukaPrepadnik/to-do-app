import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {MMKV} from 'react-native-mmkv';
import auth from '@react-native-firebase/auth';
import messaging from '@react-native-firebase/messaging';

export const storage = new MMKV();
const MOTIVATION_TOPIC = 'motivational_messages';

const SettingsScreen: React.FC = () => {
  const [receiveMotivationalMessages, setReceiveMotivationalMessages] =
    useState(false);
  const user = auth().currentUser;

  useEffect(() => {
    const requestPermissions = async () => {
      const authStatus = await messaging().requestPermission();
      const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

      if (enabled) {
        console.log('Notification permissions granted');
      } else {
        console.log('Notification permissions denied');
      }
    };

    requestPermissions();
  }, []);

  useEffect(() => {
    const loadSubscriptionStatus = async () => {
      if (user) {
        const savedSetting = storage.getBoolean(
          `motivational_messages_${user.uid}`,
        );
        if (savedSetting !== undefined) {
          setReceiveMotivationalMessages(savedSetting);

          // Sync the UI state with the actual FCM subscription
          // This ensures the UI reflects the true subscription state
          if (savedSetting) {
            await messaging().subscribeToTopic(MOTIVATION_TOPIC);
          } else {
            await messaging().unsubscribeFromTopic(MOTIVATION_TOPIC);
          }
        }
      }
    };

    loadSubscriptionStatus();
  }, [user]);

  const toggleMotivationalMessages = async (value: boolean) => {
    if (!user) return;

    try {
      if (value) {
        // Subscribe to motivational messages topic
        await messaging().subscribeToTopic(MOTIVATION_TOPIC);
        console.log('Subscribed to motivational messages topic');
      } else {
        // Unsubscribe from motivational messages topic
        await messaging().unsubscribeFromTopic(MOTIVATION_TOPIC);
        console.log('Unsubscribed from motivational messages topic');
      }

      // Update state and save preference
      setReceiveMotivationalMessages(value);
      storage.set(`motivational_messages_${user.uid}`, value);

      Alert.alert(
        'Nastavitve shranjene',
        `Prejemanje motivacijskih sporočil ${
          value ? 'vključeno' : 'izključeno'
        }.`,
        [{text: 'V redu'}],
      );
    } catch (error) {
      console.error('Error toggling subscription:', error);
      Alert.alert(
        'Napaka',
        'Prišlo je do napake pri spreminjanju nastavitev. Poskusite znova.',
        [{text: 'V redu'}],
      );
    }
  };

  const handleLogout = async () => {
    try {
      await auth().signOut();
    } catch (error) {
      console.error('Napaka pri odjavi:', error);
    }
  };

  console.log(storage);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Nastavitve uporabniškega računa</Text>

      <View style={styles.userInfoContainer}>
        <Text style={styles.userInfoLabel}>E-poštni naslov:</Text>
        <Text style={styles.userInfoValue}>{user?.email}</Text>
      </View>

      <View style={styles.settingCard}>
        <Text style={styles.settingTitle}>Motivacijska sporočila</Text>
        <View style={styles.settingRow}>
          <Text style={styles.settingDescription}>
            Prejemanje dnevnih motivacijskih sporočil
          </Text>
          <Switch
            value={receiveMotivationalMessages}
            onValueChange={toggleMotivationalMessages}
            trackColor={{false: '#767577', true: '#81b0ff'}}
            thumbColor={receiveMotivationalMessages ? '#007BFF' : '#f4f3f4'}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Odjava</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  userInfoContainer: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  userInfoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  userInfoValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
  },
  settingCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#333',
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  settingDescription: {
    fontSize: 16,
    color: '#555',
    flex: 1,
    paddingRight: 10,
  },
  logoutButton: {
    backgroundColor: '#FF3B30',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SettingsScreen;

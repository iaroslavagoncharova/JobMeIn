import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

const Chats = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  return (
    <View style={styles.container}>
      <View style={styles.chatsContainer}>
        <View style={styles.msgIncCount}>
          <Text style={styles.pageHeader}>Messages</Text>
          <Text style={styles.unread}>3</Text>
        </View>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => {
            navigation.navigate('Keskustelu');
          }}
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            size={70}
            style={styles.profilePicture}
          />
          <View style={styles.chatInfo}>
            <Text id="name" style={styles.chatParticipant}>
              Käyttäjä
            </Text>
            <Text id="msg" style={styles.message}>
              Hei! Olisiko kiinnostunut...
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => {
            navigation.navigate('Keskustelu');
          }}
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            size={70}
            style={styles.profilePicture}
          />
          <View style={styles.chatInfo}>
            <Text id="name" style={styles.chatParticipant}>
              Käyttäjä
            </Text>
            <Text id="msg" style={styles.message}>
              Hei! Olisiko kiinnostunut...
            </Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.chat}
          onPress={() => {
            navigation.navigate('Keskustelu');
          }}
        >
          <FontAwesomeIcon
            icon={faCircleUser}
            size={70}
            style={styles.profilePicture}
          />
          <View style={styles.chatInfo}>
            <Text id="name" style={styles.chatParticipant}>
              Käyttäjä
            </Text>
            <Text id="msg" style={styles.message}>
              Hei! Olisiko kiinnostunut...
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#5d71c9',
  },
  chatsContainer: {
    flex: 1,
    position: 'relative',
    width: 350,
    height: 700,
    marginVertical: 50,
    marginHorizontal: 20,
    borderRadius: 30,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  msgIncCount: {
    height: 50,
    marginTop: 20,
    marginLeft: 20,
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'center',
    alignContent: 'center',
  },
  pageHeader: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#004aad',
  },
  unread: {
    marginLeft: 10,
    marginTop: 5,
    paddingHorizontal: 10,
    backgroundColor: '#ff3131',
    color: '#ffffff',
    borderRadius: 50,
    padding: 5,
  },
  chat: {
    flexDirection: 'row',
    marginHorizontal: 20,
    width: 310,
    marginTop: 10,
    borderColor: '#004aad',
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden',
  },
  profilePicture: {
    margin: 10,
    color: '#004aad',
  },
  chatInfo: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  chatParticipant: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  message: {
    fontSize: 15,
    marginLeft: 10,
    marginTop: 5,
  },
});

export default Chats;

import {StyleSheet, Text, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';

const SingleChat = () => {
  return (
    <View style={styles.container}>
      <View style={styles.chatsContainer}>
        <View style={styles.chattingWith}>
          <FontAwesomeIcon
            icon={faCircleUser}
            size={50}
            style={styles.profilePicture}
          />
          <Text style={styles.chatParticipant}>Käyttäjä</Text>
        </View>
        <View style={styles.theirMessage}>
          <Text>Hei! Olisiko kiinnostunut tulemaan meille töihin?</Text>
        </View>
        <View style={styles.myMessage}>
          <Text>Kiitos tarjouksesta, mutta en valitettavasti ehdi.</Text>
        </View>
        <View style={styles.theirMessage}>
          <Text>Onko sinulla jotain muuta mielessä?</Text>
        </View>
        <View style={styles.myMessage}>
          <Text>Ei tällä kertaa, mutta kiitos kysymästä.</Text>
        </View>
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
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  chattingWith: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  profilePicture: {
    margin: 20,
    color: '#004aad',
  },
  chatParticipant: {
    fontSize: 30,
    fontWeight: 'bold',
    marginLeft: 20,
    color: '#004aad',
    textAlignVertical: 'center',
  },
  theirMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    marginLeft: 10,
    marginBottom: 10,
    borderWidth: 1,
    maxWidth: 300,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
  },
  myMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 1,
    maxWidth: 300,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    backgroundColor: '#f4f4f4',
  },
});

export default SingleChat;

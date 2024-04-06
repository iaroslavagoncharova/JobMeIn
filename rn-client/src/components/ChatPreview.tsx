import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {ChatWithMessages} from '../types/DBTypes';

type ChatPreviewProps = {
  item: ChatWithMessages;
  navigation: NavigationProp<ParamListBase>;
};

export const ChatPreview = ({item, navigation}: ChatPreviewProps) => {
  return (
    <TouchableOpacity
      style={styles.chat}
      onPress={() => {
        navigation.navigate('Keskustelu', {chat_id: item.chat_id});
      }}
    >
      <FontAwesomeIcon
        icon={faCircleUser}
        size={70}
        style={styles.profilePicture}
      />
      <View style={styles.chatInfo}>
        <Text id="name" style={styles.chatParticipant}>
          {item.chatting_with.username}
        </Text>
        <Text id="msg" style={styles.message}>
          {item.messages[item.messages.length-1].message_text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
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

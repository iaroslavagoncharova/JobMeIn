import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Alert, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Text} from 'react-native-elements';
import {ChatWithMessages} from '../types/DBTypes';
import {useChats} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

type ChatPreviewProps = {
  item: ChatWithMessages;
  navigation: NavigationProp<ParamListBase>;
};

export const ChatPreview = ({item, navigation}: ChatPreviewProps) => {
  const {deleteChat} = useChats();
  const {update, setUpdate} = useUpdateContext();
  const handleDeleteChat = async (chatId: number) => {
    Alert.alert('Poista keskustelu', 'Haluatko varmasti poistaa keskustelun?', [
      {
        text: 'Peruuta',
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: async () => {
          console.log(chatId, 'chatId');
          const result = await deleteChat(chatId);
          if (result) {
            console.log('Chat deleted');
            setUpdate((prevState) => !prevState);
          }
        },
      },
    ]);
  };
  return (
    <TouchableOpacity
      style={styles.chat}
      onPress={() => {
        navigation.navigate('Keskustelu', {chat_id: item.chat_id});
      }}
      onLongPress={() => {
        handleDeleteChat(item.chat_id);
      }}
    >
      <FontAwesomeIcon
        icon={faCircleUser}
        size={60}
        style={styles.profilePicture}
      />
      <View style={styles.chatInfo}>
        <Text id="name" style={styles.chatParticipant}>
          {item.chatting_with.username}
        </Text>
        {item.messages && item.messages.length > 0 ? (
          <Text id="msg" style={styles.message}>
            {item.messages[item.messages.length - 1].user_id !==
            item.chatting_with.user_id ? (
              <Text style={{fontStyle: 'italic'}}>Sinä: </Text>
            ) : (
              <Text style={{fontStyle: 'italic'}}>
                {item.chatting_with.username}:{' '}
              </Text>
            )}
            {item.messages[item.messages.length - 1].message_text}
          </Text>
        ) : (
          <Text style={styles.newConvo}>Aloita keskustelu!</Text>
        )}
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
  newConvo: {
    fontStyle: 'italic',
    fontSize: 15,
    marginLeft: 10,
    marginTop: 5,
  },
});

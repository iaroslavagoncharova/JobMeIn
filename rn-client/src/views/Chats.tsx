import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {useChats} from '../hooks/apiHooks';
import {ChatPreview} from '../components/ChatPreview';

const Chats = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {chats} = useChats();
  return (
    <View style={styles.container}>
      <View style={styles.chatsContainer}>
        <View style={styles.msgIncCount}>
          <Text style={styles.pageHeader}>Keskustelut</Text>
          <Text style={styles.unread}>{chats?.length ? chats.length : 0}</Text>
        </View>
        {chats ? (
          chats.map((chat) => (
            <ChatPreview
              key={chat.chat_id}
              item={chat}
              navigation={navigation}
            />
          ))
        ) : (
          <Text style={{marginLeft: 20}}>Sinulla ei ole keskusteluja</Text>
        )}
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
    backgroundColor: '#004aad',
    color: '#ffffff',
    borderRadius: 50,
    padding: 5,
  },
});

export default Chats;

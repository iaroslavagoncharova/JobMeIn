import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faCircleUser} from '@fortawesome/free-solid-svg-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Button} from '@rneui/base';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useChats} from '../hooks/apiHooks';
import {ChatPreview} from '../components/ChatPreview';

const Chats = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  const {chats, postAdminChat} = useChats();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const handleAdminChat = async () => {
    const result = await postAdminChat();
    if (result) {
      console.log(result.chat_id, 'chat_id');
      navigation.navigate('Keskustelu', {chat_id: result.chat_id});
    }
  };

  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('chatsInstructions');
    console.log(show, 'show');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('chatsInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);

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
          <Text style={{marginLeft: 20}}>Ei keskusteluja</Text>
        )}
        <TouchableOpacity onPress={handleAdminChat}>
          <Text
            style={{
              marginLeft: 20,
              marginTop: 20,
              color: '#004aad',
              textAlign: 'center',
            }}
          >
            Ongelmia sovelluksen kanssa? Ota yhteyttä ylläpitoon tästä
          </Text>
        </TouchableOpacity>
      </View>
      {showInstructions && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              padding: 20,
              borderRadius: 10,
              margin: 10,
            }}
          >
            <Text style={styles.boldText}>Ohjeet</Text>
            <Text style={styles.text}>
              Tässä näet keskustelut työnantajien/työnhakijoiden kanssa.
              Keskustelu ilmestyy tänne, kun työnantaja on joko swipannut
              oikealle tai hyväksynyt työnhakijan hakemuksen.
            </Text>
            <Text style={styles.text}>
              Voit aloittaa keskustelun painamalla keskustelua. Jos sinulla on
              ongelmia sovelluksen kanssa, voit ottaa yhteyttä ylläpitoon.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.applyButton}
              onPress={() => setShowInstructions(false)}
            />
          </View>
        </View>
      )}
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
  applyButton: {
    margin: 5,
    backgroundColor: '#5d71c9',
    borderColor: '#004AAD',
    borderWidth: 3,
    borderRadius: 12,
  },
  text: {
    fontSize: 16,
    color: '#5d71c9',
    textAlign: 'center',
    margin: 5,
  },
  boldText: {
    fontSize: 16,
    color: '#5d71c9',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
});

export default Chats;

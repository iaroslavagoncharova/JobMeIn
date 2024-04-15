import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircleUser,
  faCircleChevronRight,
  faAngleLeft,
} from '@fortawesome/free-solid-svg-icons';
import {Controller, useForm} from 'react-hook-form';
import {StackNavigationProp} from '@react-navigation/stack';
import {useEffect, useRef, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
  RouteProp,
} from '@react-navigation/native';
import {ChatWithMessages, PostMessage, PostMessageText} from '../types/DBTypes';
import {useChats} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

type RootStackParamList = {
  Keskustelu: {chat_id: number};
  Keskustelut: undefined;
};

type SingleChatRouteProp = RouteProp<RootStackParamList, 'Keskustelu'>;
type SingleChatNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Keskustelu'
>;

type Props = {
  route: SingleChatRouteProp;
  navigation: SingleChatNavigationProp;
};

const SingleChat = ({route}: any) => {
  const props: Props = route.params;
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const chatId: number = route.params.chat_id;
  const {update, setUpdate} = useUpdateContext();
  const {getChatById, thisChat, postMessageToChat} = useChats();
  const values: PostMessageText = {
    message_text: '',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  useEffect(() => {
    getChatById(chatId);
    const interval = setInterval(() => {
      getChatById(chatId);
    }, 5000);

    return () => clearInterval(interval);
  }, [update]);

  const scrollViewRef = useRef<ScrollView>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const edit = async (inputs: PostMessageText) => {
    const data = {
      chat_id: chatId,
      message_text: inputs.message_text,
    };
    await postMessageToChat(data);
    setUpdate((prevState) => !prevState);
    resetForm();
  };

  // testi
  return (
    <View style={styles.container}>
      <View style={styles.chatsContainer}>
        <View style={styles.backContainer}>
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Keskustelut');
            }}
          >
            <FontAwesomeIcon icon={faAngleLeft} size={30} color={'#004aad'} />
          </TouchableOpacity>
        </View>
        {thisChat && (
          <>
            <View style={styles.chattingWith}>
              <FontAwesomeIcon
                icon={faCircleUser}
                size={60}
                style={styles.profilePicture}
              />
              <Text style={styles.chatParticipant}>
                {thisChat.chatting_with.username}
              </Text>
            </View>
            <ScrollView
              style={styles.msgContainer}
              ref={scrollViewRef}
              onContentSizeChange={() =>
                isLoaded && scrollViewRef.current?.scrollToEnd({animated: true})
              }
              onLayout={() => setIsLoaded(true)}
            >
              {thisChat.messages && thisChat.messages.length > 0 ? (
                thisChat.messages.map((message) => (
                  <View
                    key={message.message_id}
                    style={
                      message.user_id === thisChat.chatting_with.user_id
                        ? styles.theirMessage
                        : styles.myMessage
                    }
                  >
                    <Text style={{color: '#ffffff'}}>
                      {message.message_text}
                    </Text>
                  </View>
                ))
              ) : (
                <Text style={styles.startConvo}>
                  Aloita keskustelu käyttäjän {thisChat.chatting_with.username}{' '}
                  kanssa!
                </Text>
              )}
            </ScrollView>
          </>
        )}
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={{
                  backgroundColor: '#f4f4f4',
                  borderRadius: 5,
                  width: '90%',
                }}
                placeholder="Kirjoita jotain..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                autoCapitalize="none"
              />
            )}
            name="message_text"
          />
          <TouchableOpacity onPress={handleSubmit(edit)}>
            <FontAwesomeIcon
              style={{marginLeft: 10}}
              icon={faCircleChevronRight}
              size={30}
              color={'#004aad'}
            />
          </TouchableOpacity>
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
    height: 750,
    marginVertical: 50,
    marginHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    overflow: 'hidden',
  },
  backContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
    position: 'relative',
    top: 0,
  },
  chattingWith: {
    flexDirection: 'row',
    marginBottom: 0,
    paddingBottom: 0,
    position: 'relative',
    top: 0,
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
  msgContainer: {
    width: '90%',
    height: 270,
    position: 'relative',
    marginHorizontal: '5%',
    padding: 10,
    marginBottom: 10,
    backgroundColor: '#f4f4f4',
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
    backgroundColor: '#ffffff',
  },
  myMessage: {
    flexDirection: 'row',
    alignSelf: 'flex-end',
    marginRight: 10,
    marginBottom: 10,
    borderWidth: 0,
    maxWidth: 300,
    borderTopLeftRadius: 5,
    borderBottomRightRadius: 5,
    borderBottomLeftRadius: 5,
    padding: 10,
    backgroundColor: '#5d71c9',
  },
  inputContainer: {
    backgroundColor: '#ffffff',
    width: '90%',
    marginHorizontal: 'auto',
    paddingTop: 15,
    position: 'relative',
    bottom: 10,
    left: 15,
    flexDirection: 'row',
    alignContent: 'flex-end',
  },
  startConvo: {
    backgroundColor: '#004aad',
    width: '95%',
    marginHorizontal: 'auto',
    padding: 5,
    borderRadius: 5,
    color: '#ffffff',
    textAlign: 'center',
  },
});

export default SingleChat;

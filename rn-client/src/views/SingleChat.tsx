import {
  Alert,
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
import {Button} from '@rneui/base';
import {Application, PostMessageText, UnauthorizedUser} from '../types/DBTypes';
import {useApplications, useChats, useUser} from '../hooks/apiHooks';
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
  const {getUserById} = useUser();
  const [me, setMe] = useState<UnauthorizedUser | null>(null);
  const {update, setUpdate} = useUpdateContext();
  const {
    getChatById,
    thisChat,
    postMessageToChat,
    sendInterviewInvitation,
    acceptInterviewInvitation,
    declineInterviewInvitation,
  } = useChats();
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

  const handleInterview = () => {
    Alert.alert(
      'Kutsu haastatteluun',
      'Haluatko kutsua käyttäjän haastatteluun?',
      [
        {
          text: 'Peruuta',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Kutsu',
          onPress: () => {
            sendInterviewInvitation(chatId);
            setUpdate((prevState) => !prevState);
          },
        },
      ],
    );
  };

  console.log(thisChat);

  const getMe = async () => {
    if (thisChat && thisChat.messages) {
      const user_id = thisChat.messages.find(
        (message) => message.user_id !== thisChat.chatting_with.user_id,
      )?.user_id;
      if (user_id) {
        const user = await getUserById(user_id);
        if (user) {
          setMe(user);
          console.log(user);
        }
      }
    }
  };

  useEffect(() => {
    getMe();
  }, [thisChat]);

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
              {me?.user_type === 'employer' && (
                <Button
                  onPress={() =>
                    navigation.navigate('ChatHakemukset', {
                      userId: thisChat?.chatting_with.user_id,
                      interview: thisChat?.interview_status,
                    })
                  }
                  title={'Hakemukset'}
                  buttonStyle={styles.saveButton}
                />
              )}
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
                thisChat.messages.map((message) =>
                  message.user_id === thisChat.chatting_with.user_id ? (
                    <View key={message.message_id} style={styles.theirMessage}>
                      <Text>{message.message_text}</Text>
                    </View>
                  ) : (
                    <View key={message.message_id} style={styles.myMessage}>
                      <Text style={{color: '#ffffff'}}>
                        {message.message_text}
                      </Text>
                    </View>
                  ),
                )
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
        {thisChat && me?.user_type === 'employer' ? (
          <>
            {thisChat.interview_status === 'Pending' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Olet lähettänyt kutsun haastatteluun
              </Text>
            )}

            {thisChat.interview_status === '' && (
              <Button
                title={'Kutsu haastatteluun'}
                buttonStyle={styles.saveButton}
                onPress={handleInterview}
              />
            )}

            {thisChat.interview_status === 'Accepted' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Haastattelukutsu hyväksytty. Voit nyt nähdä käyttäjän
                henkilötiedot
              </Text>
            )}

            {thisChat.interview_status === 'Declined' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Haastattelukutsu hylätty
              </Text>
            )}
          </>
        ) : (
          <>
            {thisChat && thisChat.interview_status === 'Pending' && (
              <>
                <Text style={{color: '#004aad', margin: 10}}>
                  Yritys {thisChat.chatting_with.username} on lähettänyt sinulle
                  haastattelukutsun
                </Text>
                <Button
                  title={'Hyväksy kutsu'}
                  buttonStyle={styles.saveButton}
                  onPress={() => {
                    Alert.alert(
                      'Hyväksy haastattelukutsu',
                      'Haluatko hyväksyä haastattelukutsun?',
                      [
                        {
                          text: 'Peruuta',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Hyväksy',
                          onPress: () => {
                            acceptInterviewInvitation(chatId);
                            Alert.alert(
                              'Onneksi olkoon!',
                              'Olet nyt hyväksynyt haastattelukutsun. Työnantaja näkee nyt henkilötietosi.',
                            );
                            setUpdate((prevState) => !prevState);
                          },
                        },
                      ],
                    );
                  }}
                />
                <Button
                  title={'Hylkää kutsu'}
                  buttonStyle={styles.saveButton}
                  onPress={() => {
                    Alert.alert(
                      'Hylkää haastattelukutsu',
                      'Haluatko hylätä haastattelukutsun?',
                      [
                        {
                          text: 'Peruuta',
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: 'Hylkää',
                          onPress: () => {
                            declineInterviewInvitation(chatId);
                            setUpdate((prevState) => !prevState);
                          },
                        },
                      ],
                    );
                  }}
                />
              </>
            )}

            {thisChat && thisChat.interview_status === '' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Odotat haastattelukutsua
              </Text>
            )}

            {thisChat && thisChat.interview_status === 'Accepted' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Haastattelukutsu hyväksytty
              </Text>
            )}

            {thisChat && thisChat.interview_status === 'Declined' && (
              <Text style={{color: '#004aad', margin: 10}}>
                Haastattelukutsu hylätty
              </Text>
            )}
          </>
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
    fontSize: 25,
    fontWeight: 'bold',
    marginLeft: 5,
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
  saveButton: {
    margin: 5,
    top: 0,
    backgroundColor: '#5d71c9',
    borderRadius: 12,
    marginLeft: 35,
  },
});

export default SingleChat;

import {
  ScrollView,
  StyleSheet,
  Text,
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
import {Input} from '@rneui/base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';

const SingleChat = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm();

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
        <View style={styles.chattingWith}>
          <FontAwesomeIcon
            icon={faCircleUser}
            size={60}
            style={styles.profilePicture}
          />
          <Text style={styles.chatParticipant}>Käyttäjä</Text>
        </View>
        <ScrollView style={{width: '100%'}}>
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
        </ScrollView>
        <View style={styles.inputContainer}>
          <Controller
            control={control}
            rules={{
              required: {value: true, message: 'is required'},
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={{backgroundColor: '#f4f4f4', borderRadius: 5}}
                placeholder="Kirjoita jotain..."
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                autoCapitalize="none"
              />
            )}
            name="username"
          />
          <TouchableOpacity>
            <FontAwesomeIcon
              icon={faCircleChevronRight}
              size={40}
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
    height: 700,
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
  inputContainer: {
    backgroundColor: '#ffffff',
    width: 280,
    position: 'absolute',
    bottom: 0,
    flexDirection: 'row',
    alignContent: 'flex-end',
  },
});

export default SingleChat;

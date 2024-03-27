import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import RegisterForm from '../components/RegisterForm';

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#5d71c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    position: 'relative',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
  },
  arrowIcon: {
    marginLeft: 20,
    marginTop: 50,
    backgroundColor: '#5d71c9',
  },
  registerContainer: {
    flex: 6,
    position: 'relative',
    width: Dimensions.get('window').width,
    height: 700,
    marginTop: 0,
    borderTopLeftRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 15,
    fontSize: 45,
    fontWeight: 'bold',
    color: '#004aad',
  },
  links: {
    height: 50,
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkText: {
    marginTop: 20,
    alignItems: 'center',
  },
});

const Register = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => {
            navigation.navigate('Kirjaudu');
          }}
        >
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={40}
            color={'#ffffff'}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.headerText}>Luo profiili</Text>
        <RegisterForm />
        <View style={styles.links}>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              // TODO: Navigate to the company registration screen
              // navigation.navigate('RekisteröiYritys');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>Teetkö tiliä yritykselle?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              navigation.navigate('Kirjaudu');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>
                Oletko jo rekisteröitynyt? Kirjaudu sisään
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Register;

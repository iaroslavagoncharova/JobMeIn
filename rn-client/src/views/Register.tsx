import {
  StyleSheet,
  View,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faArrowLeft} from '@fortawesome/free-solid-svg-icons';
import RegisterForm from '../components/RegisterForm';

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    width: Dimensions.get('window').width,
  },
  arrowIcon: {
    marginLeft: 20,
    marginTop: 50,
    backgroundColor: '#5d71c9',
  },
  registerContainer: {
    flex: 4,
    width: Dimensions.get('window').width,
    height: 700,
    marginTop: 0,
    borderTopLeftRadius: 50,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerText: {
    marginTop: 20,
    fontSize: 45,
    fontWeight: 'bold',
    color: '#004aad',
  },
  linkText: {
    marginTop: 20,
    alignItems: 'center',
  },
});

const Register = () => {
  return (
    <>
      <View style={styles.topContainer}>
        <TouchableOpacity>
          <FontAwesomeIcon
            icon={faArrowLeft}
            size={50}
            color={'#ffffff'}
            style={styles.arrowIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.registerContainer}>
        <Text style={styles.headerText}>Luo profiili</Text>
        <TouchableOpacity style={styles.linkText}>
          <View>
            <Text style={{color: '#004aad'}}>
              Oletko jo rekisteröitynyt? Kirjaudu sisään
            </Text>
          </View>
        </TouchableOpacity>
        <RegisterForm />
      </View>
    </>
  );
};

export default Register;

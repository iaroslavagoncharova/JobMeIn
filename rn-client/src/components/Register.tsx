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
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
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
    marginTop: 30,
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
    fontSize: 35,
    fontWeight: 'bold',
    color: '#004aad',
  },
  links: {
    justifyContent: 'space-between',
  },
  linkText: {
    marginTop: 10,
    alignItems: 'center',
  },
});

const Register = ({handleToggle}: {handleToggle: () => void}) => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <TouchableOpacity
          onPress={() => {
            handleToggle();
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
        <View style={styles.links}>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              navigation.navigate('RekisteröiYritys');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>Teetkö tiliä yritykselle?</Text>
            </View>
          </TouchableOpacity>
        </View>
        <RegisterForm handleToggle={handleToggle} />
      </View>
    </View>
  );
};

export default Register;

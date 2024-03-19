import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

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
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 1.7,
    width: Dimensions.get('window').width,
    marginTop: 0,
    borderTopRightRadius: 50,
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
  links: {
    margin: 0,
    height: 50,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkText: {
    margin: 0,
    alignItems: 'center',
  },
});

const Login = ({navigation}: {navigation: NavigationProp<ParamListBase>}) => {
  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Logo />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.headerText}>Kirjaudu sisään</Text>
        <LoginForm />
        <View style={styles.links}>
          <TouchableOpacity style={styles.linkText}>
            <View>
              <Text style={{color: '#004aad'}}>Unohditko salasanasi?</Text>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.linkText}
            onPress={() => {
              navigation.navigate('Rekisteröidy');
            }}
          >
            <View>
              <Text style={{color: '#004aad'}}>Luo profiili</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

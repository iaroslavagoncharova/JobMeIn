import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import Logo from '../components/Logo';
import LoginForm from '../components/LoginForm';

const styles = StyleSheet.create({
  topContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginContainer: {
    flex: 1,
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
    height: 45,
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  linkText: {
    margin: 0,
    alignItems: 'center',
  },
});

const Login = () => {
  return (
    <>
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
          <TouchableOpacity style={styles.linkText}>
            <View>
              <Text style={{color: '#004aad'}}>Luo profiili</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </>
  );
};

export default Login;

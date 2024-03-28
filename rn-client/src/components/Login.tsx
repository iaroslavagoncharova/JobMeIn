import {
  View,
  StyleSheet,
  Text,
  Dimensions,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import Logo from '../components/Logo';
import {useUserContext} from '../hooks/ContextHooks';
import {Values} from '../types/LocalTypes';

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
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  linkText: {
    margin: 0,
    alignItems: 'center',
  },
  loginForm: {
    flex: 1,
    marginTop: 50,
    marginBottom: 20,
    alignItems: 'center',
  },
  inputWithLabel: {
    flex: 1,
    width: 250,
    marginTop: 10,
    padding: 0,
  },
  labelText: {
    fontSize: 10,
    marginLeft: 0,
  },
  input: {
    height: 40,
    width: 250,
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    borderColor: '#e0e0e0',
    color: '#004aad',
  },
  loginButton: {
    marginTop: 0,
    width: 250,
    backgroundColor: '#5d71c9',
    marginBottom: 10,
    borderRadius: 5,
  },
});

const Login = () => {
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {handleLogin} = useUserContext();
  const initValues: Values = {email: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });
  console.log(initValues);

  const doLogin = async (values: Values) => {
    await handleLogin(values);
    console.log('doLogin', values);
    navigation.navigate('Profiili');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <Logo />
      </View>
      <View style={styles.loginContainer}>
        <Text style={styles.headerText}>Kirjaudu sisään</Text>
        <Card>
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Ole hyvä ja syötä sähköpostiosoite',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                placeholder="example@mail.com"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="email"
                autoCapitalize="none"
                errorMessage={errors.email?.message}
              />
            )}
            name="email"
          />
          <Controller
            control={control}
            rules={{
              required: {
                value: true,
                message: 'Ole hyvä ja syötä salasana',
              },
            }}
            render={({field: {onChange, onBlur, value}}) => (
              <Input
                style={styles.input}
                placeholder="********"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                inputMode="text"
                autoCapitalize="none"
                secureTextEntry
                errorMessage={errors.password?.message}
              />
            )}
            name="password"
          />
          <TouchableOpacity
            style={styles.loginButton}
            onPress={handleSubmit(doLogin)}
          >
            <Text
              style={{
                color: '#ffffff',
                padding: 10,
                textAlign: 'center',
                fontWeight: 'bold',
              }}
            >
              Kirjaudu
            </Text>
          </TouchableOpacity>
        </Card>
        <View style={styles.links}>
          <TouchableOpacity style={styles.linkText}>
            <View>
              <Text style={{color: '#004aad'}}>Unohditko salasanasi?</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Login;

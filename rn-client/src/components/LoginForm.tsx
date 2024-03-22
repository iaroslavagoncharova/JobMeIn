import {Alert, StyleSheet, Text, TouchableOpacity} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {NavigationProp, ParamListBase} from '@react-navigation/native';
import {Values} from '../types/LocalTypes';
import {useAuth} from '../hooks/apiHooks';

const styles = StyleSheet.create({
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

const LoginForm = ({
  navigation,
}: {
  navigation: NavigationProp<ParamListBase>;
}) => {
  const {postLogin} = useAuth();
  const initValues: Values = {email: '', password: ''};
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
  });

  const doLogin = async (values: Values) => {
    console.log(values);
    try {
      await postLogin(values);
      Alert.alert('Kirjautuminen onnistui', 'Tervetuloa!');
    } catch (e) {
      Alert.alert('Kirjautuminen epäonnistui', (e as Error).message);
    }
  };

  return (
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
        onPress={() => {
          handleSubmit(doLogin);
          navigation.navigate('Profiili');
        }}
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
  );
};

export default LoginForm;

import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Controller, useForm} from 'react-hook-form';
import {Card, Input} from '@rneui/base';
import {useEffect} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useUser} from '../hooks/apiHooks';

const CompanyRegisterForm = () => {
  const {postUser, checkEmail} = useUser();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const initValues = {
    username: '',
    fullname: '',
    address: '',
    email: '',
    password: '',
    phone: '',
    user_type: 'employer',
  };
  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm({
    defaultValues: initValues,
    mode: 'onBlur',
  });

  const handleCheckEmail = async (email: string) => {
    try {
      console.log(email, 'email');
      const result = await checkEmail(email);
      console.log(result, 'result');
      if (result) {
        Alert.alert('Sähköposti on jo käytössä', 'Käytä toista sähköpostia');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const doRegister = async (inputs: {
    username: string;
    fullname: string;
    address: string;
    email: string;
    password?: string;
    phone: string;
    user_type: string;
  }) => {
    console.log(inputs, 'inputs 1');
    try {
      console.log(inputs, 'inputs 2');
      await postUser(inputs);
      Alert.alert('Käyttäjä luotu', 'Voit kirjautua sisään');
      // TODO: navigate to login, not the auth screen
      navigation.navigate('Kirjaudu/luo profiili');
    } catch (error) {
      Alert.alert('Error', (error as Error).message);
    }
  };

  useEffect(() => {
    console.log(errors);
  }, [errors]);

  return (
    <Card>
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Ole hyvä ja syötä yrityksen nimi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>YRITYKSEN NIMI</Text>
            <Input
              style={styles.input}
              placeholder="Mehiläinen Oy"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.username?.message}
            />
          </View>
        )}
        name="username"
      />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Ole hyvä ja syötä yrityksen osoite',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>OSOITE</Text>
            <Input
              style={styles.input}
              placeholder="Mehiläinenkatu 1"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.address?.message}
            />
          </View>
        )}
        name="address"
      />
      <Controller
        control={control}
        rules={{
          required: {
            value: true,
            message: 'Ole hyvä ja syötä yhteyshenkilön nimi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>NIMI</Text>
            <Input
              style={styles.input}
              placeholder="Matti Mehiläinen"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize="none"
              errorMessage={errors.fullname?.message}
            />
          </View>
        )}
        name="fullname"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
          pattern: {
            value: /^\S+@\S+\.\S+$/,
            message: 'Sähköpostiosoite ei ole validi',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SÄHKÖPOSTIOSOITE</Text>
            <Input
              style={styles.input}
              placeholder="mattimeikalainen@example.com"
              keyboardType="default"
              autoCorrect={false}
              inputMode="email"
              onBlur={() => handleCheckEmail(value)}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.email?.message}
              autoCapitalize="none"
            />
          </View>
        )}
        name="email"
      />
      <Controller
        control={control}
        rules={{
          maxLength: 100,
          required: {value: true, message: 'is required'},
          minLength: {
            value: 8,
            message: 'Salasanan tulee olla vähintään 8 merkkiä pitkä',
          },
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>SALASANA (vähintään 8 merkkiä)</Text>
            <Input
              style={styles.input}
              secureTextEntry
              placeholder="Salasana"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              errorMessage={errors.password?.message}
            />
          </View>
        )}
        name="password"
      />
      {/* TODO: add password confirmation */}
      <Controller
        control={control}
        rules={{
          required: {value: true, message: 'is required'},
        }}
        render={({field: {onChange, onBlur, value}}) => (
          <View style={styles.inputWithLabel}>
            <Text style={styles.labelText}>PUHELINNUMERO</Text>
            <View style={styles.input}>
              <View>
                <Text
                  style={{
                    color: '#004aad',
                  }}
                >
                  +358
                </Text>
              </View>
              <TextInput
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                style={{flex: 10, paddingLeft: 10}}
                placeholder="01234567"
                keyboardType="phone-pad"
                inputMode="numeric"
              />
            </View>
          </View>
        )}
        name="phone"
      />
      <TouchableOpacity
        style={styles.registerButton}
        onPress={handleSubmit(doRegister)}
      >
        <Text
          style={{
            color: '#ffffff',
            padding: 10,
            textAlign: 'center',
            fontWeight: 'bold',
          }}
        >
          Luo profiili
        </Text>
      </TouchableOpacity>
    </Card>
  );
};

const styles = StyleSheet.create({
  registerForm: {
    flex: 1,
    position: 'relative',
    marginTop: 15,
    alignItems: 'center',
  },
  inputWithLabel: {
    width: 250,
    paddingVertical: 10,
    marginBottom: 30,
    height: 40,
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
    flexDirection: 'row',
  },
  registerButton: {
    marginTop: 20,
    width: 250,
    backgroundColor: '#5d71c9',
    borderRadius: 5,
  },
});

export default CompanyRegisterForm;

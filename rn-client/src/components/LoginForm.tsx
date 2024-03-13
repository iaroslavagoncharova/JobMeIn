import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';

const styles = StyleSheet.create({
  loginForm: {
    flex: 1,
    marginTop: 20,
    alignItems: 'center',
  },
  inputWithLabel: {
    flex: 1,
    width: 250,
    marginTop: 10,
    padding: 0,
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
  },
  loginButton: {
    marginTop: 0,
    width: 250,
    backgroundColor: '#5d71c9',
    marginBottom: 30,
    borderRadius: 5,
  },
});

const LoginForm = () => {
  return (
    <View style={styles.loginForm}>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>SÄHKÖPOSTIOSOITE</Text>
        <TextInput
          style={styles.input}
          placeholder="example@mail.com"
          keyboardType="default"
          autoCorrect={false}
          inputMode="email"
        />
      </View>
      <View style={styles.inputWithLabel}>
        <Text style={styles.labelText}>SALASANA</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          placeholder="********"
          keyboardType="default"
        />
      </View>
      <TouchableOpacity style={styles.loginButton} onPress={() => {}}>
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
    </View>
  );
};

export default LoginForm;

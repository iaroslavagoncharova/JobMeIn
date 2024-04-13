import {useState} from 'react';
import {Keyboard, TouchableOpacity, StyleSheet} from 'react-native';
import {Text} from 'react-native-elements';
import Login from '../components/Login';
import Register from '../components/Register';

export default function Auth() {
  const [register, setRegister] = useState(false);
  const handleToggle = () => setRegister(!register);

  const styles = StyleSheet.create({
    button: {
      marginTop: 0,
      width: 250,
      backgroundColor: '#5d71c9',
      marginBottom: 10,
      borderRadius: 5,
    },
    linkText: {
      margin: 0,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
  });
  return (
    <TouchableOpacity
      style={{flex: 1, justifyContent: 'center'}}
      onPress={() => Keyboard.dismiss()}
      activeOpacity={1}
    >
      {!register ? <Login /> : <Register handleToggle={handleToggle} />}
      <TouchableOpacity style={styles.linkText} onPress={handleToggle}>
        <Text style={{color: '#004aad', paddingBottom: 20}}>
          {!register ? 'Luo profiili' : 'Kirjaudu sisään'}
        </Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );
}

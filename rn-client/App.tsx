import {StatusBar} from 'expo-status-bar';
import {Platform, SafeAreaView, StyleSheet} from 'react-native';
import Login from './src/views/Login';
import Register from './src/views/Register';

const App = () => {
  return (
    <SafeAreaView style={styles.container}>
      <Login />
      <StatusBar style="auto" />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    flex: 1,
    paddingTop: Platform.OS === 'android' ? 30 : 0,
    backgroundColor: '#5d71c9',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default App;

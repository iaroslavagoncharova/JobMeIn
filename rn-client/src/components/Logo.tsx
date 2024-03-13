import {View, StyleSheet, Image} from 'react-native';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000',
  },
  logo: {
    width: 80,
    height: 80,
  },
});

const Logo = () => {
  return (
    <View style={styles.container}>
      <Image style={styles.logo} source={require('../assets/handshake.png')} />
    </View>
  );
};

export default Logo;

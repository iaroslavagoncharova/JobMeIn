import {View, StyleSheet} from 'react-native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faHandshake} from '@fortawesome/free-solid-svg-icons';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#ffffff',
    alignItems: 'center',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
  },
});

const Logo = () => {
  return (
    <View style={styles.container}>
      <FontAwesomeIcon icon={faHandshake} size={90} color={'#004aad'} />
    </View>
  );
};

export default Logo;

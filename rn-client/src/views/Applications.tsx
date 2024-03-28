import {Text, View} from 'react-native';
import {useEffect} from 'react';
import {useUserContext} from '../hooks/ContextHooks';

const Applications = () => {
  const {handleAutoLogin} = useUserContext();
  useEffect(() => {
    handleAutoLogin();
  }, []);

  return (
    <View>
      <Text>Applications</Text>
    </View>
  );
};

export default Applications;

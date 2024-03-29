import {Text, View} from 'react-native';
import {useUserContext} from '../hooks/ContextHooks';
import {useEffect} from 'react';

const Feed = () => {
  const {handleAutoLogin} = useUserContext();
  useEffect(() => {
    handleAutoLogin();
  }, []);
  return (
    <View>
      <Text>Feed</Text>
    </View>
  );
};

export default Feed;

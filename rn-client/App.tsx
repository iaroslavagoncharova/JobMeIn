import {StatusBar} from 'expo-status-bar';
import Navigator from './src/navigators/Navigator';
import Chats from './src/views/Chats';

const App = () => {
  return (
    <>
      <Navigator></Navigator>
      <StatusBar style="auto" />
    </>
  );
};

export default App;

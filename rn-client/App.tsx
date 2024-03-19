import {StatusBar} from 'expo-status-bar';
import Navigator from './src/navigators/Navigator';

const App = () => {
  return (
    <>
      <Navigator></Navigator>
      <StatusBar style="auto" />
    </>
  );
};

export default App;

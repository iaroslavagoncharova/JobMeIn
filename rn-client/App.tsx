import Navigator from './src/navigators/Navigator';
import Chats from './src/views/Chats';
import {UserProvider} from './src/contexts/UserContext';

const App = () => {
  return (
    <>
      <UserProvider>
        <Navigator></Navigator>
      </UserProvider>
    </>
  );
};

export default App;

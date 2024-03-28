import {UserProvider} from './src/contexts/UserContext';
import Navigator from './src/navigators/Navigator';

const App = () => {
  return (
    <>
      <UserProvider>
        <Navigator />
      </UserProvider>
    </>
  );
};

export default App;

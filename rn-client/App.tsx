import {InstructionProvider} from './src/contexts/InstructionContext';
import {UpdateProvider} from './src/contexts/UpdateContext';
import {UserProvider} from './src/contexts/UserContext';
import Navigator from './src/navigators/Navigator';

const App = () => {
  return (
    <>
      <UserProvider>
        <UpdateProvider>
          <Navigator />
        </UpdateProvider>
      </UserProvider>
    </>
  );
};

export default App;

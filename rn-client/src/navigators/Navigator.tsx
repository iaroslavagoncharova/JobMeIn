import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import Register from '../views/Register';
import SingleChat from '../views/SingleChat';
import {useUserContext} from '../hooks/ContextHooks';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

const LoginRegister = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Kirjaudu"
        component={Login}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Rekisteröidy"
        component={Register}
        options={{headerShown: false}}
      />
    </Stack.Navigator>
  );
};

const StackNavigator = () => {
  const {user} = useUserContext();
  return (
    <Stack.Navigator>
      {user ? (
        <>
          <Stack.Screen
            name="Navigaatiopalkki"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="Keskustelu" component={SingleChat} />
        </>
      ) : (
        <Stack.Screen
          name="Navigaatiopalkki"
          component={TabNavigator}
          options={{headerShown: false}}
        />
      )}
    </Stack.Navigator>
  );
};

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackNavigator />
    </NavigationContainer>
  );
};

export default Navigator;

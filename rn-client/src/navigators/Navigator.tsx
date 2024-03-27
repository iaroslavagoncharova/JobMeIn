import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import Register from '../views/Register';
import SingleChat from '../views/SingleChat';
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
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Navigaatiopalkki"
        component={TabNavigator}
        options={{headerShown: false}}
      />
      <Stack.Screen
        name="Keskustelu"
        component={SingleChat}
        options={{headerShown: false}}
      />
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

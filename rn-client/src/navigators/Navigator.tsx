import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from '../views/Login';
import Register from '../views/Register';

const Stack = createNativeStackNavigator();

const StackScreen = () => {
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

const Navigator = () => {
  return (
    <NavigationContainer>
      <StackScreen />
    </NavigationContainer>
  );
};

export default Navigator;

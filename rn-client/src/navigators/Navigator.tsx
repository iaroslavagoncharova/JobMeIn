import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SingleChat from '../views/SingleChat';
import {useUserContext} from '../hooks/ContextHooks';
import TabNavigator from './TabNavigator';

const Stack = createNativeStackNavigator();

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

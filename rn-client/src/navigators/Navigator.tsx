import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  faBriefcase,
  faComments,
  faHandshake,
  faPenToSquare,
  faRightToBracket,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {NavigationContainer} from '@react-navigation/native';
import {useUserContext} from '../hooks/ContextHooks';
import Applications from '../views/Applications';
import Tests from '../views/Tests';
import Feed from '../views/Feed';
import Chats from '../views/Chats';
import Profile from '../views/Profile';
import Auth from '../views/Auth';
import SingleChat from '../views/SingleChat';
import CandidateProfile from '../views/CandidateProfile';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const TabNavigator = () => {
  const {user} = useUserContext();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarStyle: {backgroundColor: 'white', height: 55},
        tabBarActiveTintColor: 'black',
        tabBarInactiveTintColor: 'grey',
        tabBarIcon: ({color, size, focused}) => {
          let iconName;
          color = focused ? '#004aad' : '#5D71C9';
          size = focused ? 30 : 25;
          if (route.name === 'Työhakemukset') {
            iconName = faHandshake as any;
          }
          if (route.name === 'Testit') {
            iconName = faPenToSquare as any;
          }
          if (route.name === 'Feed') {
            iconName = faBriefcase as any;
          }
          if (route.name === 'Keskustelut') {
            iconName = faComments as any;
          }
          if (route.name === 'Profiili') {
            iconName = faUser as any;
          }
          if (route.name === 'Kirjaudu/luo profiili') {
            iconName = faRightToBracket as any;
          }
          return <FontAwesomeIcon icon={iconName} color={color} size={size} />;
        },
      })}
    >
      {user ? (
        <>
          <Tab.Screen name="Työhakemukset" component={Applications} />
          <Tab.Screen name="Testit" component={Tests} />
          <Tab.Screen name="Feed" component={Feed} />
          <Tab.Screen name="Keskustelut" component={Chats} />
          <Tab.Screen name="Profiili" component={Profile} />
        </>
      ) : (
        <>
          <Tab.Screen name="Feed" component={Feed} />
          <Tab.Screen name="Kirjaudu/luo profiili" component={Auth} />
        </>
      )}
    </Tab.Navigator>
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
          <Stack.Screen
            name="Työnhakijan profiili"
            component={CandidateProfile}
          />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Navigaatiopalkki"
            component={TabNavigator}
            options={{headerShown: false}}
          />
        </>
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

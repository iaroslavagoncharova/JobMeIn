/* eslint-disable no-unused-expressions */
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faHandshake,
  faPenToSquare,
  faBriefcase,
  faComments,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import Applications from '../views/Applications';
import Tests from '../views/Tests';
import Feed from '../views/Feed';
import Chats from '../views/Chats';
import Profile from '../views/Profile';
import {useUserContext} from '../hooks/ContextHooks';
import Login from '../views/Login';

const Tab = createBottomTabNavigator();

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
          focused ? (color = '#004aad') : (color = '#5D71C9');
          focused ? (size = 30) : (size = 25);
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
          <Tab.Screen name="Kirjaudu" component={Login} />
        </>
      )}
    </Tab.Navigator>
  );
};

export default TabNavigator;

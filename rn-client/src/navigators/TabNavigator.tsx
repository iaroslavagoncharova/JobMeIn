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

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
      }}
    >
      <Tab.Screen
        name="Työhakemukset"
        component={Applications}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faHandshake} color={'#004aad'} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Testit"
        component={Tests}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon
              icon={faPenToSquare}
              color={'#004aad'}
              size={size}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Feed"
        component={Feed}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faBriefcase} color={'#004aad'} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Keskustelut"
        component={Chats}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faComments} color={'#004aad'} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="Profiili"
        component={Profile}
        options={{
          headerShown: false,
          tabBarIcon: ({color, size}) => (
            <FontAwesomeIcon icon={faUser} color={'#004aad'} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default TabNavigator;

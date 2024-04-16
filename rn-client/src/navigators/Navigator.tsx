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
import SingleApplication from '../views/SingleApplication';
import ExampleFeed from '../views/ExampleFeed';
import EmployerFeed from '../views/EmployerFeed';
import CompanyRegister from '../views/CompanyRegister';
import JobsApplications from '../components/JobsApplications';
import SingleJob from '../views/SingleJob';
import NewJob from '../views/NewJob';
import ReceivedApplication from '../views/ReceivedApplication';
import ChatApplications from '../views/ChatApplications';
import SingleTest from '../views/SingleTest';

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
          color = focused ? '#022c63' : '#5D71C9';
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
          if (route.name === 'ExampleFeed') {
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
          if (route.name === 'Ilmoitukset/ hakemukset') {
            iconName = faBriefcase as any;
          }
          return <FontAwesomeIcon icon={iconName} color={color} size={size} />;
        },
      })}
    >
      {user ? (
        user.user_type === 'candidate' ? (
          <>
            <Tab.Screen name="Työhakemukset" component={Applications} />
            <Tab.Screen name="Testit" component={Tests} />
            <Tab.Screen name="Feed" component={Feed} />
            <Tab.Screen name="Keskustelut" component={Chats} />
            <Tab.Screen name="Profiili" component={Profile} />
          </>
        ) : (
          <>
            <Tab.Screen
              name="Ilmoitukset/ hakemukset"
              component={JobsApplications}
            />
            <Tab.Screen name="Testit" component={Tests} />
            <Tab.Screen name="Feed" component={EmployerFeed} />
            <Tab.Screen name="Keskustelut" component={Chats} />
            <Tab.Screen name="Profiili" component={Profile} />
          </>
        )
      ) : (
        <>
          <Tab.Screen name="ExampleFeed" component={ExampleFeed} />
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
          <Stack.Screen name="Hakemuksesi" component={SingleApplication} />
          <Stack.Screen name="Työpaikka" component={SingleJob} />
          <Stack.Screen name="UusiTyöpaikka" component={NewJob} />
          <Stack.Screen
            name="SaapunutHakemus"
            component={ReceivedApplication}
          />
          <Stack.Screen name="ChatHakemukset" component={ChatApplications} />
          <Stack.Screen name="Testi" component={SingleTest} />
        </>
      ) : (
        <>
          <Stack.Screen
            name="Navigaatiopalkki"
            component={TabNavigator}
            options={{headerShown: false}}
          />
          <Stack.Screen name="RekisteröiYritys" component={CompanyRegister} />
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

import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {Button, Card, ListItem} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faAdd,
  faEdit,
  faMarker,
  faStopCircle,
} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {
  useEducation,
  useExperience,
  useSkills,
  useUser,
} from '../hooks/apiHooks';
import PersonalInfo from '../components/PersonalInfo';
import Edu from '../components/EducationInfo';
import useUpdateContext from '../hooks/updateHooks';
import ExperiencePage from '../components/ExperienceInfo';
import Skills from '../components/Skills';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  const {deleteUser} = useUser();
  const {getEducation, education} = useEducation();
  const {getExperience, experience} = useExperience();
  const {getSkills, skills, allSkills, getAllSkills} = useSkills();
  const {update} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  console.log(user);
  console.log(education);
  console.log(experience);

  const logout = async () => {
    const token = await AsyncStorage.getItem('token');
    console.log(token, user);
    await handleLogout();
    console.log(token, user);
    navigation.navigate('Kirjaudu/luo profiili');
  };

  const handleDelete = async () => {
    Alert.alert('Poista profiili', 'Haluatko varmasti poistaa profiilisi?', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: async () => {
          const result = await deleteUser();
          if (result) {
            handleLogout();
            navigation.navigate('Feed');
          } else {
            Alert.alert('Poistaminen epäonnistui');
          }
        },
      },
    ]);
  };

  useEffect(() => {
    getEducation();
    getExperience();
    getSkills();
    getAllSkills();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 15,
      marginTop: 40,
      width: '90%',
      borderRadius: 25,
    },
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
    },
    bigHeader: {
      color: '#5d71c9',
      fontSize: 25,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderColor: '#5d71c9',
    },
    logoutButton: {
      margin: 10,
      marginTop: 5,
      backgroundColor: '#5d71c9',
      borderRadius: 12,
    },
    deleteButton: {
      margin: 10,
      marginTop: 15,
      backgroundColor: '#D71313',
      borderRadius: 12,
    },
  });
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        backgroundColor: '#5d71c9',
      }}
    >
      {user && (
        <View style={styles.container}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.bigHeader}>Profiili</Text>
            <PersonalInfo user={user} />
            <Edu education={education} />
            <ExperiencePage experience={experience} />
            <Skills skills={skills} allSkills={allSkills} />
            <Card containerStyle={styles.card}>
              <Text style={styles.header}>Testit</Text>
            </Card>
            <Button
              title="Poista profiili"
              onPress={() => {
                handleDelete();
              }}
              buttonStyle={styles.deleteButton}
            />
            <Button
              title="Kirjaudu ulos"
              onPress={logout}
              buttonStyle={styles.logoutButton}
            />
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Profile;

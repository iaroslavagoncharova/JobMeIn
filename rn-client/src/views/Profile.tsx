import {
  Text,
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {Card, ListItem} from '@rneui/base';
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
import {useEducation, useExperience, useSkills} from '../hooks/apiHooks';
import PersonalInfo from '../components/PersonalInfo';
import Edu from '../components/EducationInfo';
import useUpdateContext from '../hooks/updateHooks';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  const {getEducation, education} = useEducation();
  const {getExperience, experience} = useExperience();
  const {getSkills, skills} = useSkills();
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
    navigation.navigate('KIrjaudu/luo profiili');
  };

  useEffect(() => {
    getEducation();
    getExperience();
    getSkills();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 30,
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
          <ScrollView>
            <Text style={styles.bigHeader}>Profiili</Text>
            <PersonalInfo user={user} />
            <Edu education={education} />
            <Card containerStyle={styles.card}>
              <Text style={styles.header}>Työkokemus</Text>
              {experience.map((exp) => (
                <Card key={exp.experience_id}>
                  <Text>Työnimike: {exp.job_title}</Text>
                  <Text>Työpaikka: {exp.job_place}</Text>
                  {exp.description ? (
                    <Text>Kuvaus: {exp.description}</Text>
                  ) : null}
                  <Text>
                    Työskentely alkaa:{' '}
                    {new Date(exp.start_date).toLocaleDateString('fi-FI')}
                  </Text>
                  {exp.end_date ? (
                    <Text>
                      Työskentely päättyy:{' '}
                      {new Date(exp.end_date).toLocaleDateString('fi-FI')}
                    </Text>
                  ) : (
                    <Text>Nykyinen työpaikka ✅</Text>
                  )}
                  <TouchableOpacity>
                    <FontAwesomeIcon icon={faEdit} size={20} />
                  </TouchableOpacity>
                </Card>
              ))}
              <TouchableOpacity>
                <FontAwesomeIcon icon={faAdd} size={20} />
                <Text>Lisää työkokemus</Text>
              </TouchableOpacity>
            </Card>
            <Card containerStyle={styles.card}>
              <Text style={styles.header}>Taidot (valitse 3-5 taitoa)</Text>
              {skills.map((skill) => (
                <Card key={skill.skill_id}>
                  <Text>Taito: {skill.skill_name}</Text>
                  <Text>Tyyppi: {skill.type}</Text>
                  <TouchableOpacity>
                    <FontAwesomeIcon icon={faEdit} size={20} />
                  </TouchableOpacity>
                </Card>
              ))}
              {skills.length < 5 ? (
                <TouchableOpacity>
                  <FontAwesomeIcon icon={faAdd} size={20} />
                  <Text>Lisää taito</Text>
                </TouchableOpacity>
              ) : null}
            </Card>
            <Card containerStyle={styles.card}>
              <Text style={styles.header}>Testit</Text>
            </Card>
            <TouchableOpacity onPress={logout}>
              <Text>Kirjaudu ulos</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default Profile;

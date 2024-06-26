import {Text, View, StyleSheet, ScrollView, Alert} from 'react-native';
import {Button, Card} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useUserContext} from '../hooks/ContextHooks';
import {
  useAttachments,
  useChats,
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
import Attachments from '../components/Attachments';

const Profile = () => {
  const {user, handleLogout} = useUserContext();
  const {deleteUser} = useUser();
  const {chats} = useChats();
  const {getEducation, education} = useEducation();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const {getExperience, experience} = useExperience();
  const {getSkills, skills, allSkills, getAllSkills} = useSkills();
  const {attachments, getUserAttachments} = useAttachments();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const logout = async () => {
    await handleLogout();
    navigation.navigate('Kirjaudu/luo profiili');
  };

  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('profileInstructions');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('profileInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);

  // const handleShowInstructions = async () => {
  //   // set all instructions in the async storage to true
  //   const instructionsList = [
  //     'profileInstructions',
  //     'testsInstructions',
  //     'receivedInstructions',
  //     'chatInstructions',
  //     'chatsInstructions',
  //     'companyJobsInstructions',
  //     'feedInstructions',
  //   ];
  //   instructionsList.forEach(async (instruction) => {
  //     const check = await AsyncStorage.getItem(instruction);
  //     if (check) {
  //       await AsyncStorage.setItem(instruction, 'true');
  //     }
  //   });
  //   setShowInstructions(true);
  //   setUpdate((prevState) => !prevState);
  // };

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
    getUserAttachments();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 15,
      margin: 30,
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
    candidateProfileButton: {
      margin: 5,
      backgroundColor: '#5d71c9',
      borderColor: '#004AAD',
      borderWidth: 3,
      borderRadius: 12,
    },
    applyButton: {
      margin: 5,
      backgroundColor: '#5d71c9',
      borderColor: '#004AAD',
      borderWidth: 3,
      borderRadius: 12,
    },
    text: {
      fontSize: 16,
      color: '#5d71c9',
      textAlign: 'center',
      margin: 5,
    },
    boldText: {
      fontSize: 16,
      color: '#5d71c9',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
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
      {user ? (
        <>
          {user.user_type === 'candidate' && (
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.bigHeader}>Profiili</Text>
                <Button
                  title="Työnantajan näkymä"
                  titleStyle={{color: '#ffffff'}}
                  buttonStyle={styles.candidateProfileButton}
                  onPress={() => navigation.navigate('Työnhakijan profiili')}
                />
                <PersonalInfo user={user} />
                <Edu education={education} />
                <ExperiencePage experience={experience} />
                <Skills skills={skills} allSkills={allSkills} />
                <Attachments attachments={attachments} />
                <Button
                  title="Poista profiili"
                  onPress={handleDelete}
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
          {user.user_type === 'employer' && (
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.bigHeader}>Profiili</Text>
                <PersonalInfo user={user} />
                <Button
                  title="Poista profiili"
                  onPress={handleDelete}
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
          {user.user_type === 'admin' && (
            <View style={styles.container}>
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.bigHeader}>Ylläpitäjän profiili</Text>
                <PersonalInfo user={user} />
                <Button
                  title="Poista profiili"
                  onPress={handleDelete}
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
        </>
      ) : (
        <Text style={{color: '#ffffff'}}>Loading...</Text>
      )}
      {showInstructions && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              padding: 20,
              borderRadius: 10,
              margin: 10,
            }}
          >
            <Text style={styles.boldText}>Ohjeet</Text>
            <Text style={styles.text}>
              Tässä näet profiilisi tiedot. Voit muokata tietoja painamalla
              muokkaa-painiketta. Voit myös poistaa profiilisi ja kirjautua
              ulos.
            </Text>
            <Text style={styles.text}>
              Työnhakijana voit lisätä koulutuksia, työkokemuksia, taitoja ja
              liitteitä. Pystyt myös katsomaan miltä profiilisi näyttää
              työnantajan näkökulmasta.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.applyButton}
              onPress={() => setShowInstructions(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Profile;

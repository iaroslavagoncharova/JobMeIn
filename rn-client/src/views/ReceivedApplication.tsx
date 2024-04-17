import {View, Text, StyleSheet, ScrollView, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useApplications, useMatch, useUser} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {
  CandidateProfile,
  Education,
  Experience,
  SkillName,
} from '../types/DBTypes';

export default function ReceivedApplication({route}: {route: any}) {
  console.log(route.params, 'route.params');
  const application = route.params;
  const {update, setUpdate} = useUpdateContext();
  const {postMatch} = useMatch();
  const {getCandidate} = useUser();
  const {dismissApplication, acceptApplication} = useApplications();
  const [user, setUser] = useState<CandidateProfile>();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const getUser = async () => {
    const user = await getCandidate(application.user_id);
    setUser(user);
  };

  const handleDismiss = async () => {
    Alert.alert(
      'Hylkää hakemus',
      'Haluatko varmasti hylätä hakemuksen?',
      [
        {
          text: 'Peruuta',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Kyllä',
          onPress: async () =>
            await dismissApplication(application.application_id),
        },
      ],
      {cancelable: false},
    );
    setUpdate((prevState) => !prevState);
    navigation.goBack();
  };

  const handleAccept = async () => {
    Alert.alert(
      'Hyväksy hakemus',
      'Haluatko varmasti hyväksyä hakemuksen?',
      [
        {
          text: 'Peruuta',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Kyllä',
          onPress: async () => {
            const result = await acceptApplication(application.application_id);
            if (result) {
              setUpdate((prevState) => !prevState);
              navigation.goBack();
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  useEffect(() => {
    getUser();
  }, [update]);

  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 15,
      margin: 20,
      width: '90%',
      borderRadius: 25,
      alignItems: 'center',
    },
    header: {
      color: '#5d71c9',
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    bigHeader: {
      color: '#5d71c9',
      fontSize: 22,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    text: {
      fontSize: 16,
      color: '#5d71c9',
      textAlign: 'center',
    },
    boldText: {
      fontSize: 16,
      color: '#5d71c9',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
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
    cancelButton: {
      margin: 5,
      backgroundColor: '#ffffff',
      borderColor: '#5d71c9',
      borderWidth: 1,
      color: '#5d71c9',
      borderRadius: 12,
    },
    saveButton: {
      margin: 5,
      backgroundColor: '#5d71c9',
      borderRadius: 12,
    },
    input: {
      height: 40,
      margin: 5,
      borderWidth: 1,
      borderColor: '#5d71c9',
      borderRadius: 12,
      padding: 10,
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
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bigHeader}>Hakemuksen tiedot</Text>
          <Card
            containerStyle={{
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
              width: '90%',
            }}
          >
            <Text style={styles.boldText}>Hakemus ID: </Text>
            <Text style={styles.text}>{application.application_id}</Text>
            <Text style={styles.boldText}>Lähetetty: </Text>
            <Text style={styles.text}>
              {application.created_at
                ? application.created_at
                    .toString()
                    .substring(0, 10)
                    .split('-')
                    .reverse()
                    .join('.')
                : ''}
            </Text>
            <Text style={styles.boldText}>Työhakemus: </Text>
            <Text style={styles.text}>
              {application.application_text
                ? application.application_text
                : 'Ei tekstiä'}
            </Text>
          </Card>
          <Card containerStyle={{borderRadius: 10}}>
            <Text style={styles.bigHeader}>Hakijan tiedot</Text>
            <Text style={styles.boldText}>Käyttäjänimi (randomisoitu): </Text>
            <Text style={styles.text}>{user?.username}</Text>
            <Text style={styles.boldText}>Kuvaus: </Text>
            <Text style={styles.text}>
              {user?.about_me ? user.about_me : 'Ei kuvausta'}
            </Text>
            <Text style={styles.boldText}>Taidot: </Text>
            {user?.skills.map((skill: SkillName, index: number) => (
              <Card key={index} containerStyle={{borderRadius: 10, margin: 5}}>
                <Text style={styles.text}>{String(skill)}</Text>
              </Card>
            ))}
            <Text style={styles.boldText}>Koulutus: </Text>
            {user?.education.map((education: Education) => (
              <Card
                key={education.education_id}
                containerStyle={{borderRadius: 10, margin: 5}}
              >
                <Text style={styles.text}>Koulu: {education.school}</Text>
                <Text style={styles.text}>Tutkinto: {education.degree}</Text>
                <Text style={styles.text}>Ala: {education.field}</Text>
                <Text style={styles.text}>
                  Valmistuminen:{' '}
                  {education.graduation
                    ? education.graduation
                        .toString()
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('.')
                    : ''}
                </Text>
              </Card>
            ))}
            <Text style={styles.boldText}>Työkokemus: </Text>
            {user?.experience.map((work: Experience) => (
              <Card
                key={work.experience_id}
                containerStyle={{
                  borderRadius: 10,
                  margin: 5,
                }}
              >
                <Text style={styles.text}>Työnantaja: {work.job_place}</Text>
                <Text style={styles.text}>Tehtävä: {work.job_title}</Text>
                <Text style={styles.text}>Kuvaus: {work.description}</Text>
                <Text style={styles.text}>Sijainti: {work.job_city}</Text>
                <Text style={styles.text}>
                  Alkamispäivä:{' '}
                  {work.start_date
                    ? work.start_date
                        .toString()
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('.')
                    : ''}
                </Text>
                <Text style={styles.text}>
                  {work.end_date
                    ? 'Lopetuspäivä: ' +
                      work.end_date
                        .toString()
                        .substring(0, 10)
                        .split('-')
                        .reverse()
                        .join('.')
                    : 'Nykyinen työpaikka'}
                </Text>
              </Card>
            ))}
            <Text style={styles.boldText}>Liitteet: </Text>
            {user?.attachments.map((attachment) => (
              <Card
                key={attachment.attachment_id}
                containerStyle={{
                  borderRadius: 10,
                  margin: 5,
                }}
              >
                <Text style={styles.text}>{attachment.attachment_name}</Text>
                <Text style={styles.text}>
                  {attachment.filename ? attachment.filename : 'Ei linkkiä'}
                </Text>
              </Card>
            ))}
            <Button
              title="Hyväksy"
              buttonStyle={styles.saveButton}
              onPress={handleAccept}
            />
            <Button
              title="Hylkää"
              buttonStyle={styles.cancelButton}
              titleStyle={{color: '#5d71c9'}}
              onPress={handleDismiss}
            />
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}

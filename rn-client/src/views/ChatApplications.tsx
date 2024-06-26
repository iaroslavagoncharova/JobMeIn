import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Linking,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useApplications, useUser} from '../hooks/apiHooks';
import {
  Application,
  CandidateProfile,
  UnauthorizedUser,
} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ChatApplications({route}: any) {
  const user_id = route.params.userId;
  const interview_status = route.params.interview;
  const {getUserApplications} = useApplications();
  const {getCandidate, getUserById} = useUser();
  const {update} = useUpdateContext();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<CandidateProfile | null>(null);
  const [privateUser, setPrivateUser] = useState<UnauthorizedUser | null>(null);
  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('chatApplicationsInstructions');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('chatApplicationsInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);
  const handleGetApplications = async (user_id: number) => {
    const response = await getUserApplications(user_id);
    if (response) {
      setApplications(response);
    } else {
      setApplications([]);
    }
  };

  const handleGetUserInfo = async (user_id: number) => {
    const response = await getCandidate(user_id);
    if (response) {
      setUser(response);
    } else {
      setUser(null);
    }
    const privateResponse = await getUserById(user_id);
    if (privateResponse) {
      setPrivateUser(privateResponse);
    } else {
      setPrivateUser(null);
    }
  };

  console.log(applications, 'applications');
  console.log(user, 'user');
  console.log(privateUser, 'privateUser');

  useEffect(() => {
    handleGetApplications(user_id);
    handleGetUserInfo(user_id);
  }, [update]);

  const handleDownload = async (filename: string) => {
    try {
      const link =
        process.env.EXPO_PUBLIC_UPLOAD_SERVER + '/download/' + filename;
      Linking.openURL(link);
    } catch (error) {
      console.error('Error downloading attachment:', error);
    }
  };

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
          {interview_status === 'Pending' && (
            <Text style={styles.boldText}>
              Olet lähettänyt kutsun haastatteluun, odota vastausta
            </Text>
          )}
          {interview_status === 'Accepted' && (
            <Text style={styles.boldText}>
              Haastattelu hyväksytty, näet työhakijan henkilötiedot
            </Text>
          )}
          {interview_status === 'Declined' && (
            <Text style={styles.boldText}>Haastattelu hylätty</Text>
          )}
          <Text style={styles.bigHeader}>Hakemukset</Text>
          {applications.map((application) => (
            <Card
              key={application.application_id}
              containerStyle={{
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
                width: '90%',
              }}
            >
              <Text style={styles.header}>Hakemus</Text>
              <Text style={styles.text}>
                Hakemuksen ID: {application.application_id}
              </Text>
              <Text style={styles.text}>
                Hakemus luotu:{' '}
                {application.created_at
                  ? application.created_at
                      .toString()
                      .split('T')[0]
                      .split('-')
                      .reverse()
                      .join('.')
                  : ''}
              </Text>
              <Text style={styles.text}>
                Hakemuksen teksti: {application.application_text}
              </Text>
            </Card>
          ))}
          <Card containerStyle={{borderRadius: 10}}>
            <Text style={styles.header}>Työnhakijan tiedot</Text>
            {interview_status === 'Accepted' && (
              <Text style={styles.text}>Nimi: {privateUser?.fullname}</Text>
            )}
            <Text style={styles.text}>Käyttäjänimi: {user?.username}</Text>
            {interview_status === 'Accepted' && (
              <>
                <Text style={styles.text}>
                  Sähköpostiosoite: {privateUser?.email}
                </Text>
                <Text style={styles.text}>
                  Puhelinnumero: {privateUser?.phone}
                </Text>
              </>
            )}
            <Text style={styles.text}>Kuvaus: {user?.about_me}</Text>
            <Text style={styles.text}>
              Työnhakijan taidot:{' '}
              {user?.skills.map((skill, index) => (
                <Text style={styles.text} key={index}>
                  {skill}
                  {index < user.skills.length - 1 ? ', ' : ''}
                </Text>
              ))}
            </Text>
            <Text style={styles.boldText}>Työnhakijan koulutus:</Text>
            {user?.education.map((edu) => (
              <Card key={edu.education_id} containerStyle={{borderRadius: 10}}>
                <Text style={styles.text}>
                  {edu.school}, {edu.degree}
                </Text>
                <Text style={styles.text}>
                  {edu.graduation
                    ? edu.graduation
                        .toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                    : 'Ei valmistumisvuotta'}
                </Text>
              </Card>
            ))}
            <Text style={styles.boldText}>Työnhakijan työkokemus:</Text>
            {user?.experience.map((exp) => (
              <Card key={exp.experience_id} containerStyle={{borderRadius: 10}}>
                <Text style={styles.text}>
                  {exp.job_place}, {exp.job_title}
                </Text>
                <Text style={styles.text}>
                  {exp.description ? exp.description : 'Ei kuvausta'}
                </Text>
                <Text style={styles.text}>{exp.job_city}</Text>
                <Text style={styles.text}>
                  {exp.start_date
                    ? exp.start_date
                        .toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                    : 'Ei aloituspäivää'}
                  {' - '}
                  {exp.end_date
                    ? exp.end_date
                        .toString()
                        .split('T')[0]
                        .split('-')
                        .reverse()
                        .join('.')
                    : 'Nykyinen työpaikka'}
                </Text>
              </Card>
            ))}
            <Text style={styles.boldText}>Työnhakijan liitteet: </Text>
            {user?.attachments.map((attachment) => (
              <Card
                key={attachment.attachment_id}
                containerStyle={{borderRadius: 10}}
              >
                <ScrollView>
                  <Text style={styles.boldText}>Liitteet</Text>
                  {user?.attachments.map((attachment, index) => (
                    <TouchableOpacity
                      onPress={() => handleDownload(attachment.filename)}
                      key={index}
                    >
                      <Text style={styles.text}>
                        {attachment.attachment_name} (klikkaa ladataksesi liite)
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </Card>
            ))}
          </Card>
        </ScrollView>
      </View>
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
              Tässä näet työnhakijan hakemukset ja tiedot. Voit lähettää hänelle
              kutsun haastatteluun. Jos työnhakija hyväksyy kutsun, näet hänen
              henkilötietonsa.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.saveButton}
              onPress={() => setShowInstructions(false)}
            />
          </View>
        </View>
      )}
    </View>
  );
}

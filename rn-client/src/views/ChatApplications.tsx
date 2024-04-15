import {View, Text, ScrollView, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from '@rneui/base';
import {useApplications, useUser} from '../hooks/apiHooks';
import {Application, CandidateProfile} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ChatApplications({route}: any) {
  const user_id = route.params.userId;
  const {getUserApplications} = useApplications();
  const {getCandidate} = useUser();
  const {update} = useUpdateContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<CandidateProfile | null>(null);
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
  };

  console.log(applications, 'applications');
  console.log(user, 'user');

  useEffect(() => {
    handleGetApplications(user_id);
    handleGetUserInfo(user_id);
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
          <Text style={styles.boldText}>
            Kutsu käyttäjä haastatteluun nähdäksesi heidän henkilötietonsa
          </Text>
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
                Hakemus ID: {application.application_id}
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
            <Text style={styles.header}>Käyttäjän tiedot</Text>
            <Text style={styles.text}>Käyttäjänimi: {user?.username}</Text>
            <Text style={styles.text}>Itsestä: {user?.about_me}</Text>
            <Text style={styles.text}>
              Käyttäjän taidot:{' '}
              {user?.skills.map((skill) => String(skill)).join(', ')}
            </Text>
            <Text style={styles.boldText}>Käyttäjän koulutus:</Text>
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
            <Text style={styles.boldText}>Käyttäjän työkokemus:</Text>
            {user?.experience.map((exp) => (
              <Card key={exp.experience_id} containerStyle={{borderRadius: 10}}>
                <Text style={styles.text}>
                  {exp.job_place}, {exp.job_title}
                </Text>
                <Text style={styles.text}>
                  {exp.description ? exp.description : ''}
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
            <Text style={styles.boldText}>Käyttäjän liitteet: </Text>
            {user?.attachments.map((attachment) => (
              <Card
                key={attachment.attachment_id}
                containerStyle={{borderRadius: 10}}
              >
                <Text style={styles.text}>{attachment.attachment_name}</Text>
                <Text style={styles.text}>
                  {attachment.link ? attachment.link : 'Ei linkkiä'}
                </Text>
              </Card>
            ))}
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}

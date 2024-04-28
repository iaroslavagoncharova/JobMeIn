import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useApplications, useUser} from '../hooks/apiHooks';
import {Application, UnauthorizedUser} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ChatEmployerInfo({route}: any) {
  const user_id = route.params.userId;
  const interview_status = route.params.interview;
  const me_id = route.params.meId;
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {getUserApplications} = useApplications();
  const {getUserById} = useUser();
  const {update} = useUpdateContext();
  const [applications, setApplications] = useState<Application[]>([]);
  const [user, setUser] = useState<UnauthorizedUser | null>(null);
  const handleGetApplications = async () => {
    console.log(user_id, 'user_id');
    const response = await getUserApplications(user_id);
    console.log(response, 'response');
    if (response) {
      setApplications(response);
    } else {
      setApplications([]);
    }
  };
  console.log(applications, 'applications');

  const handleGetUserInfo = async (user_id: number) => {
    const response = await getUserById(user_id);
    if (response) {
      setUser(response);
    } else {
      setUser(null);
    }
  };

  console.log(applications, 'applications');
  console.log(user, 'user');
  applications.map((application) => {
    console.log(application.job, 'application job');
  });

  useEffect(() => {
    handleGetApplications();
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
          {interview_status === 'Pending' && (
            <Text style={styles.boldText}>
              Olet saanut haastattelukutsun, mutta et ole vielä vastannut siihen
            </Text>
          )}
          {interview_status === 'Accepted' && (
            <Text style={styles.boldText}>
              Olet hyväksynyt haastattelukutsun
            </Text>
          )}
          {interview_status === 'Declined' && (
            <Text style={styles.boldText}>Olet hylännyt haastattelukutsun</Text>
          )}
          {interview_status === null && (
            <Text style={styles.boldText}>
              Työnantaja ei ole vielä kutsunut sinua haastatteluun
            </Text>
          )}
          <Text style={styles.bigHeader}>Hakemukset</Text>
          {applications.length === 0 && (
            <Text style={styles.text}>Ei hakemuksia</Text>
          )}
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
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Hakemuksesi', application);
                }}
              >
                <Text style={styles.header}>Hakemuksesi</Text>
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
                <Text style={styles.text}>
                  Hakemuksen tila:{' '}
                  {application.status
                    ? application.status === 'Accepted'
                      ? 'Hyväksytty'
                      : 'Hylätty'
                    : 'Käsittelemättä'}
                </Text>
                <Card>
                  <Text style={styles.header}>Työpaikan tiedot</Text>
                  <Text style={styles.text}>
                    Työnimike: {application.job.job_title}
                  </Text>
                  <Text style={styles.text}>Ala: {application.job.field}</Text>
                  <Text style={styles.text}>
                    Kuvaus: {application.job.job_description}
                  </Text>
                  <Text style={styles.text}>
                    Palkka: {application.job.salary}€/kk
                  </Text>
                  <Text style={styles.text}>
                    Paikka: {application.job.job_address}
                  </Text>
                  <Text style={styles.text}>
                    Viimeinen hakupäivä:{' '}
                    {application.job.deadline_date
                      ?.toString()
                      .split('T')[0]
                      .split('-')
                      .reverse()
                      .join('.')}
                  </Text>
                </Card>
              </TouchableOpacity>
            </Card>
          ))}
          <Card containerStyle={{borderRadius: 10}}>
            <Text style={styles.header}>Työnantajan tiedot</Text>
            <Text style={styles.text}>Yrityksen nimi: {user?.username}</Text>
            <Text style={styles.text}>
              Tiedot: {user?.about_me ? user.about_me : 'Ei määritelty'}
            </Text>
            <Text style={styles.text}>
              Osoite: {user?.address ? user.address : 'Ei määritelty'}
            </Text>
            <Card containerStyle={{borderRadius: 10}}>
              <Text style={styles.text}>Yhteyshenkilö:</Text>
              <Text style={styles.text}>
                {user?.fullname ? user.fullname : 'Ei määritelty'}
              </Text>
              <Text style={styles.text}>Puhelin:</Text>
              <Text style={styles.text}>
                {user?.phone ? user.phone : 'Ei määritelty'}
              </Text>
              <Text style={styles.text}>Sähköposti:</Text>
              <Text style={styles.text}>
                {user?.email ? user.email : 'Ei määritelty'}
              </Text>
            </Card>
            {interview_status === 'Accepted' && (
              <>
                <Text style={styles.text}>
                  Työnhakijan sähköposti: {user?.email}
                </Text>
                <Text style={styles.text}>
                  Työnhakijan puhelinnumero: {user?.phone}
                </Text>
              </>
            )}
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}

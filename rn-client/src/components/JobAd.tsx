import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {JobWithSkillsAndKeywords, User} from '../types/DBTypes';
import {useUser} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function JobAd({job}: {job: JobWithSkillsAndKeywords}) {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const [user, setUser] = useState<User | null>(null);
  const {update} = useUpdateContext();
  const {getUserById} = useUser();
  const styles = StyleSheet.create({
    card: {
      width: 350,
      height: 470,
      margin: 10,
      padding: 10,
      borderRadius: 25,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    header1: {
      color: '#5d71c9',
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 30,
      textAlign: 'center',
      margin: 5,
    },
    header2: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 5,
    },
    header3: {
      color: '#5d71c9',
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 5,
    },
    text: {
      color: '#5d71c9',
      fontSize: 15,
      textAlign: 'center',
      margin: 5,
    },
    boldText: {
      color: '#5d71c9',
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 5,
    },
    keywords: {
      color: '#ffffff',
      backgroundColor: '#004AAD',
      borderRadius: 25,
      padding: 10,
      width: '50%',
      left: 75,
      top: 10,
    },
    skills: {
      color: '#ffffff',
      backgroundColor: '#004AAD',
      borderRadius: 25,
      padding: 10,
      width: '50%',
      left: 15,
    },
    percent: {
      color: '#ffffff',
      backgroundColor: '#5d71c9',
      paddingTop: 23,
      fontSize: 35,
      textAlign: 'center',
      borderRadius: 50,
      width: 100,
      height: 100,
      left: 70,
      marginVertical: 15,
    },
    buttonRight: {
      color: '#ffffff',
      borderRadius: 25,
      width: 30,
      height: 30,
      bottom: 30,
      left: 70,
    },
    buttonLeft: {
      color: '#ffffff',
      borderRadius: 25,
      width: 30,
      height: 30,
      top: 15,
      right: 60,
    },
  });

  const addEmployerInfo = async () => {
    const user = await getUserById(job.user_id);
    setUser(user);
    console.log(user);
  };

  useEffect(() => {
    addEmployerInfo();
  }, [update]);

  const renderContent = () => {
    switch (currentScreen) {
      case 0:
        return (
          <>
            <Text style={styles.header1}>{job.job_title}</Text>
            <Text style={styles.header2}>Ala: {job.field}</Text>
            <Text style={styles.header2}>Yritys: {job.username}</Text>
            <Text style={styles.header3}>Sijainti: {job.job_address}</Text>
            <Text style={styles.header3}>Palkka: {job.salary}€/kk</Text>
            <Text style={styles.percent}>56%</Text>
            <Text style={styles.skills}>{job.skills}</Text>
            <Text style={styles.keywords}>{job.keywords}</Text>
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.header2}>{job.job_title}</Text>
            <Text style={styles.header2}>Yritys: {job.username}</Text>
            <Text style={styles.header3}>Ala: {job.field}</Text>
            <Text style={styles.header3}>Sijainti: {job.job_address}</Text>
            <Text style={styles.header3}>Palkka: {job.salary}€/kk</Text>
            <Text
              style={{
                color: '#ffffff',
                backgroundColor: '#004AAD',
                borderRadius: 25,
                padding: 10,
                textAlign: 'center',
              }}
            >
              Viimeinen hakupäivä:{' '}
              {job.deadline_date
                ? job.deadline_date
                    .toString()
                    .substring(0, 10)
                    .split('-')
                    .reverse()
                    .join('.')
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.header3}>Työpaikan kuvaus: </Text>
            <Text style={styles.text}>{job.job_description}</Text>
            <Text style={styles.header3}>Taidot: </Text>
            {job.skills.split(',').map((skill, index) => (
              <Text key={index} style={styles.text}>
                {skill}
              </Text>
            ))}
            {job.keywords.split(',').map((keyword, index) => (
              <Text key={index} style={styles.boldText}>
                #{keyword}
              </Text>
            ))}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.header2}>Työnantajan tiedot</Text>
            <Text style={styles.header2}>Yritys: {user?.username}</Text>
            <Text style={styles.header3}>
              Tiedot: {user?.about_me ? user.about_me : 'Ei määritelty'}
            </Text>
            <Text style={styles.header3}>
              Osoite: {user?.address ? user.address : 'Ei määritelty'}
            </Text>
            <Card>
              <Text style={styles.header3}>Yhteystiedot</Text>
              <Text style={styles.header3}>Yhteyshenkilö:</Text>
              <Text style={styles.text}>
                {user?.fullname ? user.fullname : 'Ei määritelty'}
              </Text>
              <Text style={styles.header3}>Puhelin:</Text>
              <Text style={styles.text}>
                {user?.phone ? user.phone : 'Ei määritelty'}
              </Text>
              <Text style={styles.header3}>Sähköposti:</Text>
              <Text style={styles.text}>
                {user?.email ? user.email : 'Ei määritelty'}
              </Text>
            </Card>
          </>
        );
      default:
        return null;
    }
  };

  const navigateToNextScreen = () => {
    if (currentScreen === 2) {
      setCurrentScreen(0);
      return;
    }
    setCurrentScreen(currentScreen + 1);
  };

  const navigateToPreviousScreen = () => {
    if (currentScreen === 0) {
      setCurrentScreen(2);
      return;
    }
    setCurrentScreen(currentScreen - 1);
  };

  return (
    <View style={{alignItems: 'center', backgroundColor: '#5d71c9'}}>
      <Card containerStyle={styles.card}>{renderContent()}</Card>
      <TouchableOpacity onPress={navigateToPreviousScreen}>
        <FontAwesomeIcon
          icon={faArrowAltCircleLeft}
          size={45}
          style={styles.buttonLeft}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={navigateToNextScreen}>
        <FontAwesomeIcon
          icon={faArrowAltCircleRight}
          size={45}
          style={styles.buttonRight}
        />
      </TouchableOpacity>
    </View>
  );
}

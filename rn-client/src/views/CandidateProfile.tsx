import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Card} from '@rneui/base';
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useUserContext} from '../hooks/ContextHooks';
import {
  useAttachments,
  useEducation,
  useExperience,
  useSkills,
} from '../hooks/apiHooks';

export default function CandidateProfile() {
  const {user} = useUserContext();
  const {skills} = useSkills();
  const {education} = useEducation();
  const {attachments} = useAttachments();
  const {experience} = useExperience();
  const [currentScreen, setCurrentScreen] = useState<number>(0);
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
    skills: {},
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

  const renderContent = () => {
    switch (currentScreen) {
      case 0:
        return (
          <>
            <Text style={styles.header1}>{user?.username}</Text>
            <Text style={styles.header2}>
              Ala: {user?.field ? user.field : 'Ei alaa'}
            </Text>
            <Text style={styles.header2}>
              {user?.about_me ? user.about_me : 'Ei kuvausta'}
            </Text>
            {skills ? (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  width: 200,
                }}
              >
                <Text style={styles.header3}>Taidot</Text>
                {skills.map((skill) => (
                  <Text>{skill.skill_name}</Text>
                ))}
              </Card>
            ) : (
              <Text style={styles.skills}>Ei taitoja</Text>
            )}
            {attachments ? (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  width: 200,
                }}
              >
                <Text style={styles.header3}>Liitteet</Text>
                {attachments.map((attachment) => (
                  <Text>{attachment.attachment_name}</Text>
                ))}
              </Card>
            ) : (
              <Text style={styles.skills}>Ei liitteitä</Text>
            )}
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.header1}>Koulutus</Text>
            {education ? (
              education.map((edu) => (
                <Card
                  containerStyle={{
                    borderRadius: 10,
                  }}
                >
                  <Text style={styles.boldText}>Koulu: {edu.school}</Text>
                  <Text style={styles.boldText}>
                    {' '}
                    Ala: {edu.field ? edu.field : 'Ei alaa'}
                  </Text>
                  <Text style={styles.boldText}>
                    Valmistumispäivä:{' '}
                    {edu.graduation
                      ? edu.graduation
                          .toString()
                          .substring(0, 10)
                          .split('-')
                          .reverse()
                          .join('.')
                      : 'Ei lopetuspäivää'}
                  </Text>
                </Card>
              ))
            ) : (
              <Text style={styles.skills}>Ei koulutusta</Text>
            )}
          </>
        );
      case 2:
        return (
          <>
            <Text style={styles.header1}>Kokemus</Text>
            {experience ? (
              experience.map((exp) => (
                <Card
                  containerStyle={{
                    borderRadius: 10,
                  }}
                  key={exp.experience_id}
                >
                  <Text style={styles.boldText}>{exp.job_title}</Text>
                  <Text style={styles.boldText}>
                    Kuvaus: {exp.description ? exp.description : 'Ei kuvausta'}
                  </Text>
                  <Text style={styles.boldText}>
                    Työnantaja: {exp.job_place}
                  </Text>
                  <Text style={styles.boldText}>
                    {' '}
                    Kaupunki: {exp.job_city ? exp.job_city : 'Ei kaupunkia'}
                  </Text>
                  <Text style={styles.text}>
                    {exp.start_date
                      ? exp.start_date
                          .toString()
                          .substring(0, 10)
                          .split('-')
                          .reverse()
                          .join('.')
                      : 'Ei aloituspäivää'}{' '}
                    -{' '}
                    {exp.end_date
                      ? exp.end_date.toLocaleString().split('T')[0]
                      : 'Nykyinen työpaikka'}
                  </Text>
                </Card>
              ))
            ) : (
              <Text style={styles.skills}>Ei kokemusta</Text>
            )}
          </>
        );
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
    <View
      style={{
        alignItems: 'center',
        backgroundColor: '#5d71c9',
        flex: 1,
        justifyContent: 'center',
      }}
    >
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

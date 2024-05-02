import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  Linking,
  ScrollView,
} from 'react-native';
import React, {useState} from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
  faExclamationCircle,
} from '@fortawesome/free-solid-svg-icons';
import {useForm} from 'react-hook-form';
import {CandidateProfile} from '../types/DBTypes';
import {useReports} from '../hooks/apiHooks';

export default function Candidate({candidate}: {candidate: CandidateProfile}) {
  const [currentScreen, setCurrentScreen] = useState<number>(0);
  const {sendReport} = useReports();
  const values = {
    reported_item_type: 'User',
    reported_item_id: candidate.user_id,
    report_reason: '',
  };

  console.log(candidate.skills, 'candidate.skills');

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const handleSendReport = async () => {
    const onSubmit = async (data: any) => {
      const report = {
        reported_item_type: 'User',
        reported_item_id: candidate.user_id,
        report_reason: data.report_reason,
      };
      console.log(report);
      const result = await sendReport(report);
      if (result) {
        Alert.alert('Ilmianto lähetetty', 'Kiitos ilmiannosta!');
      } else {
        Alert.alert('Ilmiannon lähettäminen epäonnistui', 'Yritä uudelleen');
      }
    };
    Alert.alert('Miksi ilmiannat työnhakijan?', '', [
      {
        text: 'Väärä kategoria',
        onPress: () => onSubmit({report_reason: 'Väärä kategoria'}),
      },
      {
        text: 'Väärennetty profiili',
        onPress: () => onSubmit({report_reason: 'Sopimaton sisältö'}),
      },
      {
        text: 'Muuta',
        onPress: () => onSubmit({report_reason: 'Muuta'}),
      },
    ]);
  };

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
    card: {
      width: 350,
      height: 470,
      margin: 10,
      padding: 10,
      marginTop: 40,
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
      margin: 0,
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
      bottom: 41,
      left: 70,
    },
    buttonLeft: {
      color: '#ffffff',
      borderRadius: 25,
      width: 30,
      height: 30,
      top: 20,
      right: 60,
    },
  });

  const renderContent = () => {
    switch (currentScreen) {
      case 0:
        return (
          <>
            <Text style={styles.header1}>{candidate?.username}</Text>
            <Text style={styles.header3}>
              Ala: {candidate?.field ? candidate.field : 'Ei alaa'}
            </Text>
            <Text style={styles.header3}>
              {candidate?.about_me ? candidate.about_me : 'Ei kuvausta'}
            </Text>
            {candidate?.skills.length > 0 ? (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  width: 200,
                }}
              >
                <Text style={styles.header3}>Taidot</Text>
                {candidate.skills.map((skill, index) => (
                  <Text style={styles.text} key={index}>
                    {skill}
                  </Text>
                ))}
              </Card>
            ) : (
              <Text style={styles.skills}>Ei taitoja</Text>
            )}
            {candidate.attachments ? (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  width: 200,
                }}
              >
                <ScrollView>
                  <Text style={styles.header3}>Liitteet</Text>
                  {candidate.attachments.map((attachment, index) => (
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
            ) : (
              <Text style={styles.skills}>Ei liitteitä</Text>
            )}
          </>
        );
      case 1:
        return (
          <>
            <Text style={styles.header1}>Koulutus</Text>
            {candidate.education ? (
              candidate.education.map((edu) => (
                <Card
                  containerStyle={{
                    borderRadius: 10,
                  }}
                  key={edu.education_id}
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
            {candidate.experience ? (
              candidate.experience.map((exp) => (
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
      <Card containerStyle={styles.card}>
        <>
          <TouchableOpacity
            style={{
              margin: 0,
              padding: 0,
              left: 250,
            }}
            onPress={() => {
              Alert.alert(
                'Ilmianna',
                'Haluatko ilmiantaa epäilyttävän työnhakijan?',
                [
                  {
                    text: 'Peruuta',
                    onPress: () => console.log('Cancel Pressed'),
                    style: 'cancel',
                  },
                  {text: 'Ilmianna', onPress: handleSendReport},
                ],
              );
            }}
          >
            <FontAwesomeIcon
              icon={faExclamationCircle}
              size={25}
              color="#D71313"
            />
          </TouchableOpacity>
          {renderContent()}
        </>
      </Card>
      <TouchableOpacity onPress={navigateToPreviousScreen}>
        <FontAwesomeIcon
          icon={faArrowAltCircleLeft}
          size={40}
          style={styles.buttonLeft}
        />
      </TouchableOpacity>
      <Text
        style={{
          color: '#ffffff',
          fontSize: 15,
          right: 80,
          top: 25,
        }}
      >
        Lisää tietoja
      </Text>
      <TouchableOpacity onPress={navigateToNextScreen}>
        <FontAwesomeIcon
          icon={faArrowAltCircleRight}
          size={40}
          style={styles.buttonRight}
        />
        <Text style={{color: '#ffffff', fontSize: 15, left: 70, bottom: 38}}>
          Lisää tietoja
        </Text>
      </TouchableOpacity>
    </View>
  );
}

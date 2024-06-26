import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
  TouchableOpacity,
  Linking,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {faCircleCheck} from '@fortawesome/free-solid-svg-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useApplications, useJobs, useTests, useUser} from '../hooks/apiHooks';
import {
  Application,
  JobWithSkillsAndKeywords,
  Test,
  UnauthorizedUser,
} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function SingleApplication({route}: {route: any}) {
  const application: Application = route.params;
  const [applicationInfo, setApplicationInfo] = useState<Application | null>(
    null,
  );
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [editing, setEditing] = useState<boolean>(false);
  const {getTestForJob} = useTests();
  const {update, setUpdate} = useUpdateContext();
  const {getUserById} = useUser();
  const isSubmitted = application.status === 'Submitted';
  const {getJobById} = useJobs();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const {
    putApplication,
    getSavedApplications,
    getApplicationById,
    sendApplication,
    deleteApplication,
  } = useApplications();
  const [user, setUser] = useState<UnauthorizedUser | null>(null);
  const [job, setJob] = useState<JobWithSkillsAndKeywords | null>(null);
  const [tests, setTests] = useState<Test[] | []>([]);
  const {getCandidateTests, takeTest} = useTests();
  const [userTests, setUserTests] = useState<Test[] | []>([]);
  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('singleAppInstructions');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('singleAppInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);
  const isDeadlinePassed =
    !isSubmitted &&
    job?.deadline_date &&
    new Date(job.deadline_date) < new Date();

  const getEmployerInfo = async () => {
    const user = await getUserById(application.job.user_id);
    if (user) {
      setUser(user);
    }
  };

  const getTests = async () => {
    const test = await getTestForJob(application.job_id);
    if (test) {
      setTests(test);
    }
    const userTests = await getCandidateTests();
    if (userTests) {
      setUserTests(userTests);
    }
  };

  console.log(application.status, 'application status');

  const getJobInfo = async () => {
    const job = await getJobById(application.job_id);
    if (job) {
      setJob(job);
    }
  };

  console.log(tests, 'tests', userTests, 'userTests');

  const send = async () => {
    const result = await sendApplication(application);
    if (result) {
      Alert.alert('Hakemus lähetetty!');
      setUpdate((prevState) => !prevState);
      navigation.navigate('Haetut');
    } else {
      Alert.alert('Hakemuksen lähettäminen epäonnistui');
    }
  };

  const values = {
    application_text: '',
  };

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  const addText = async (inputs: {application_text: string}) => {
    const updatedApplication = {
      ...application,
      application_text: inputs.application_text,
    };
    console.log(updatedApplication);
    await putApplication(updatedApplication);
    const result = await getApplicationById(application.application_id);
    if (result) {
      setApplicationInfo(result);
    }
    setUpdate((prevState) => !prevState);
    setEditing(!editing);
  };

  const handleDeleteApplication = async () => {
    Alert.alert(
      'Poista hakemus',
      'Haluatko varmasti poistaa hakemuksen?',
      [
        {
          text: 'Peruuta',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: 'Poista',
          onPress: async () => {
            const result = await deleteApplication(application.application_id);
            if (result) {
              Alert.alert('Hakemus poistettu!');
              setUpdate((prevState) => !prevState);
              navigation.navigate('Tykätyt');
            }
          },
        },
      ],
      {cancelable: false},
    );
  };
  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    getEmployerInfo();
    getJobInfo();
    getSavedApplications();
    getTests();
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
      margin: 5,
    },
    boldText: {
      fontSize: 16,
      color: '#5d71c9',
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 5,
    },
    redText: {
      fontSize: 16,
      color: '#D71313',
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
          <Card
            containerStyle={{
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.bigHeader}>Hakemuksen tiedot</Text>
            <Text style={styles.boldText}>Hakemuksen tila: </Text>
            <Text style={styles.text}>
              {application.status
                ? application.status === 'Submitted'
                  ? 'Odottaa vastausta'
                  : application.status === 'Accepted'
                    ? 'Hyväksytty'
                    : application.status === 'Declined'
                      ? 'Hylätty'
                      : 'Ei määritelty'
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Hakemuksen luontipäivä: </Text>
            <Text style={styles.text}>
              {application.created_at
                ? application.created_at.toString().slice(0, 10)
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Vastaanottaja: </Text>
            <Text style={styles.text}>
              {user?.username ? user.fullname : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>
              Hakemuksen teksti (vapaaehtoinen):{' '}
            </Text>
            <Text style={styles.text}>
              {applicationInfo?.application_text
                ? applicationInfo.application_text
                : application.application_text}
            </Text>
            {!isSubmitted &&
            job?.deadline_date &&
            new Date(job.deadline_date) > new Date() ? (
              <>
                <Text style={styles.boldText}>Hakuaikaa jäljellä: </Text>
                <Text style={styles.text}>
                  {job.deadline_date
                    ? Math.ceil(
                        (new Date(job.deadline_date).getTime() -
                          new Date().getTime()) /
                          (1000 * 3600 * 24),
                      )
                    : 'Ei määritelty'}{' '}
                  päivää
                </Text>
              </>
            ) : null}
            {!isSubmitted &&
              job?.deadline_date &&
              new Date(job.deadline_date) > new Date() && (
                <>
                  {!editing ? (
                    <Button
                      title="Muokkaa"
                      onPress={() => setEditing(!editing)}
                      buttonStyle={styles.saveButton}
                    ></Button>
                  ) : (
                    <>
                      <Controller
                        control={control}
                        render={({field: {onChange, onBlur, value}}) => (
                          <TextInput
                            style={styles.input}
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value ?? ''}
                            placeholder={'Kirjoita hakemuksen teksti tähän'}
                          />
                        )}
                        name="application_text"
                      />
                      <Button
                        title="Tallenna muutokset"
                        onPress={() => {
                          handleSubmit(addText)();
                          resetForm();
                        }}
                        buttonStyle={styles.saveButton}
                      ></Button>
                      <Button
                        title="Peruuta"
                        titleStyle={{color: '#5d71c9'}}
                        onPress={() => setEditing(!editing)}
                        buttonStyle={styles.cancelButton}
                      ></Button>
                    </>
                  )}
                </>
              )}
          </Card>
          <Card
            containerStyle={{
              borderRadius: 10,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={styles.bigHeader}>Työpaikan tiedot</Text>
            <Text style={styles.boldText}>Työnimike: </Text>
            <Text style={styles.text}>
              {application?.job.job_title
                ? application.job.job_title
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Ala: </Text>
            <Text style={styles.text}>
              {application?.job.field ? application.job.field : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Kuvaus: </Text>
            <Text style={styles.text}>
              {application?.job.job_description
                ? application.job.job_description
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Sijainti: </Text>
            <Text style={styles.text}>
              {application.job.job_address
                ? application.job.job_address
                : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Palkka: </Text>
            <Text style={styles.text}>
              {application.job.salary
                ? application.job.salary
                : 'Ei määritelty'}
              €/kk
            </Text>
            <Text style={styles.boldText}>Viimeinen hakupäivä: </Text>
            <Text style={styles.text}>
              {application.job.deadline_date
                ? application.job.deadline_date
                    .toString()
                    .split('T')[0]
                    .split('-')
                    .reverse()
                    .join('.')
                : 'Ei määritelty'}
            </Text>
          </Card>
          <Card>
            <Text style={styles.boldText}>Tarvittavat taidot: </Text>
            {job?.skills.split(',').map((skill, index) => (
              <Text key={index} style={styles.text}>
                {skill + ' '}
              </Text>
            ))}
            <Text style={styles.boldText}>Avainsanat: </Text>
            {job?.keywords.split(',').map((keyword, index) => (
              <Text key={index} style={styles.text}>
                #{keyword + ' '}
              </Text>
            ))}
          </Card>
          <Card>
            <Text style={styles.bigHeader}>Testit</Text>
            <Text style={styles.text}>
              Siirry tekemään testiä klikkaamalla. Suoritettuasi testin voit
              merkitä sen suoritetuksi painamalla pohjassa.
            </Text>
            {tests.map((test, index) => (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  alignItems: 'center',
                }}
                key={test.test_id}
              >
                <TouchableOpacity
                  onLongPress={() => {
                    const isTestTaken = userTests?.find(
                      (userTest) => userTest.test_id === test.test_id,
                    );

                    if (isTestTaken) {
                      Alert.alert('Huomio!', 'Testi on jo suoritettu.');
                    } else {
                      Alert.alert(
                        'Oletko suorittanut testin?',
                        '',
                        [
                          {
                            text: 'Kyllä',
                            onPress: () => {
                              takeTest(test.test_id);
                              setUpdate((prevState) => !prevState);
                            },
                          },
                          {
                            text: 'Peruuta',
                            onPress: () => console.log('Peruuta'),
                          },
                        ],
                        {cancelable: true},
                      );
                    }
                  }}
                  onPress={async () => {
                    const isTestTaken = userTests?.find(
                      (userTest) => userTest.test_id === test.test_id,
                    );

                    if (isTestTaken) {
                      Alert.alert('Huomio!', 'Testi on jo suoritettu.');
                    } else {
                      Linking.openURL(test.test_link!);
                    }
                  }}
                >
                  <Text style={styles.boldText}>{test.test_type}</Text>
                  {userTests?.find(
                    (userTest) => userTest.test_id === test.test_id,
                  ) ? (
                    <FontAwesomeIcon
                      icon={faCircleCheck}
                      color={'#5d71c9'}
                      size={25}
                      style={{left: 90}}
                    />
                  ) : null}
                </TouchableOpacity>
              </Card>
            ))}
          </Card>
          <Card>
            <Text style={styles.bigHeader}>Yrityksen tiedot</Text>
            <Text style={styles.boldText}>Yrityksen nimi:</Text>
            <Text style={styles.text}>
              {user?.username ? user.username : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Yrityksen sähköposti:</Text>
            <Text style={styles.text}>
              {user?.email ? user.email : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Yrityksen puhelinnumero: </Text>
            <Text style={styles.text}>
              {user?.phone ? user.phone : 'Ei määritelty'}
            </Text>
            <Text style={styles.boldText}>Yrityksen osoite:</Text>
            <Text style={styles.text}>
              {user?.address ? user.address : 'Ei määritelty'}
            </Text>
          </Card>
          {application.status === 'Submitted' ||
          application.status === 'Accepted' ||
          application.status === 'Declined' ? (
            <Button
              title="Hakemus on jo lähetetty"
              titleStyle={{color: '#5d71c9'}}
              buttonStyle={styles.cancelButton}
            ></Button>
          ) : isDeadlinePassed ? (
            <Button
              title="Poista hakemus"
              titleStyle={{color: '#5d71c9'}}
              onPress={() => handleDeleteApplication()}
              buttonStyle={styles.cancelButton}
            ></Button>
          ) : (
            <>
              <Button
                title="Lähetä hakemus!"
                onPress={() => send()}
                buttonStyle={styles.saveButton}
              ></Button>
              <Button
                title="Poista hakemus"
                titleStyle={{color: '#5d71c9'}}
                onPress={() => handleDeleteApplication()}
                buttonStyle={styles.cancelButton}
              ></Button>
            </>
          )}
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
              Voit muokata hakemuksen tekstiä painamalla "Muokkaa" -nappia.
              Poista hakemus painamalla "Poista hakemus" -nappia.
            </Text>
            <Text style={styles.text}>
              Kun olet valmis, paina "Lähetä hakemus" -nappia. Jos
              työilmoituksen hakuaika on päättynyt, voit poistaa hakemuksesi.
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

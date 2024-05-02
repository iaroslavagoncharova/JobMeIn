import {Button, Card} from '@rneui/base';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useContext, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faCircle,
  faCircleCheck,
  faCirclePlus,
  faEdit,
  faPlusCircle,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import {
  Link,
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useJobs, useTests, useUser} from '../hooks/apiHooks';
import {Job, Test} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

const Tests = () => {
  const {update, setUpdate} = useUpdateContext();
  const {getUserById} = useUser();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [userTests, setUserTests] = useState<Test[] | null>(null);
  const [tests, setTests] = useState<Test[] | null>(null);
  const {getAllTests, getCandidateTests, takeTest} = useTests();

  const handleGetTests = async () => {
    const tests = await getAllTests();
    if (tests) {
      setTests(tests);
    }
    const userTests = await getCandidateTests();
    if (userTests) {
      setUserTests(userTests);
    }
  };

  const [usernames, setUsernames] = useState<Record<number, string>>({});

  useEffect(() => {
    handleGetTests();
    fetchUsernames();
  }, [update]);

  const fetchUsernames = async () => {
    const usernames: Record<number, string> = {};
    await Promise.all(
      tests?.map(async (test) => {
        if (test.user_id !== null) {
          const user = await getUserById(test.user_id);
          if (user) {
            usernames[test.test_id] = user.username;
          }
        }
      }) ?? [],
    );
    if (usernames) {
      setUsernames(usernames);
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
      width: 300,
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
          <Text style={styles.bigHeader}>Testit</Text>
          <Text style={styles.text}>
            Siirry tekemään testiä klikkaamalla. Suoritettuasi testin voit
            merkitä sen suoritetuksi painamalla pohjassa.
          </Text>
          {tests ? (
            tests.map((test) => (
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
                  {test.user_id !== null ? (
                    <Text style={styles.boldText}>
                      {usernames[test.test_id] || 'Lataa...'}
                    </Text>
                  ) : (
                    <Text style={styles.boldText}>JobMe In</Text>
                  )}
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
            ))
          ) : (
            <Card containerStyle={{borderRadius: 10}}>
              <Text style={styles.text}>Ei testejä</Text>
            </Card>
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
              Tässä näet työnantajien ja JobMe In:n testit. Suorittamassa
              testejä nostat mahdollisuuksiasi työllistyä.
            </Text>
            <Text style={styles.text}>
              Työpaikan vaaditut testit näet työpaikkailmoituksista. Siirry
              tekemään testiä klikkaamalla.
            </Text>
            <Text style={styles.text}>
              Suoritettuasi testin voit merkitä sen suoritetuksi painamalla
              pohjassa.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.saveButton}
              onPress={() => {
                setShowInstructions(false);
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default Tests;

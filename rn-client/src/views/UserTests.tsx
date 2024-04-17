import {Card} from '@rneui/base';
import {
  Alert,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
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
import {useJobs, useTests} from '../hooks/apiHooks';
import {Job, Test} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

const Tests = () => {
  const {update, setUpdate} = useUpdateContext();
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

  console.log(tests, 'tests');
  console.log(userTests, 'userTests');

  useEffect(() => {
    handleGetTests();
  }, [update]);

  const navigation: NavigationProp<ParamListBase> = useNavigation();

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
            Klikkaamalla testiä pääset suorittamaan sen KERRAN, sen jälkeen
            paina pitkään testiä ja valitse 'Kyllä' merkitäksesi testin
            suoritetuksi.
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
                  onPress={() => {
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
            ))
          ) : (
            <Card containerStyle={{borderRadius: 10}}>
              <Text style={styles.text}>Ei testejä</Text>
            </Card>
          )}
        </ScrollView>
      </View>
    </View>
  );
};

export default Tests;

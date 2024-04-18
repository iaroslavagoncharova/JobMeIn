import {Card} from '@rneui/base';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faPlusCircle, faTrash} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useJobs, useTests} from '../hooks/apiHooks';
import {Job, Test} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

const Tests = () => {
  const {tests, getTestsByUser, getJobsByTest} = useTests();
  const {update, setUpdate} = useUpdateContext();
  const [userTests, setUserTests] = useState<Test[] | null>(null);
  const [defaultJobs, setDefaultJobs] = useState<{
    [testId: number]: Job[];
  } | null>(null);
  const [myJobs, setMyJobs] = useState<{
    [testId: number]: Job[];
  } | null>(null);

  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const getUserTest = async () => {
    const userTests = await getTestsByUser();
    if (userTests) {
      setUserTests(userTests);
    }
  };

  const getJobs = async () => {
    for (const test of tests ? tests : []) {
      const jobs = await getJobsByTest(test.test_id);
      if (jobs) {
        setDefaultJobs((prevJobs) => ({
          ...prevJobs,
          [test.test_id]: jobs,
        }));
      }
    }

    for (const test of userTests || []) {
      const jobs = await getJobsByTest(test.test_id);
      if (jobs) {
        setMyJobs((prevJobs) => ({
          ...prevJobs,
          [test.test_id]: jobs,
        }));
      }
    }
  };

  useEffect(() => {
    getUserTest();
    getJobs();
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
          <Text style={styles.bigHeader}>JobMeIn testit</Text>
          <Card containerStyle={{borderRadius: 10}}>
            {tests ? (
              tests.map((test) => (
                <View key={test.test_id}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Testi', {test})}
                  >
                    <Text style={styles.boldText}>{test.test_type}</Text>
                    <Text style={styles.text}>{test.test_link}</Text>
                  </TouchableOpacity>
                </View>
              ))
            ) : (
              <Text style={styles.text}>Ei testejä</Text>
            )}
          </Card>
          <Text style={styles.bigHeader}>Minun testit</Text>
          {userTests ? (
            userTests.map((test) => (
              <Card containerStyle={{borderRadius: 10}} key={test.test_id}>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Testi', {test})}
                >
                  <Text style={styles.boldText}>{test.test_type}</Text>
                  <Text style={styles.text}>{test.test_link}</Text>
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

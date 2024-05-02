import {Button, Card} from '@rneui/base';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {useTests} from '../hooks/apiHooks';
import {Job, Test} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

const Tests = () => {
  const {tests, getTestsByUser, getJobsByTest, postTest} = useTests();
  const {update, setUpdate} = useUpdateContext();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [userTests, setUserTests] = useState<Test[] | null>(null);
  const [posting, setPosting] = useState<boolean>(false);
  const values = {
    test_type: '',
    test_link: '',
  };
  const [defaultJobs, setDefaultJobs] = useState<{
    [testId: number]: Job[];
  } | null>(null);
  const [myJobs, setMyJobs] = useState<{
    [testId: number]: Job[];
  } | null>(null);

  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

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

    for (const test of userTests ?? []) {
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

  const handlePostTest = async (inputs: any) => {
    console.log(inputs);
    if (!inputs.test_type || inputs.test_type === '') {
      return;
    }
    if (!inputs.test_link || inputs.test_link === '') {
      return;
    }
    const result = await postTest(inputs);
    if (result) {
      setUpdate((prevState) => !prevState);
      resetForm();
      setPosting(false);
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
    plusButton: {
      margin: 20,
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
          {tests ? (
            tests.map((test) => (
              <Card
                containerStyle={{
                  borderRadius: 10,
                  width: 300,
                  marginBottom: 5,
                }}
                key={test.test_id}
              >
                <TouchableOpacity
                  onPress={() => navigation.navigate('Testi', {test})}
                >
                  <Text style={styles.boldText}>{test.test_type}</Text>
                  <Text style={styles.text}>{test.test_link}</Text>
                </TouchableOpacity>
              </Card>
            ))
          ) : (
            <Text style={styles.text}>Ei testejä</Text>
          )}
          <Text style={styles.bigHeader}>Minun testini</Text>
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
          {!posting ? (
            <TouchableOpacity onPress={() => setPosting(true)}>
              <FontAwesomeIcon
                icon={faPlusCircle}
                size={50}
                color="#5d71c9"
                style={styles.plusButton}
              />
            </TouchableOpacity>
          ) : (
            <Card containerStyle={{borderRadius: 10}}>
              <Text style={styles.header}>Lisää uusi testi</Text>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    placeholder="Testin nimi*"
                  />
                )}
                name="test_type"
                rules={{required: 'Testin nimi vaaditaan'}}
              />
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    placeholder="Linkki*"
                    inputMode="url"
                  />
                )}
                name="test_link"
                rules={{required: 'Linkki vaaditaan'}}
              />
              <Button
                title="Tallenna"
                onPress={handleSubmit(handlePostTest)}
                buttonStyle={styles.saveButton}
              />
              <Button
                title="Peruuta"
                onPress={() => setPosting(false)}
                buttonStyle={styles.cancelButton}
                titleStyle={{color: '#5d71c9'}}
              />
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
              Tässä näet sekä JobMe In:n että sinun lisäämät testit. Voit lisätä
              uuden testin painamalla plus-ikonia. Voit tarkastella, muokata,
              poistaa ja lisätä testit työpaikkoihin painamalla testin nimeä.
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
};

export default Tests;

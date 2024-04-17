import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {Controller, useForm} from 'react-hook-form';
import RNPickerSelect from 'react-native-picker-select';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useJobs, useTests} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {Job, Test} from '../types/DBTypes';

export default function SingleTest({route}: {route: any}) {
  const test = route.params.test;
  const [selectedJob, setSelectedJob] = useState<number | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {update, setUpdate} = useUpdateContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [newTest, setNewTest] = useState<Test>(test);
  const {
    getJobsByTest,
    addJobToTest,
    deleteJobFromTest,
    deleteTest,
    postTest,
    putTest,
  } = useTests();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const {getJobsByCompany} = useJobs();

  const values = {
    test_type: '',
    test_link: '',
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

  const getJobs = async () => {
    const result = await getJobsByTest(test.test_id);
    if (result) {
      setJobs(result);
    }
  };

  const getCompanyJobs = async () => {
    const result = await getJobsByCompany();
    if (result) {
      // Filter out jobs that are already used with the test
      const filteredJobs = result.filter(
        (job) => !jobs.some((usedJob) => usedJob.job_id === job.job_id),
      );
      setAllJobs(filteredJobs);
    }
  };

  const handleAddJob = async () => {
    if (!selectedJob) {
      return;
    }
    const result = await addJobToTest(test.test_id, selectedJob);
    if (result) {
      setSelectedJob(null);
      setUpdate((prevState) => !prevState);
    }
  };

  const handleRemoveJob = async (job: Job) => {
    const result = await deleteJobFromTest(test.test_id, job.job_id);
    if (result) {
      setUpdate((prevState) => !prevState);
      navigation.navigate('Testit');
    }
  };

  const handleDeleteTest = async () => {
    Alert.alert('Poistetaanko testi?', '', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: async () => {
          const result = await deleteTest(test.test_id);
          if (result) {
            setUpdate((prevState) => !prevState);
          }
        },
      },
    ]);
  };

  const handleEdit = async (data: any) => {
    console.log(data, 'data');
    const result = await putTest(test.test_id, data);
    if (result) {
      console.log(result, 'result');
      setNewTest((prevTest) => ({
        ...prevTest,
        test_type: result.test.test_type,
        test_link: result.test.test_link,
      }));
      setIsEditing(false);
      resetForm();
      setUpdate((prevState) => !prevState);
    }
  };

  const placeholder = {
    label: 'Valitse työpaikka',
    value: null,
    color: '#5d71c9',
  };

  const generateItems = () => {
    const testJobs = allJobs.filter(
      (job) => !jobs.some((usedJob) => usedJob.job_id === job.job_id),
    );

    const items = testJobs.map((job) => ({
      label: job.job_title,
      value: job.job_id,
      color: '#5d71c9',
    }));
    return items;
  };

  const items = generateItems();

  useEffect(() => {
    getJobs();
    getCompanyJobs();
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
      width: 200,
    },
    saveButton: {
      margin: 5,
      backgroundColor: '#5d71c9',
      borderRadius: 12,
      width: 200,
      textAlign: 'center',
    },
    deleteButton: {
      margin: 5,
      width: 200,
      backgroundColor: '#D71313',
      borderRadius: 12,
    },
    input: {
      height: 60,
      margin: 5,
      borderWidth: 1,
      borderColor: '#5d71c9',
      borderRadius: 12,
      padding: 10,
      width: 250,
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
        <Card containerStyle={{borderRadius: 10}}>
          {!isEditing ? (
            <>
              <Text style={styles.bigHeader}>
                {newTest.test_type ? newTest.test_type : test.test_type}
              </Text>
              <Text style={styles.text}>
                {newTest.test_link ? newTest.test_link : test.test_link}
              </Text>
              <Text style={styles.boldText}>
                Käytössä seuraavissa työpaikoissa
              </Text>
              {jobs.map((item) => (
                <>
                  <Text style={styles.boldText} key={item.job_id}>
                    - {item.job_title}{' '}
                  </Text>
                  <TouchableOpacity onPress={() => handleRemoveJob(item)}>
                    <FontAwesomeIcon
                      icon={faTrash}
                      size={25}
                      style={{color: '#5d71c9', bottom: 30, left: 10}}
                    />
                  </TouchableOpacity>
                </>
              ))}
              <Text style={styles.boldText}>
                Lisää testi muihin työpaikkoihin
              </Text>
              <RNPickerSelect
                placeholder={placeholder}
                items={items}
                value={selectedJob}
                onValueChange={(value) => {
                  setSelectedJob(value);
                }}
                style={{
                  placeholder: {
                    color: '#5d71c9',
                  },
                }}
              />
              {selectedJob ? (
                <>
                  <Button
                    title={'Tallenna'}
                    buttonStyle={styles.saveButton}
                    onPress={handleAddJob}
                  />
                  <Button
                    title={'Peruuta'}
                    buttonStyle={styles.cancelButton}
                    titleStyle={{color: '#5d71c9'}}
                    onPress={() => setSelectedJob(null)}
                  />
                </>
              ) : null}
            </>
          ) : (
            <>
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={test.test_type}
                    multiline={true}
                  />
                )}
                name="test_type"
              />
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={test.test_link}
                    multiline={true}
                  />
                )}
                name="test_link"
              />
            </>
          )}
        </Card>
        {test.user_id !== null && (
          <>
            {!isEditing ? (
              <>
                <Button
                  title={'Muokkaa testiä'}
                  buttonStyle={styles.saveButton}
                  onPress={() => setIsEditing(true)}
                />
                <Button
                  title={'Poista testi'}
                  buttonStyle={styles.deleteButton}
                  onPress={handleDeleteTest}
                />
              </>
            ) : (
              <>
                <Button
                  title={'Tallenna muutokset'}
                  buttonStyle={styles.saveButton}
                  onPress={() => {
                    handleSubmit(handleEdit)();
                  }}
                />
                <Button
                  title={'Peruuta'}
                  buttonStyle={styles.cancelButton}
                  titleStyle={{color: '#5d71c9'}}
                  onPress={() => {
                    setIsEditing(false);
                    resetForm();
                  }}
                />
              </>
            )}
          </>
        )}
      </View>
    </View>
  );
}

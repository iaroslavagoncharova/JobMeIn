// TODO: add datepicker
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';
import {useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function SingleJob({route}: {route: any}) {
  const {putJob, getJobById, deleteJob} = useJobs();
  const [job, setJob] = useState<JobWithSkillsAndKeywords>(route.params);
  const {update, setUpdate} = useUpdateContext();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const values = {
    job_title: '',
    field: '',
    job_description: '',
    job_address: '',
    salary: '',
    deadline_date: '',
    skills: '',
    keywords: '',
  };
  console.log(job, 'job');
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const edit = async (inputs: any) => {
    console.log(inputs, 'inputs');
    await putJob(job.job_id, inputs);
    Alert.alert('Työilmoitus muokattu onnistuneesti');
    const result = await getJobById(job.job_id);
    setJob(result);
    console.log(result, 'result');
    setIsEditing(false);
    setUpdate((prevState) => !prevState);
  };
  const handleDelete = async () => {
    Alert.alert('Haluatko varmasti poistaa työilmoituksen?', '', [
      {
        text: 'Peruuta',
        onPress: () => console.log('Cancel Pressed'),
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: async () => {
          const result = await deleteJob(job.job_id);
          if (!result) {
            Alert.alert('Poistaminen epäonnistui');
            return;
          }
          Alert.alert('Työilmoitus poistettu onnistuneesti');
          navigation.navigate('Minun työpaikat');
          setUpdate((prevState) => !prevState);
        },
      },
    ]);
  };

  console.log(job, 'job');
  const styles = StyleSheet.create({
    container: {
      backgroundColor: '#ffffff',
      flex: 1,
      padding: 15,
      margin: 20,
      width: '90%',
      borderRadius: 25,
      alignItems: 'center',
      justifyContent: 'center',
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
    deleteButton: {
      margin: 5,
      backgroundColor: '#D71313',
      borderRadius: 12,
    },
    input: {
      height: 40,
      margin: 5,
      width: 250,
      maxWidth: '100%',
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
        justifyContent: 'center',
      }}
    >
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Text style={styles.bigHeader}>Työilmoituksen tiedot</Text>
          <Card
            containerStyle={{
              borderRadius: 10,
              width: 300,
              margin: 0,
              marginTop: 15,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {!isEditing ? (
              <>
                <Text style={styles.boldText}>Työnimike: </Text>
                <Text style={styles.text}>
                  {job.job_title ? job.job_title : 'Ei määritelty'}
                </Text>
                <Text style={styles.boldText}>Ala: </Text>
                <Text style={styles.text}>
                  {job.field ? job.field : 'Ei alaa'}
                </Text>
                <Text style={styles.boldText}>Kuvaus: </Text>
                <Text style={styles.text}>
                  {job.job_description ? job.job_description : 'Ei kuvausta'}
                </Text>
                <Text style={styles.boldText}>Sijainti: </Text>
                <Text style={styles.text}>
                  {job.job_address ? job.job_address : 'Ei osoitetta'}
                </Text>
                <Text style={styles.boldText}>Palkka: </Text>
                <Text style={styles.text}>
                  {job.salary ? job.salary : 'Ei määritelty'}
                  €/kk
                </Text>
                <Text style={styles.boldText}>Viimeinen hakupäivä: </Text>
                <Text style={styles.text}>
                  {job.deadline_date
                    ? job.deadline_date.toString().slice(0, 10)
                    : 'Ei määritelty'}
                </Text>
                <Text style={styles.boldText}>Taidot: </Text>
                <Text style={styles.text}>
                  {job.skills ? job.skills : 'Ei taitoja'}
                </Text>
                <Text style={styles.boldText}>Avainsanat: </Text>
                <Text style={styles.text}>
                  {job.keywords ? job.keywords : 'Ei avainsanoja'}
                </Text>
                <Button
                  onPress={() => setIsEditing(true)}
                  buttonStyle={styles.saveButton}
                >
                  Muokkaa
                </Button>
                <Button
                  onPress={handleDelete}
                  buttonStyle={styles.deleteButton}
                  title={'Poista'}
                />
              </>
            ) : (
              <View
                style={{
                  justifyContent: 'center',
                }}
              >
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      placeholder={job.job_title ? job.job_title : 'Työnimike'}
                    />
                  )}
                  name="job_title"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      placeholder={job.field ? job.field : 'Ala'}
                    />
                  )}
                  name="field"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      placeholder={
                        job.job_description ? job.job_description : 'Kuvaus'
                      }
                    />
                  )}
                  name="job_description"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      multiline={true}
                      placeholder={job.job_address ? job.job_address : 'Osoite'}
                    />
                  )}
                  name="job_address"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, value}}) => (
                    <TextInput
                      style={styles.input}
                      onChangeText={onChange}
                      value={value}
                      inputMode="numeric"
                      placeholder={
                        job.salary ? job.salary + '€/kk' : 'Palkka €/kk'
                      }
                    />
                  )}
                  name="salary"
                />
                <Button
                  onPress={() => setIsEditing(false)}
                  buttonStyle={styles.cancelButton}
                  title={'Peruuta'}
                  titleStyle={{color: '#5d71c9'}}
                />
                <Button
                  onPress={handleSubmit(edit)}
                  buttonStyle={styles.saveButton}
                  title={'Tallenna'}
                />
              </View>
            )}
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}

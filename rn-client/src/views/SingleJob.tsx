/* eslint-disable @typescript-eslint/no-unused-vars */
// TODO: fix checkboxes and add keywords logic the same way as skills
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card, CheckBox} from '@rneui/base';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {
  JobWithSkillsAndKeywords,
  KeyWord,
  Skill,
  UpdateJob,
} from '../types/DBTypes';
import {useJobs, useKeywords, useSkills} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function SingleJob({route}: {route: any}) {
  const {putJob, getJobById, deleteJob} = useJobs();
  const {keywords} = useKeywords();
  const {allSkills} = useSkills();
  const [deadline_date, setDeadlineDate] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedSkills, setSelectedSkills] = useState<Skill[] | []>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<KeyWord[] | []>([]);
  const [job, setJob] = useState<JobWithSkillsAndKeywords>(route.params);
  const {update, setUpdate} = useUpdateContext();
  console.log(job.skills, 'job.skills');
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

  console.log(selectedKeywords, 'selectedKeywords', selectedSkills, 'skills');

  useEffect(() => {
    setSelectedSkills(
      allSkills.filter((skill) =>
        job.skills.includes(skill.skill_id.toString()),
      ),
    );
    setSelectedKeywords(
      keywords?.filter((keyword) =>
        job.keywords.includes(keyword.keyword_id.toString()),
      ) ?? [],
    );
  }, []);
  const showMode = () => {
    setOpen(true);
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

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const handleSkillSelection = (skill: Skill) => {
    if (selectedSkills.find((s) => s.skill_id === skill.skill_id)) {
      setSelectedSkills(
        selectedSkills.filter((s) => s.skill_id !== skill.skill_id),
      );
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  const handleKeywordSelection = (keyword: KeyWord) => {
    if (selectedKeywords.find((kw) => kw.keyword_id === keyword.keyword_id)) {
      setSelectedKeywords(
        selectedKeywords.filter((kw) => kw.keyword_id !== keyword.keyword_id),
      );
    } else {
      setSelectedKeywords([...selectedKeywords, keyword]);
    }
  };

  const renderSkills = () => {
    return allSkills.map((skill, index) => (
      <CheckBox
        key={index}
        title={skill.skill_name}
        checked={
          selectedSkills.some((s) => s.skill_id === skill.skill_id) ||
          job.skills.includes(skill.skill_name)
        }
        onPress={() => handleSkillSelection(skill)}
      />
    ));
  };
  const edit = async (inputs: UpdateJob) => {
    if (!deadline_date) {
      inputs.deadline_date = '';
    } else {
      // Change deadline date to be in format yyyy-mm-dd
      inputs.deadline_date = deadline_date.toISOString().split('T')[0];
    }
    console.log(deadline_date, 'deadline_date');
    deadline_date?.setDate(deadline_date.getDate() + 1);
    const skillIds = selectedSkills.map((skill) => skill.skill_id);
    const skillsString = skillIds.join(',');
    const keywordIds = selectedKeywords.map((keyword) => keyword.keyword_id);
    const keywordsString = keywordIds.join(',');

    console.log(keywordsString, 'keywordsString', skillsString, 'skillsString');
    console.log(deadline_date, 'deadline_date');
    const data = {
      job_title: inputs.job_title,
      field: inputs.field,
      job_description: inputs.job_description,
      job_address: inputs.job_address,
      salary: inputs.salary,
      deadline_date: deadline_date
        ? deadline_date.toISOString().split('T')[0]
        : '',
      skills: skillsString,
      keywords: keywordsString,
    };
    console.log(data, 'data');
    const result = await putJob(job.job_id, {
      ...data,
      deadline_date: data.deadline_date,
    });
    if (!result) {
      Alert.alert('Muokkaaminen epäonnistui');
      return;
    }
    Alert.alert('Työilmoitus muokattu onnistuneesti');
    const newJobResult = await getJobById(job.job_id);
    setJob(newJobResult);
    console.log(newJobResult, 'result');
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
    calendarButton: {
      margin: 5,
      backgroundColor: '#ffffff',
      borderColor: '#004AAD',
      borderWidth: 3,
      borderRadius: 12,
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
                    ? new Date(job.deadline_date).toLocaleDateString('fi-FI')
                    : 'Ei määritelty'}
                </Text>
                <Text style={styles.boldText}>Taidot: </Text>
                <Text style={styles.text}>
                  {job.skills
                    ? job.skills.toString().replace(/,/g, ', ')
                    : 'Ei taitoja'}
                </Text>
                <Text style={styles.boldText}>Avainsanat: </Text>
                <Text style={styles.text}>
                  {job.keywords
                    ? job.keywords.toString().replace(/,/g, ', ')
                    : 'Ei avainsanoja'}
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
                  title="Valitse viimeinen hakupäivä"
                  onPress={showMode}
                  buttonStyle={styles.calendarButton}
                  titleStyle={{color: '#004AAD'}}
                />
                <Text style={styles.text}>
                  Valittu päivämäärä:{' '}
                  {deadline_date
                    ? deadline_date.toLocaleString('fi-FI').split(' ')[0]
                    : job.deadline_date
                      ? new Date(job.deadline_date)
                          .toLocaleString('fi-FI')
                          .split(' ')[0]
                      : 'Ei määritelty'}
                </Text>
                {open && (
                  <RNDateTimePicker
                    mode="date"
                    display="calendar"
                    onChange={(event, selectedDate) => {
                      const currentDate = selectedDate ? selectedDate : null;
                      setOpen(false);
                      setDeadlineDate(currentDate);
                    }}
                    value={
                      job.deadline_date
                        ? new Date(job.deadline_date)
                        : new Date()
                    }
                    minimumDate={new Date()}
                    positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
                    negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
                  />
                )}
                <Text style={styles.boldText}>Valitse taidot:</Text>
                {renderSkills()}
                {selectedSkills.length !== 0 ? (
                  <>
                    <Text style={styles.text}>Valitut taidot:</Text>
                    <View>
                      {selectedSkills.map((skill, index) => (
                        <Text style={styles.text} key={index}>
                          {index + 1 + '. ' + skill.skill_name}
                        </Text>
                      ))}
                    </View>
                  </>
                ) : null}
                <Text style={styles.boldText}>Valitse avainsanat:</Text>
                {keywords?.map((keyword, index) => (
                  <CheckBox
                    key={index}
                    title={keyword.keyword_name}
                    checked={selectedKeywords.includes(keyword as never)}
                    onPress={() => handleKeywordSelection(keyword)}
                  />
                ))}
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

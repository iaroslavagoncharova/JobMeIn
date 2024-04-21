// TODO: add filtering by skill type
// TODO: add fields
// TODO: add datepicker
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Button, Card} from '@rneui/base';
import {CheckBox} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import RNPickerSelect from 'react-native-picker-select';
import {useJobs, useKeywords, useSkills} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {JobWithSkillsAndKeywords, KeyWord, Skill} from '../types/DBTypes';

export default function NewJob() {
  const {postJob} = useJobs();
  const {allSkills} = useSkills();
  const {keywords} = useKeywords();
  const {update, setUpdate} = useUpdateContext();
  const [selectedSkills, setSelectedSkills] = useState<Skill[] | []>([]);
  const [selectedKeywords, setSelectedKeywords] = useState<KeyWord[] | []>([]);
  const [searchValue, setSearchValue] = useState('');
  const [showMore, setShowMore] = useState(false);
  const [deadline_date, setDeadlineDate] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [value, setValue] = useState<string | null>(null);
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
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
    setSelectedSkills([]);
    setSelectedKeywords([]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const showMode = () => {
    setOpen(true);
  };

  const placeholder = {
    label: 'Valitse ala',
    value: null,
    color: '#5d71c9',
  };

  const items = [
    {label: 'IT', value: 'IT', color: '#5d71c9'},
    {label: 'Ravintola- ja catering', value: 'Rakentaminen', color: '#5d71c9'},
    {label: 'Kauppa', value: 'Kauppa', color: '#5d71c9'},
    {
      label: 'Sosiaali- ja terveysala',
      value: 'Sosiaali- ja terveysala',
      color: '#5d71c9',
    },
    {
      label: 'Kasvatus- ja opetusala',
      value: 'Kasvatus- ja opetusala',
      color: '#5d71c9',
    },
    {
      label: 'Myynti ja markkinointi',
      value: 'Myynti ja markkinointi',
      color: '#5d71c9',
    },
    {
      label: 'Hallinto ja toimisto',
      value: 'Hallinto ja toimisto',
      color: '#5d71c9',
    },
    {label: 'Rakennusala', value: 'Rakennusala', color: '#5d71c9'},
    {label: 'Muu', value: 'Muu', color: '#5d71c9'},
  ];

  const handlePost = async (
    inputs: Omit<JobWithSkillsAndKeywords, 'job_id' | 'user_id' | 'username'>,
  ) => {
    if (!selectedSkills.length) {
      Alert.alert('Virhe', 'Valitse vähintään yksi taito');
      return;
    }
    if (!selectedKeywords.length) {
      Alert.alert('Virhe', 'Valitse vähintään yksi avainsana');
      return;
    }
    const skillIds = selectedSkills.map((skill) => skill.skill_id);
    const skillString = skillIds.join(', ');
    const keywords = selectedKeywords.map((keyword) => keyword.keyword_id);
    const keywordsString = keywords.join(', ');
    if (deadline_date) {
      // minus one day to get the correct date
      const deadline = new Date(deadline_date);
      inputs.deadline_date = deadline.toISOString().split('T')[0];
    }
    if (!inputs.deadline_date) {
      Alert.alert('Virhe', 'Valitse viimeinen hakupäivä');
      return;
    }
    console.log(inputs.deadline_date);
    if (!value) {
      Alert.alert('Virhe', 'Valitse ala');
      return;
    }
    const newJob = {
      ...inputs,
      skills: skillString,
      keywords: keywordsString,
      field: value,
    };
    console.log(newJob);
    const result = await postJob(newJob);
    if (result) {
      console.log('Job posted successfully');
      resetForm();
      setUpdate(!update);
      navigation.navigate('Minun työpaikat');
    } else {
      Alert.alert('Virhe', 'Työpaikan luonti epäonnistui');
    }
  };

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
  // render checkboxes for each skill
  const renderSkills = () => {
    const filteredSkills = allSkills.filter((skill) =>
      skill.skill_name.toLowerCase().includes(searchValue.toLowerCase()),
    );

    return filteredSkills.map((skill: Skill, index: number) => (
      <CheckBox
        key={index}
        title={skill.skill_name + ' | ' + skill.type + ' taito'}
        checked={selectedSkills.includes(skill as never)}
        onPress={() => handleSkillSelection(skill)}
      />
    ));
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
          <Text style={styles.bigHeader}>Uusi työilmoitus</Text>
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
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Työnimike"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="job_title"
              rules={{required: 'Työnimike on pakollinen'}}
            />
            {errors.job_title && (
              <Text style={styles.text}>{errors.job_title.message}</Text>
            )}
            <RNPickerSelect
              placeholder={placeholder}
              items={items}
              onValueChange={(value) => {
                setValue(value);
              }}
              style={{
                inputIOS: styles.input,
                inputAndroid: styles.input,
                placeholder: {
                  color: '#5d71c9',
                },
              }}
            />
            {errors.field && (
              <Text style={styles.text}>{errors.field.message}</Text>
            )}
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Työn kuvaus"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="job_description"
              rules={{required: 'Työn kuvaus on pakollinen'}}
            />
            {errors.job_description && (
              <Text style={styles.text}>{errors.job_description.message}</Text>
            )}
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Osoite"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="job_address"
              rules={{required: 'Osoite on pakollinen'}}
            />
            {errors.job_address && (
              <Text style={styles.text}>{errors.job_address.message}</Text>
            )}
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Palkka"
                  inputMode="numeric"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="salary"
              rules={{required: 'Palkka on pakollinen'}}
            />
            {errors.salary && (
              <Text style={styles.text}>{errors.salary.message}</Text>
            )}
            <>
              <Button
                title="Valitse viimeinen hakupäivä"
                titleStyle={{color: '#5d71c9', fontSize: 15}}
                onPress={showMode}
                buttonStyle={styles.calendarButton}
              />
              {!deadline_date && (
                <Text style={styles.text}>
                  Viimeinen hakupäivä on pakollinen
                </Text>
              )}
              {open && (
                <RNDateTimePicker
                  mode="date"
                  display="calendar"
                  onChange={(event, selectedDate) => {
                    const currentDate = selectedDate ?? deadline_date;
                    setOpen(false);
                    setDeadlineDate(currentDate);
                  }}
                  value={deadline_date ? deadline_date : new Date()}
                  minimumDate={new Date()}
                  positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
                  negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
                />
              )}
              <Text style={{color: '#5d71c9', margin: 5, textAlign: 'center'}}>
                Valittu päivä:{' '}
                {deadline_date
                  ? deadline_date.toLocaleString('fi-FI').split(' ')[0]
                  : 'Ei valittu'}
              </Text>
            </>
            {errors.deadline_date && (
              <Text style={styles.text}>{errors.deadline_date.message}</Text>
            )}
            <Text style={styles.boldText}>Valitse taidot:</Text>
            {selectedSkills.length === 0 ? (
              <Text style={styles.text}>Taidot ovat pakollisia</Text>
            ) : null}
            <View>
              <TextInput
                style={styles.input}
                placeholder="Search for a skill..."
                onChangeText={setSearchValue}
                value={searchValue}
              />
              {renderSkills()}
              {showMore && (
                <TouchableOpacity>
                  <Text>Show more</Text>
                </TouchableOpacity>
              )}
            </View>
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
            {selectedKeywords.length === 0 ? (
              <Text style={styles.text}>Avainsanat ovat pakollisia</Text>
            ) : null}
            {keywords?.map((keyword, index) => (
              <CheckBox
                key={index}
                title={keyword.keyword_name}
                checked={selectedKeywords.includes(keyword as never)}
                onPress={() => handleKeywordSelection(keyword)}
              />
            ))}
            <Button
              title={'Tallenna'}
              buttonStyle={styles.saveButton}
              onPress={handleSubmit(handlePost)}
            />
            <Button
              onPress={resetForm}
              buttonStyle={styles.cancelButton}
              title={'Tyhjennä'}
              titleStyle={{color: '#5d71c9'}}
            />
            <Button
              onPress={() => navigation.navigate('Minun työpaikat')}
              title={'Peruuta'}
              buttonStyle={styles.cancelButton}
              titleStyle={{color: '#5d71c9'}}
            />
          </Card>
        </ScrollView>
      </View>
    </View>
  );
}

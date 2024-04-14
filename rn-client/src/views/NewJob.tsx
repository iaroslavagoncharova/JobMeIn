// TODO: add filtering by skill type
// TODO: add fields
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
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

  const handlePost = async (
    inputs: Omit<JobWithSkillsAndKeywords, 'job_id' | 'user_id' | 'username'>,
  ) => {
    const skillIds = selectedSkills.map((skill) => skill.skill_id);
    // turn skillIds into a string
    const skillString = skillIds.join(', ');
    const keywords = selectedKeywords.map((keyword) => keyword.keyword_id);
    const keywordsString = keywords.join(', ');
    const newJob = {
      ...inputs,
      skills: skillString,
      keywords: keywordsString,
    };
    console.log(newJob);
    const result = await postJob(newJob);
    if (result) {
      console.log('Job posted successfully');
      resetForm();
      setUpdate(!update);
      navigation.navigate('Minun työpaikat');
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
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Ala"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="field"
              rules={{required: 'Ala on pakollinen'}}
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
            <Controller
              control={control}
              render={({field: {onChange, onBlur, value}}) => (
                <TextInput
                  style={styles.input}
                  placeholder="Viimeinen hakupäivä"
                  onBlur={onBlur}
                  onChangeText={onChange}
                  value={value}
                />
              )}
              name="deadline_date"
              rules={{required: 'Viimeinen hakupäivä on pakollinen'}}
            />
            {errors.deadline_date && (
              <Text style={styles.text}>{errors.deadline_date.message}</Text>
            )}
            <Text style={styles.boldText}>Valitse taidot:</Text>
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

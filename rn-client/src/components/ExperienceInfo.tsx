/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd, faEdit, faTrash} from '@fortawesome/free-solid-svg-icons';
import DatePicker from '@react-native-community/datetimepicker';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Controller, useForm} from 'react-hook-form';
import {Experience, ExperienceInfo} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';
import {useExperience} from '../hooks/apiHooks';

export default function ExperiencePage({
  experience,
}: {
  experience: Experience[];
}) {
  const [expEditing, setExpEditing] = useState<number | null>(null);
  const [expPosting, setExpPosting] = useState<boolean>(false);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {update, setUpdate} = useUpdateContext();
  const [show, setShow] = useState(false);
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const {putExperience, deleteExperience} = useExperience();
  const values: ExperienceInfo = {
    job_title: '',
    job_place: '',
    job_city: '',
    description: '',
    start_date: startDate,
    end_date: endDate,
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

  const edit = async (inputs: ExperienceInfo) => {
    console.log(inputs, 'inputs');
    if (expEditing) {
      await putExperience(expEditing, inputs);
      setExpEditing(null);
      setUpdate((prevState) => !prevState);
      resetForm();
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Poistetaanko työkokemus?', '', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: () => {
          deleteExperience(id);
          setUpdate((prevState) => !prevState);
        },
      },
    ]);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      borderRadius: 10,
      borderColor: '#5d71c9',
    },
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    input: {
      height: 40,
      margin: 5,
      borderWidth: 1,
      borderColor: '#5d71c9',
      borderRadius: 12,
      padding: 10,
    },
    icon: {
      margin: 10,
      backgroundColor: '#5d71c9',
      color: '#ffffff',
      borderRadius: 50,
      left: '70%',
    },
    text: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 14,
      color: '#004AAD',
    },
    boldText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5d71c9',
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
  });
  return (
    <Card containerStyle={styles.card}>
      <Text style={styles.header}>Työkokemus</Text>
      {experience && experience.length === 0 && (
        <Text style={{color: '#5d71c9', textAlign: 'center'}}>
          Ei lisättyä työkokemusta
        </Text>
      )}
      {experience.map((exp) => (
        <Card key={exp.experience_id} containerStyle={{borderRadius: 10}}>
          {expEditing !== exp.experience_id ? (
            <>
              <Text style={styles.boldText}>Työnimike:</Text>
              <Text style={styles.text}>{exp.job_title}</Text>
              <Text style={styles.boldText}>Työpaikka:</Text>
              <Text style={styles.text}>{exp.job_place}</Text>
              {exp.description ? (
                <>
                  <Text style={styles.boldText}>Kuvaus:</Text>
                  <Text style={styles.text}>{exp.description}</Text>
                </>
              ) : null}
              <Text style={styles.boldText}>Työskentely alkaa:</Text>
              <Text style={styles.text}>
                {new Date(exp.start_date).toLocaleDateString('fi-FI')}
              </Text>
              {exp.end_date ? (
                <>
                  <Text style={styles.boldText}>Työskentely päättyy:</Text>
                  <Text style={styles.text}>
                    {new Date(exp.end_date).toLocaleDateString('fi-FI')}
                  </Text>
                </>
              ) : (
                <Text style={styles.text}>Nykyinen työpaikka ✅</Text>
              )}
              <TouchableOpacity
                onPress={() => setExpEditing(exp.experience_id)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  size={25}
                  style={{color: '#5d71c9', margin: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(exp.experience_id)}>
                <FontAwesomeIcon
                  icon={faTrash}
                  size={25}
                  style={{color: '#5d71c9', margin: 5}}
                />
              </TouchableOpacity>
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
                    value={value ?? ''}
                    placeholder={
                      expEditing === null ? 'Työnimike' : exp.job_title
                    }
                  />
                )}
                name="job_title"
              />
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    placeholder={
                      expEditing === null ? 'Työpaikka' : exp.job_place
                    }
                  />
                )}
                name="job_place"
              />
              <Controller
                control={control}
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value ?? ''}
                    placeholder={
                      expEditing === null || !exp.description
                        ? 'Kuvaus'
                        : exp.description
                    }
                  />
                )}
                name="description"
              />
              <Button
                title="Tallenna"
                onPress={handleSubmit(edit)}
                buttonStyle={styles.saveButton}
              />
              <Button
                title="Peruuta"
                onPress={() => setExpEditing(null)}
                buttonStyle={styles.cancelButton}
                titleStyle={{color: '#5d71c9'}}
              />
            </>
          )}
        </Card>
      ))}
      {!expPosting ? (
        <TouchableOpacity onPress={() => setExpPosting(true)}>
          <FontAwesomeIcon icon={faAdd} style={styles.icon} size={30} />
        </TouchableOpacity>
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
                placeholder="Työnimike"
              />
            )}
            name="job_title"
            rules={{required: 'Työnimike vaaditaan'}}
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                placeholder="Työpaikka"
              />
            )}
            name="job_place"
            rules={{required: 'Työpaikka vaaditaan'}}
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                placeholder="Työkaupunki"
              />
            )}
            name="job_city"
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value ?? ''}
                placeholder="Kuvaus"
              />
            )}
            name="description"
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <DatePicker
                value={value as Date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || value;
                  onChange(currentDate);
                  setStartDate(currentDate);
                }}
              />
            )}
            name="start_date"
          />
          <Controller
            control={control}
            render={({field: {onChange, onBlur, value}}) => (
              <DatePicker
                value={value as Date}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  const currentDate = selectedDate || value;
                  onChange(currentDate);
                  setEndDate(currentDate);
                }}
              />
            )}
            name="end_date"
          />

          <Button
            title="Tallenna"
            onPress={handleSubmit(edit)}
            buttonStyle={styles.saveButton}
          />
          <Button
            title="Peruuta"
            onPress={() => setExpPosting(false)}
            buttonStyle={styles.cancelButton}
            titleStyle={{color: '#5d71c9'}}
          />
        </>
      )}
    </Card>
  );
}

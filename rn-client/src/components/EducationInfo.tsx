/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faAdd} from '@fortawesome/free-solid-svg-icons';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Education, EducationInfo} from '../types/DBTypes';
import {useEducation} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function Edu({education}: {education: Education[]}) {
  const [eduEditing, setEduEditing] = useState<number | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {putEducation} = useEducation();
  const {update, setUpdate} = useUpdateContext();
  const values: EducationInfo = {
    school: '',
    degree: '',
    field: '',
    graduation: '',
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

  const edit = async (inputs: EducationInfo) => {
    console.log(inputs, 'inputs');
    if (eduEditing) {
      await putEducation(eduEditing, inputs);
      setEduEditing(null);
      setUpdate((prevState) => !prevState);
      resetForm();
    }
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
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderColor: '#5d71c9',
    },
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 0,
    },
    input: {
      height: 40,
      marginVertical: 5,
      borderWidth: 1,
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
    },
  });

  return (
    <Card containerStyle={styles.card}>
      <Text style={styles.header}>Koulutus</Text>
      {education.map((edu) => (
        <Card key={edu.education_id}>
          {eduEditing !== edu.education_id ? (
            <>
              <Text style={styles.text}>Koulu: {edu.school}</Text>
              <Text style={styles.text}>Tutkinto: {edu.degree}</Text>
              <Text style={styles.text}>Ala: {edu.field}</Text>
              <Text style={styles.text}>
                Valmistumispäivä:{' '}
                {new Date(edu.graduation).toLocaleDateString('fi-FI')}
              </Text>
            </>
          ) : (
            <>
              <Controller
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={eduEditing === null ? 'Koulu' : edu.school}
                  />
                )}
                name="school"
                control={control}
              />
              <Controller
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={eduEditing === null ? 'Tutkinto' : edu.degree}
                  />
                )}
                name="degree"
                control={control}
              />
              <Controller
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={eduEditing === null ? 'Ala' : edu.field}
                  />
                )}
                name="field"
                control={control}
              />
              <Controller
                render={({field: {onChange, onBlur, value}}) => (
                  <TextInput
                    style={styles.input}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    placeholder={
                      eduEditing === null
                        ? 'Valmistumispäivä'
                        : new Date(edu.graduation).toLocaleDateString('fi-FI')
                    }
                  />
                )}
                name="graduation"
                control={control}
              />
              <TouchableOpacity onPress={handleSubmit(edit)}>
                <Text>Tallenna</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setEduEditing(null)}>
                <Text>Peruuta</Text>
              </TouchableOpacity>
            </>
          )}
          <TouchableOpacity onPress={() => setEduEditing(edu.education_id)}>
            <FontAwesomeIcon
              icon={faEdit}
              size={25}
              style={{color: '#5d71c9', margin: 5}}
            />
          </TouchableOpacity>
        </Card>
      ))}
      <TouchableOpacity>
        <FontAwesomeIcon icon={faAdd} style={styles.icon} size={30} />
      </TouchableOpacity>
    </Card>
  );
}

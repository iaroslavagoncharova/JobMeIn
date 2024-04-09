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
import {Card, Button, CheckBox} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit, faAdd, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import RNDateTimePicker, {
  DateTimePickerAndroid,
} from '@react-native-community/datetimepicker';
import {Education, EducationInfo} from '../types/DBTypes';
import {useEducation} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import EducationPost from './EducationPost';
import EducationUpdate from './EducationUpdate';

export default function Edu({education}: {education: Education[]}) {
  const [eduEditing, setEduEditing] = useState<number | null>(null);
  const [eduPosting, setEduPosting] = useState<boolean>(false);
  const [graduation, setGraduation] = useState<Date | null>(null);
  const [editGraduation, setEditGraduation] = useState<Date | null>(null);
  const [includeGraduationDate, setIncludeGraduationDate] =
    useState<boolean>(true);
  const [editIncludeGraduationDate, setEditIncludeGraduationDate] =
    useState<boolean>(true);
  const [open, setOpen] = useState<boolean>(false);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {putEducation, postEducation, deleteEducation} = useEducation();
  const {update, setUpdate} = useUpdateContext();
  const values: EducationInfo = {
    school: '',
    degree: '',
    field: '',
    graduation,
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

  const showMode = () => {
    setOpen(true);
  };

  const edit = async (inputs: EducationInfo) => {
    if (eduEditing) {
      if (!includeGraduationDate) {
        inputs.graduation = null;
      } else {
        // Change graduation date to be in format yyyy-mm-dd
        inputs.graduation = graduation
          ? graduation.toISOString().split('T')[0]
          : null;
      }
      await putEducation(eduEditing, inputs);
      setEduEditing(null);
      setUpdate((prevState) => !prevState);
      resetForm();
    }
  };

  const handleDelete = async (id: number) => {
    Alert.alert('Poista koulutus', 'Haluatko varmasti poistaa koulutuksen?', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: () => {
          deleteEducation(id);
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
      <Text style={styles.header}>Koulutus</Text>
      {education && education.length === 0 && (
        <Text style={{color: '#5d71c9', textAlign: 'center'}}>
          Ei lisättyä koulutusta
        </Text>
      )}
      {education.map((edu) => (
        <Card key={edu.education_id} containerStyle={{borderRadius: 10}}>
          {eduEditing !== edu.education_id ? (
            <>
              <Text style={styles.boldText}>Koulu:</Text>
              <Text style={styles.text}>{edu.school}</Text>
              <Text style={styles.boldText}>Tutkinto:</Text>
              <Text style={styles.text}>{edu.degree}</Text>
              <Text style={styles.boldText}>Ala:</Text>
              <Text style={styles.text}>
                {edu.field ? edu.field : 'Ei alaa'}
              </Text>
              <Text style={styles.boldText}>Valmistumispäivä:</Text>
              <Text style={styles.text}>
                {edu.graduation
                  ? new Date(edu.graduation).toLocaleDateString('fi-FI')
                  : 'Ei valmistumispäivää'}
              </Text>
              <TouchableOpacity onPress={() => setEduEditing(edu.education_id)}>
                <FontAwesomeIcon
                  icon={faEdit}
                  size={25}
                  style={{color: '#5d71c9', margin: 5}}
                />
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDelete(edu.education_id)}>
                <FontAwesomeIcon
                  icon={faTrash}
                  size={25}
                  style={{color: '#5d71c9', margin: 5}}
                />
              </TouchableOpacity>
            </>
          ) : (
            <EducationUpdate
              eduEditing={eduEditing}
              setEduEditing={setEduEditing}
              edu={edu}
              includeGraduationDate={includeGraduationDate}
              setIncludeGraduationDate={setIncludeGraduationDate}
            />
          )}
        </Card>
      ))}
      {!eduPosting ? (
        <TouchableOpacity onPress={() => setEduPosting(true)}>
          <FontAwesomeIcon icon={faAdd} style={styles.icon} size={30} />
        </TouchableOpacity>
      ) : (
        <EducationPost eduPosting={eduPosting} setEduPosting={setEduPosting} />
      )}
    </Card>
  );
}

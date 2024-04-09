import {Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import {CheckBox} from 'react-native-elements';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {EducationInfo} from '../types/DBTypes';
import {useEducation} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function EducationUpdate({
  eduEditing,
  setEduEditing,
  edu,
  includeGraduationDate,
  setIncludeGraduationDate,
}: {
  eduEditing: number | null;
  setEduEditing: React.Dispatch<React.SetStateAction<number | null>>;
  edu: EducationInfo;
  includeGraduationDate: boolean;
  setIncludeGraduationDate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [graduation, setGraduation] = useState<Date | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const {putEducation} = useEducation();
  const {setUpdate} = useUpdateContext();
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
      graduation?.setDate(graduation.getDate() + 1);
      const data = {
        school: inputs.school,
        degree: inputs.degree,
        field: inputs.field,
        graduation: graduation?.toISOString().split('T')[0],
      };
      await putEducation(eduEditing, data);
      setEduEditing(null);
      setUpdate((prevState) => !prevState);
      resetForm();
    }
  };

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
    calendarButton: {
      margin: 5,
      backgroundColor: '#ffffff',
      borderColor: '#004AAD',
      borderWidth: 3,
      borderRadius: 12,
    },
  });

  return (
    <>
      <Controller
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            placeholder={eduEditing === null ? 'Koulu' : edu.school ?? 'Koulu'}
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
            value={value ?? ''}
            placeholder={
              eduEditing === null ? 'Tutkinto' : edu.degree ?? 'Tutkinto'
            }
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
            value={value ?? ''}
            placeholder={eduEditing === null ? 'Ala' : edu.field ?? 'Ala'}
          />
        )}
        name="field"
        control={control}
      />
      <CheckBox
        checked={!includeGraduationDate}
        onPress={() => setIncludeGraduationDate(!includeGraduationDate)}
        title="Sisällytä valmistumispäivä"
      />
      {!includeGraduationDate ? (
        <>
          <Button
            title="Valitse valmistumispäivä"
            onPress={showMode}
            buttonStyle={styles.calendarButton}
            titleStyle={{color: '#5d71c9', fontSize: 15}}
          />
          <Text style={styles.text}>
            Valittu valmistumispäivä:{' '}
            {graduation
              ? graduation.toLocaleString().split(' ')[0]
              : edu.graduation
                ? new Date(edu.graduation).toLocaleString('fi-FI').split(' ')[0]
                : 'Ei valittu'}
          </Text>
          {open && (
            <RNDateTimePicker
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate ? selectedDate : null;
                setOpen(false);
                setGraduation(currentDate);
              }}
              value={edu.graduation ? new Date(edu.graduation) : new Date()}
              maximumDate={new Date()}
              positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
              negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
            />
          )}
        </>
      ) : null}
      <Button
        title="Tallenna"
        onPress={handleSubmit(edit)}
        buttonStyle={styles.saveButton}
      />
      <Button
        title="Peruuta"
        onPress={() => setEduEditing(null)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

import {StyleSheet, TextInput} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button} from '@rneui/base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {CheckBox, Text} from 'react-native-elements';
import {useExperience} from '../hooks/apiHooks';
import {ExperienceInfo} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ExperienceUpdate({
  expEditing,
  setExpEditing,
  exp,
  includeEndDate,
  setIncludeEndDate,
}: {
  expEditing: number | null;
  setExpEditing: React.Dispatch<React.SetStateAction<number | null>>;
  exp: ExperienceInfo;
  includeEndDate: boolean;
  setIncludeEndDate: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [openStart, setOpenStart] = useState<boolean>(false);
  const [openEnd, setOpenEnd] = useState<boolean>(false);
  const {putExperience} = useExperience();
  console.log(exp.start_date, startDate, 'exp.start_date, startDate');
  const values: ExperienceInfo = {
    job_title: '',
    job_place: '',
    job_city: '',
    description: '',
    start_date: startDate,
    end_date: endDate,
  };
  console.log(values, 'values');
  console.log(exp, endDate);
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  const showModeStart = () => {
    setOpenStart(true);
  };

  const showModeEnd = () => {
    setOpenEnd(true);
  };

  const edit = async (inputs: ExperienceInfo) => {
    if (expEditing) {
      if (!endDate) {
        inputs.end_date = null;
      } else {
        inputs.end_date = endDate ? endDate.toISOString().split('T')[0] : null;
      }
      // adding one day to startDate to avoid timezone issues
      startDate?.setDate(startDate.getDate() + 1);
      console.log(startDate, 'startDate');
      const data = {
        job_title: inputs.job_title,
        job_place: inputs.job_place,
        description: inputs.description,
        start_date: startDate?.toISOString().split('T')[0],
        end_date: endDate?.toISOString().split('T')[0],
      };
      console.log(data, 'data');
      await putExperience(expEditing, data);
      setExpEditing(null);
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
      textAlign: 'center',
    },
    boldText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5d71c9',
      textAlign: 'center',
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
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            placeholder={
              expEditing === null ? 'Työnimike' : exp.job_title ?? 'Työnimike'
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
              expEditing === null ? 'Työpaikka' : exp.job_place ?? ''
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
      <Text style={styles.text}>
        Työsuhteen alkamispäivä:{' '}
        {startDate
          ? startDate?.toLocaleString('fi-FI').split(' ')[0]
          : exp.start_date
            ? new Date(exp.start_date).toLocaleString('fi-FI').split(' ')[0]
            : 'Ei valittu'}
      </Text>
      <Button
        title="Muokkaa työsuhteen alkamispäivämäärää"
        titleStyle={{color: '#5d71c9', fontSize: 15}}
        onPress={showModeStart}
        buttonStyle={styles.calendarButton}
      />
      {openStart && (
        <RNDateTimePicker
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate ? selectedDate : null;
            setOpenStart(false);
            console.log(currentDate, 'currentDate', exp);
            setStartDate(currentDate);
          }}
          value={exp.start_date ? new Date(exp.start_date) : new Date()}
          maximumDate={new Date()}
          positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
          negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
        />
      )}
      <CheckBox
        title="Nykyinen työpaikka"
        checked={!includeEndDate}
        onPress={() => setIncludeEndDate(!includeEndDate)}
        containerStyle={{backgroundColor: '#ffffff', borderWidth: 0}}
        textStyle={{color: '#5d71c9'}}
      />
      {includeEndDate ? (
        <>
          <Button
            title="Muokkaa työsuhteen päättymispäivämäärää"
            titleStyle={{color: '#5d71c9', fontSize: 15}}
            onPress={() => showModeEnd()}
            buttonStyle={styles.calendarButton}
          />
          <Text style={styles.text}>
            Työsuhteen päättymispvm:{' '}
            {endDate
              ? endDate.toLocaleString('fi-FI').split(' ')[0]
              : exp.end_date
                ? new Date(exp.end_date).toLocaleString('fi-FI').split(' ')[0]
                : 'Ei valittu'}
          </Text>
          {openEnd && (
            <RNDateTimePicker
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate ? selectedDate : null;
                setOpenEnd(false);
                setEndDate(currentDate);
              }}
              value={exp.end_date ? new Date(exp.end_date) : new Date()}
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
        onPress={() => setExpEditing(null)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

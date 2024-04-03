/* eslint-disable @typescript-eslint/no-unused-vars */
import {TextInput, StyleSheet} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/base';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {CheckBox, Text} from 'react-native-elements';
import {useExperience} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {ExperienceInfo} from '../types/DBTypes';

export default function ExperiencePost({
  expPosting,
  setExpPosting,
}: {
  expPosting: boolean;
  setExpPosting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const {update, setUpdate} = useUpdateContext();
  const [start_date, setStartDate] = useState<Date | null>(null);
  const [end_date, setEndDate] = useState<Date | null>(null);
  const [includeEndDate, setIncludeEndDate] = useState<boolean>(false);
  const [openEnd, setOpenEnd] = useState<boolean>(false);
  const [openStart, setOpenStart] = useState<boolean>(false);
  const {postExperience} = useExperience();
  const values: ExperienceInfo = {
    job_title: '',
    job_place: '',
    job_city: '',
    description: '',
    start_date,
    end_date,
  };
  console.log(values, 'values');
  const {
    control,
    handleSubmit,
    formState: {errors},
    reset,
  } = useForm({defaultValues: values});

  const resetForm = () => {
    reset(values);
  };

  const handlePost = async (inputs: ExperienceInfo) => {
    console.log(inputs, 'inputs');
    if (!inputs.job_city || inputs.job_city === '') {
      inputs.job_city = null;
    }
    if (!inputs.description || inputs.description === '') {
      inputs.description = null;
    }
    if (!includeEndDate) {
      inputs.end_date = null;
    } else {
      inputs.end_date = end_date ? end_date.toISOString().split('T')[0] : null;
    }
    if (!start_date) {
      return;
    }
    inputs.start_date = start_date.toISOString().split('T')[0];
    console.log(start_date, 'start_date');
    console.log(inputs, 'inputs');
    await postExperience(inputs);
    setUpdate((prevState) => !prevState);
    resetForm();
    setExpPosting(false);
  };
  const styles = StyleSheet.create({
    input: {
      height: 40,
      margin: 5,
      borderWidth: 1,
      borderColor: '#5d71c9',
      borderRadius: 12,
      padding: 10,
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
    <>
      <Controller
        control={control}
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            placeholder="Työnimike*"
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
            placeholder="Työpaikka*"
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
      <Button
        title="Valitse työsuhteen alkamispäivä*"
        onPress={() => setOpenStart(true)}
        buttonStyle={styles.saveButton}
      />
      {openStart && (
        <RNDateTimePicker
          mode="date"
          display="default"
          onChange={(event, selectedDate) => {
            const currentDate = selectedDate ?? start_date;
            setOpenStart(false);
            setStartDate(currentDate);
          }}
          value={start_date ? start_date : new Date()}
          maximumDate={new Date()}
          positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
          negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
        />
      )}
      <Text style={{color: '#5d71c9', margin: 5}}>
        Työsuhteen alkamispäivä:{' '}
        {start_date ? start_date.toISOString().split('T')[0] : 'Ei valittu'}
      </Text>
      <CheckBox
        title="Nykyinen työpaikka"
        checked={!includeEndDate}
        onPress={() => {
          setIncludeEndDate(!includeEndDate);
        }}
      />
      {includeEndDate ? (
        <>
          <Button
            title="Valitse työsuhteen päättymispäivä"
            onPress={() => setOpenEnd(true)}
            buttonStyle={styles.saveButton}
          />
          {openEnd && (
            <RNDateTimePicker
              mode="date"
              display="default"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate ?? end_date;
                setOpenEnd(false);
                setEndDate(currentDate);
              }}
              value={end_date ? end_date : new Date()}
              maximumDate={new Date()}
              positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
              negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
            />
          )}
          <Text style={{color: '#5d71c9', margin: 5}}>
            Työsuhteen päättymispäivä:{' '}
            {end_date ? end_date.toISOString().split('T')[0] : 'Ei valittu'}
          </Text>
        </>
      ) : null}
      <Button
        title="Tallenna"
        onPress={handleSubmit(handlePost)}
        buttonStyle={styles.saveButton}
      />
      <Button
        title="Peruuta"
        onPress={() => setExpPosting(false)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

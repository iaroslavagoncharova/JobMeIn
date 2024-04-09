import {Text, StyleSheet, TextInput} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/base';
import {CheckBox} from 'react-native-elements';
import RNDateTimePicker from '@react-native-community/datetimepicker';
import {useEducation} from '../hooks/apiHooks';
import {EducationInfo} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function EducationPost({
  eduPosting,
  setEduPosting,
}: {
  eduPosting: boolean;
  setEduPosting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [graduation, setGraduation] = useState<Date | null>(null);
  const [includeGraduationDate, setIncludeGraduationDate] =
    useState<boolean>(true);
  const {update, setUpdate} = useUpdateContext();
  const [open, setOpen] = useState<boolean>(false);
  const {postEducation} = useEducation();
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

  const handlePost = async (inputs: EducationInfo) => {
    if (!inputs.field || inputs.field === '') {
      inputs.field = null;
    }
    if (!includeGraduationDate) {
      inputs.graduation = null;
    } else {
      // Change graduation date to be in format yyyy-mm-dd
      inputs.graduation = graduation
        ? graduation.toISOString().split('T')[0]
        : null;
    }
    await postEducation(inputs);
    setUpdate((prevState) => !prevState);
    resetForm();
    setEduPosting(false);
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
            placeholder="Koulu*"
          />
        )}
        name="school"
        control={control}
        rules={{required: 'Koulu on pakollinen'}}
      />
      <Controller
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            placeholder="Tutkinto*"
          />
        )}
        name="degree"
        control={control}
        rules={{required: 'Tutkinto on pakollinen'}}
      />
      <Controller
        render={({field: {onChange, onBlur, value}}) => (
          <TextInput
            style={styles.input}
            onBlur={onBlur}
            onChangeText={onChange}
            value={value ?? ''}
            placeholder="Ala"
          />
        )}
        name="field"
        control={control}
      />
      <CheckBox
        checked={includeGraduationDate}
        onPress={() => setIncludeGraduationDate(!includeGraduationDate)}
        title="Sisällytä valmistumispäivä"
      />
      {includeGraduationDate ? (
        <>
          <Button
            title="Valitse valmistumispäivä"
            titleStyle={{color: '#5d71c9', fontSize: 15}}
            onPress={showMode}
            buttonStyle={styles.calendarButton}
          />
          {open && (
            <RNDateTimePicker
              mode="date"
              display="calendar"
              onChange={(event, selectedDate) => {
                const currentDate = selectedDate ?? graduation;
                setOpen(false);
                setGraduation(currentDate);
              }}
              value={graduation ? graduation : new Date()}
              maximumDate={new Date()}
              positiveButton={{label: 'Valitse', textColor: '#5d71c9'}}
              negativeButton={{label: 'Peruuta', textColor: '#5d71c9'}}
            />
          )}
          <Text style={{color: '#5d71c9', margin: 5, textAlign: 'center'}}>
            Valittu valmistumispäivä:{' '}
            {graduation
              ? graduation.toLocaleString('fi-FI').split(' ')[0]
              : 'Ei valittu'}
          </Text>
        </>
      ) : null}
      <Button
        title="Lisää"
        onPress={handleSubmit(handlePost)}
        buttonStyle={styles.saveButton}
      />
      <Button
        title="Peruuta"
        onPress={() => setEduPosting(false)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

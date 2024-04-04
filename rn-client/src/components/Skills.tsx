import {Text, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import React, {useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd, faTrash} from '@fortawesome/free-solid-svg-icons';
import {Button, Card} from '@rneui/base';
import RNPickerSelect from 'react-native-picker-select';
import {useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Skill} from '../types/DBTypes';
import {useSkills} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function Skills({
  skills,
  allSkills,
}: {
  skills: Skill[];
  allSkills: Skill[];
}) {
  const [skillAdd, setSkillAdd] = useState<boolean>(false);
  const [selectedSkill, setSelectedSkill] = useState<string | null>(null);
  const {deleteSkill, postSkill} = useSkills();
  const {update, setUpdate} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const values: Omit<Skill, 'skill_id'> = {
    skill_name: '',
    type: '',
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
  const placeholder = {
    label: 'Valitse taito',
    value: null,
    color: '#5d71c9',
  };
  const items = allSkills.map((skill) => {
    return {
      label: skill.skill_name + ' (' + skill.type + ')',
      value: skill.skill_name,
      color: '#5d71c9',
    };
  });

  const handleAdd = async () => {
    const skill = allSkills.find((s) => s.skill_name === selectedSkill);
    if (skill) {
      const newSkill = {
        skill_id: skill.skill_id,
        skill_name: skill.skill_name,
        type: skill.type,
      };
      postSkill(newSkill);
      setUpdate((prevState) => !prevState);
      setSkillAdd(false);
    }
  };
  const handleDelete = async (id: number) => {
    Alert.alert('Poista taito', 'Haluatko varmasti poistaa taidon?', [
      {
        text: 'Peruuta',
        onPress: () => {},
        style: 'cancel',
      },
      {
        text: 'Poista',
        onPress: () => {
          deleteSkill(id);
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
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      marginVertical: 10,
    },
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      borderRadius: 10,
      borderColor: '#5d71c9',
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
    pickerInput: {
      padding: 10,
      margin: 10,
      borderRadius: 8,
      backgroundColor: 'white',
    },
  });
  return (
    <Card containerStyle={styles.card}>
      <Text style={styles.header}>Taidot (valitse 3-5 taitoa)</Text>
      {skills && skills.length === 0 && (
        <Text style={{color: '#5d71c9', textAlign: 'center'}}>
          Ei lisättyjä taitoja
        </Text>
      )}
      {skills.map((skill) => (
        <Card
          key={skill.skill_id}
          containerStyle={{
            borderRadius: 10,
          }}
        >
          <>
            <Text style={styles.boldText}>Taito:</Text>
            <Text style={styles.text}>{skill.skill_name}</Text>
            <Text style={styles.boldText}>Tyyppi:</Text>
            <Text style={styles.text}>{skill.type}</Text>
            <TouchableOpacity onPress={() => handleDelete(skill.skill_id)}>
              <FontAwesomeIcon
                icon={faTrash}
                size={25}
                style={{color: '#5d71c9', margin: 5}}
              />
            </TouchableOpacity>
          </>
        </Card>
      ))}
      {!skillAdd && skills.length < 5 && (
        <TouchableOpacity onPress={() => setSkillAdd(true)}>
          <FontAwesomeIcon icon={faAdd} style={styles.icon} size={30} />
        </TouchableOpacity>
      )}
      {skillAdd ? (
        <Card containerStyle={styles.card}>
          <Text style={styles.header}>Lisää taito</Text>
          <RNPickerSelect
            items={items}
            placeholder={placeholder}
            value={selectedSkill}
            style={{
              inputIOS: styles.pickerInput,
              inputAndroid: styles.pickerInput,
              placeholder: {
                color: '#5d71c9',
              },
            }}
            onValueChange={(value) => {
              setSelectedSkill(value);
            }}
          />
          <Button
            title="Lisää"
            onPress={handleSubmit(handleAdd)}
            buttonStyle={styles.saveButton}
          />
          <Button
            title="Peruuta"
            titleStyle={{color: '#5d71c9'}}
            onPress={() => setSkillAdd(false)}
            buttonStyle={styles.cancelButton}
          />
        </Card>
      ) : null}
    </Card>
  );
}

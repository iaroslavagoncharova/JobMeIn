import {
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  View,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Button, Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faEdit} from '@fortawesome/free-solid-svg-icons';
import {Controller, useForm} from 'react-hook-form';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import {useUserContext} from '../hooks/ContextHooks';
import {UpdateUser, User} from '../types/DBTypes';

export default function PersonalInfo({user}: {user: User}) {
  const [personalEditing, setPersonalEditing] = useState<boolean>(false);
  const {handleEdit} = useUserContext();
  const [status, setStatus] = useState<string | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const values: UpdateUser = {
    email: user.email,
    fullname: user.fullname,
    phone: user.phone,
    address: user.address,
    about_me: user.about_me,
    username: user.username,
    field: user.field,
    link: user.link,
    status: user.status,
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

  const edit = async (inputs: UpdateUser) => {
    console.log(inputs, 'inputs');
    if (status) {
      inputs.status = status;
    }
    handleEdit(inputs);
    setPersonalEditing(!personalEditing);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', () => {
      resetForm();
    });

    return unsubscribe;
  }, []);

  const placeholder = {
    label: 'Valitse status',
    value: null,
    color: '#5d71c9',
  };

  const items = [
    {label: 'Aktiivinen', value: 'Active', color: '#5d71c9'},
    {label: 'Ei aktiivinen', value: 'Paused', color: '#5d71c9'},
  ];
  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      marginTop: 15,
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
    text: {
      marginTop: 5,
      marginBottom: 5,
      fontSize: 14,
      padding: 0,
      color: '#004AAD',
    },
    boldText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#5d71c9',
    },
    icon: {
      margin: 5,
      bottom: 35,
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
      {user ? (
        user.user_type === 'candidate' ? (
          <>
            <Text style={styles.header}>Henkilötiedot</Text>
            {!personalEditing ? (
              <View>
                <TouchableOpacity
                  style={{height: 1}}
                  onPress={() => setPersonalEditing(!personalEditing)}
                >
                  <FontAwesomeIcon
                    icon={faEdit}
                    size={25}
                    style={styles.icon}
                  />
                </TouchableOpacity>
                <Text style={styles.boldText}>Nimi:</Text>
                <Text style={styles.text}>{user?.fullname}</Text>
                <Text style={styles.boldText}>Sähköposti:</Text>
                <Text style={styles.text}>{user?.email}</Text>
                <Text style={styles.boldText}>Käyttäjänimi:</Text>
                <Text style={styles.text}>{user?.username}</Text>
                <Text style={styles.boldText}>Puhelinnumero:</Text>
                <Text style={styles.text}>{user?.phone}</Text>
                <Text style={styles.boldText}>Status:</Text>
                <Text style={styles.text}>
                  {user?.status
                    ? user?.status === 'Active'
                      ? 'Aktiivinen'
                      : 'Ei aktiivinen'
                    : 'Et ole määritellyt statusta, työnhakusi ei ole aktiivinen'}
                </Text>
                <Text style={styles.boldText}>Kerro itsestäsi:</Text>
                <Text style={styles.text}>
                  {user?.about_me ? user?.about_me : 'Ei kuvailua'}
                </Text>
              </View>
            ) : (
              <>
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.fullname}
                    />
                  )}
                  name="fullname"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.email}
                    />
                  )}
                  name="email"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.phone}
                    />
                  )}
                  name="phone"
                />
                <RNPickerSelect
                  placeholder={placeholder}
                  items={items}
                  value={user.status}
                  onValueChange={(value) => {
                    setStatus(value);
                  }}
                  style={{
                    inputIOS: styles.input,
                    inputAndroid: styles.input,
                    placeholder: {
                      color: '#5d71c9',
                    },
                  }}
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={
                        user?.about_me ? user?.about_me : 'Kerro itsestäsi'
                      }
                    />
                  )}
                  name="about_me"
                />
                <Button
                  onPress={handleSubmit(edit)}
                  buttonStyle={styles.saveButton}
                  title={'Tallenna'}
                />
                <Button
                  onPress={() => setPersonalEditing(!personalEditing)}
                  buttonStyle={styles.cancelButton}
                  titleStyle={{color: '#5d71c9'}}
                  title={'Peruuta'}
                />
              </>
            )}
          </>
        ) : (
          <>
            {!personalEditing ? (
              <>
                <Text style={styles.header}>Yrityksen tiedot</Text>
                <View>
                  <TouchableOpacity
                    style={{height: 1}}
                    onPress={() => setPersonalEditing(!personalEditing)}
                  >
                    <FontAwesomeIcon
                      icon={faEdit}
                      size={25}
                      style={styles.icon}
                    />
                  </TouchableOpacity>
                  <Text style={styles.boldText}>Yhteyshenkilö:</Text>
                  <Text style={styles.text}>{user?.fullname}</Text>
                  <Text style={styles.boldText}>Sähköposti:</Text>
                  <Text style={styles.text}>{user?.email}</Text>
                  <Text style={styles.boldText}>Yrityksen nimi:</Text>
                  <Text style={styles.text}>{user?.username}</Text>
                  <Text style={styles.boldText}>Puhelinnumero:</Text>
                  <Text style={styles.text}>{user?.phone}</Text>
                  <Text style={styles.boldText}>Osoite:</Text>
                  <Text style={styles.text}>
                    {user?.address ? user?.address : 'Ei osoitetta'}
                  </Text>
                  <Text style={styles.boldText}>Ala:</Text>
                  <Text style={styles.text}>
                    {user?.field ? user?.field : 'Ei alaa'}
                  </Text>
                  <Text style={styles.boldText}>Meistä:</Text>
                  <Text style={styles.text}>
                    {user?.about_me ? user?.about_me : 'Ei kuvailua'}
                  </Text>
                </View>
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
                      value={value}
                      placeholder={user?.fullname ? user?.fullname : 'Nimi'}
                    />
                  )}
                  name="fullname"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.email ? user?.email : 'Sähköposti'}
                    />
                  )}
                  name="email"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={
                        user?.username ? user?.username : 'Yrityksen nimi'
                      }
                    />
                  )}
                  name="username"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.phone ? user?.phone : 'Puhelinnumero'}
                    />
                  )}
                  name="phone"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.address ? user?.address : 'Osoite'}
                    />
                  )}
                  name="address"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={user?.field ? user?.field : 'Ala'}
                    />
                  )}
                  name="field"
                />
                <Controller
                  control={control}
                  render={({field: {onChange, onBlur, value}}) => (
                    <TextInput
                      style={styles.input}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      placeholder={
                        user?.about_me ? user?.about_me : 'Kerro yrityksestäsi'
                      }
                    />
                  )}
                  name="about_me"
                />
                <Button
                  onPress={handleSubmit(edit)}
                  buttonStyle={styles.saveButton}
                  title={'Tallenna'}
                />
                <Button
                  onPress={() => setPersonalEditing(!personalEditing)}
                  buttonStyle={styles.cancelButton}
                  titleStyle={{color: '#5d71c9'}}
                  title={'Peruuta'}
                />
              </>
            )}
          </>
        )
      ) : (
        <Text style={{color: '#ffffff'}}>Loading...</Text>
      )}
    </Card>
  );
}

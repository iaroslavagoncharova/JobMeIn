import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/base';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAttachments, useEducation, useFile} from '../hooks/apiHooks';
import {UploadAttachment} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function AttachmentPost({
  attachmentPosting,
  setAttachmentPosting,
}: {
  attachmentPosting: boolean;
  setAttachmentPosting: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const [file, setFile] = useState<File | null>(null);
  const [fileUri, setFileUri] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const {postFile} = useFile();
  const {attachments, getUserAttachments, postAttachment} = useAttachments();
  const {update, setUpdate} = useUpdateContext();
  const [open, setOpen] = useState<boolean>(false);
  const {postEducation} = useEducation();
  const values: UploadAttachment = {
    attachment_name: '',
    file: null,
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handlePost = async (inputs: UploadAttachment) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const {attachment_name, file} = inputs;
      console.log('fileUri', fileUri);
      console.log(inputs);
      if (!token || !file) {
        return;
      }
      const fileResult = await postFile(fileUri, token);
      if (fileResult) {
        const postResult = await postAttachment(
          fileResult,
          attachment_name ?? '',
        );
        if (postResult) {
          setUpdate((prevState) => !prevState);
          resetForm();
          setAttachmentPosting(false);
        }
      }
    } catch (e) {
      console.log((e as Error).message);
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
            placeholder="Liitteen nimi*"
          />
        )}
        name="attachment_name"
        control={control}
        rules={{required: 'Liitteen nimi on pakollinen'}}
      />
      <Controller
        render={({field: {onChange, onBlur, value}}) => (
          <TouchableOpacity
            style={styles.input}
            onBlur={onBlur}
            onPress={async () => {
              try {
                // get pdf or doc files only
                const res = await DocumentPicker.getDocumentAsync({
                  type: [
                    'application/pdf',
                    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  ],
                  copyToCacheDirectory: true,
                });
                if (!res.canceled) {
                  setFileUri(res.assets[0].uri);
                  setFileName(res.assets[0].name);
                  onChange(res);
                } else {
                  console.log('cancelled');
                }
              } catch (err) {
                throw err;
              }
            }}
          >
            {fileUri ? <Text>{fileName}</Text> : <Text>Valitse tiedosto</Text>}
          </TouchableOpacity>
        )}
        name="file"
        control={control}
        rules={{required: 'Tiedosto on pakollinen'}}
      />
      <Button
        title="Lisää"
        onPress={handleSubmit(handlePost)}
        buttonStyle={styles.saveButton}
      />
      <Button
        title="Peruuta"
        onPress={() => setAttachmentPosting(false)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

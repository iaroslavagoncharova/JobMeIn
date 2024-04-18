import {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import * as DocumentPicker from 'expo-document-picker';
import {StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {Button, Text} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Attachment,
  FileValues,
  UpdateAttachment,
  UploadAttachment,
} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';
import {useAttachments, useFile} from '../hooks/apiHooks';

export default function AttachmentUpdate({
  attachmentEditing,
  setAttachmentEditing,
  attachment,
}: {
  attachmentEditing: number | null;
  setAttachmentEditing: React.Dispatch<React.SetStateAction<number | null>>;
  attachment: Attachment;
}) {
  const [open, setOpen] = useState<boolean>(false);
  const [fileUri, setFileUri] = useState<string>('');
  const [fileName, setFileName] = useState<string>('');
  const [fileValues, setFileValues] = useState({
    filename: '',
    filesize: 0,
    media_type: '',
    uri: '',
  });
  const {putAttachment, getAttachmentById, thisAttachment} = useAttachments();
  const {postFile} = useFile();
  const {update, setUpdate} = useUpdateContext();
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

  useEffect(() => {
    attachmentEditing && getAttachmentById(attachmentEditing);
  }, [update]);

  const edit = async (inputs: UploadAttachment) => {
    console.log('edit entered, inputs: ', inputs);
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    console.log('file', inputs.file);
    console.log('file uri', fileValues.uri);

    if (attachmentEditing) {
      const updatedData: UpdateAttachment = {};
      if (!inputs.attachment_name && !inputs.file) {
        throw new Error('Nothing to update');
      }
      if (inputs.attachment_name && inputs.attachment_name !== '') {
        updatedData.attachment_name = inputs.attachment_name;
      }

      if (inputs.file && fileValues.uri !== '') {
        console.log(inputs.file);
        console.log('fileValues uri', fileValues.uri);
        const fileResult = await postFile(fileValues.uri, token);
        if (fileResult) {
          updatedData.filename = fileResult.data.filename;
          updatedData.preferred_filename = fileValues.filename;
          updatedData.filesize = fileResult.data.filesize;
          updatedData.media_type = fileResult.data.media_type;
        }
      }

      console.log('updatedData', updatedData);
      console.log('attachmentEditing', attachmentEditing);
      await putAttachment(attachmentEditing, updatedData);
      setAttachmentEditing(null);
      setUpdate((prev) => !prev);
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
            placeholder={
              attachmentEditing === null
                ? 'Liitteen nimi'
                : attachment.attachment_name ?? 'Liitteen nimi'
            }
          />
        )}
        name="attachment_name"
        control={control}
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
                console.log(res);
                if (!res.canceled) {
                  console.log('!res.canceled');
                  setFileValues({
                    filename: res.assets[0].name,
                    filesize: res.assets[0].size ?? 0,
                    media_type: res.assets[0].mimeType ?? '',
                    uri: res.assets[0].uri,
                  });
                  console.log('file values', fileValues);
                  setFileName(fileValues.filename);
                  setFileUri(fileValues.uri);
                  console.log(
                    'file uri and name',
                    fileValues.uri,
                    fileValues.filename,
                  );
                  console.log(res);
                  onChange(res);
                } else if (res.canceled) {
                  console.log('cancelled');
                  setFileName('');
                  setFileUri('');
                }
              } catch (err) {
                throw err;
              }
            }}
          >
            <Text>
              {fileUri && fileUri !== '' ? fileName : thisAttachment?.filename}
            </Text>
          </TouchableOpacity>
        )}
        name="file"
        control={control}
      />
      <Button
        title="Tallenna"
        onPress={handleSubmit(edit)}
        buttonStyle={styles.saveButton}
      />
      <Button
        title="Peruuta"
        onPress={() => setAttachmentEditing(null)}
        buttonStyle={styles.cancelButton}
        titleStyle={{color: '#5d71c9'}}
      />
    </>
  );
}

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
  const {putAttachment, getAttachmentById, thisAttachment} = useAttachments();
  const {postFile} = useFile();
  const {update, setUpdate} = useUpdateContext();
  const values: UploadAttachment = {
    attachment_name: '',
    file: null,
  };

  const fileValues: FileValues = {};

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
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      return;
    }
    console.log('file', inputs.file);
    if (attachmentEditing) {
      const updatedData: UpdateAttachment = {
        attachment_name: inputs.attachment_name
          ? inputs.attachment_name
          : thisAttachment?.attachment_name,
      };

      if (inputs.file) {
        const fileResult = await postFile(fileUri, token);
        if (fileResult) {
          updatedData.filename = fileValues.filename;
          updatedData.filesize = fileValues.filesize;
          updatedData.media_type = fileValues.media_type;
        }
      }

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
                if (!res.canceled) {
                  onChange(res);
                  setFileUri(res.assets[0].uri);
                  console.log('file uri', fileUri);
                  setFileName(res.assets[0].name);
                  console.log('file name', fileName);
                  fileValues.filename = res.assets[0].name;
                  fileValues.filesize = res.assets[0].size;
                  fileValues.media_type = res.assets[0].mimeType;
                  console.log('file uri and name', fileUri, fileName);
                } else {
                  console.log('cancelled');
                  setFileName('');
                  setFileUri('');
                }
              } catch (err) {
                throw err;
              }
            }}
          >
            <Text>{fileUri ? fileName : thisAttachment?.filename}</Text>
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

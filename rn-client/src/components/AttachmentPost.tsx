import {Text, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {Button} from '@rneui/base';
import DocumentPicker from 'react-native-document-picker';
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
  const [file, setFile] = useState(null);
  const {postFile} = useFile();
  const {postAttachment} = useAttachments();
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

  const handlePost = async (inputs: UploadAttachment) => {
    try {
      const token = localStorage.getItem('token');
      const {attachment_name, file} = inputs;
      if (!token || !file) {
        return;
      }
      const fileResult = await postFile(file, token);
      await postAttachment(fileResult, attachment_name);
      setUpdate((prevState) => !prevState);
      resetForm();
      setAttachmentPosting(false);
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
                const res = await DocumentPicker.pick({
                  type: [
                    DocumentPicker.types.pdf,
                    DocumentPicker.types.docx,
                    DocumentPicker.types.doc,
                  ],
                });

                onChange(res);
              } catch (err) {
                if (DocumentPicker.isCancel(err)) {
                  console.log('cancelled');
                } else {
                  throw err;
                }
              }
            }}
          >
            {value ? <Text>{value.name}</Text> : <Text>Valitse tiedosto</Text>}
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

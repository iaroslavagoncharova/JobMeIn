import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd, faEdit} from '@fortawesome/free-solid-svg-icons';
import {Attachment} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';
import AttachmentPost from './AttachmentPost';
import AttachmentUpdate from './AttachmentUpdate';

export default function Attachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [attachmentEditing, setAttachmentEditing] = useState<number | null>(
    null,
  );
  const [attachmentPosting, setAttachmentPosting] = useState<boolean>(false);
  const {update, setUpdate} = useUpdateContext();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: '#ffffff',
      margin: 5,
      padding: 10,
      justifyContent: 'center',
      alignItems: 'center',
      borderRadius: 10,
      borderColor: '#5d71c9',
    },
    header: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
    },
    icon: {
      margin: 10,
      backgroundColor: '#5d71c9',
      color: '#ffffff',
      borderRadius: 50,
      left: '70%',
    },
    text: {
      color: '#5d71c9',
      fontSize: 15,
      margin: 5,
    },
    boldText: {
      color: '#5d71c9',
      fontSize: 15,
      fontWeight: 'bold',
      margin: 5,
    },
  });
  return (
    <Card containerStyle={styles.card}>
      <Text style={styles.header}> Liitteet </Text>
      {attachments && attachments.length === 0 && (
        <Text style={{color: '#5d71c9', textAlign: 'center'}}>
          Ei lisättyjä liitteitä
        </Text>
      )}
      {attachments.map((attachment) => (
        <Card
          key={attachment.attachment_id}
          containerStyle={{borderRadius: 10}}
        >
          {attachmentEditing !== attachment.attachment_id ? (
            <>
              <Text style={styles.boldText}>{attachment.attachment_name}</Text>
              <Text style={styles.text}>{attachment.filename}</Text>
              <TouchableOpacity
                onPress={() => setAttachmentEditing(attachment.attachment_id)}
              >
                <FontAwesomeIcon
                  icon={faEdit}
                  size={25}
                  style={{color: '#5d71c9', margin: 5}}
                />
              </TouchableOpacity>
            </>
          ) : (
            <AttachmentUpdate
              attachmentEditing={attachmentEditing}
              setAttachmentEditing={setAttachmentEditing}
              attachment={attachment}
            />
          )}
        </Card>
      ))}
      {!attachmentPosting ? (
        <TouchableOpacity onPress={() => setAttachmentPosting(true)}>
          <FontAwesomeIcon icon={faAdd} style={styles.icon} size={30} />
        </TouchableOpacity>
      ) : (
        <AttachmentPost
          attachmentPosting={attachmentPosting}
          setAttachmentPosting={setAttachmentPosting}
        />
      )}
    </Card>
  );
}

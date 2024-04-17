import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React, {useState} from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faAdd} from '@fortawesome/free-solid-svg-icons';
import {Attachment} from '../types/DBTypes';
import AttachmentPost from './AttachmentPost';

export default function Attachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
  const [attachmentPosting, setAttachmentPosting] = useState();
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
      {attachments.map((attachment) => (
        <Card
          key={attachment.attachment_id}
          containerStyle={{borderRadius: 10}}
        >
          <Text style={styles.boldText}>{attachment.attachment_name}</Text>
          <Text style={styles.text}>{attachment.link}</Text>
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

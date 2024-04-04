import {View, Text, StyleSheet} from 'react-native';
import React from 'react';
import {Card} from '@rneui/base';
import {Attachment} from '../types/DBTypes';

export default function Attachments({
  attachments,
}: {
  attachments: Attachment[];
}) {
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
    </Card>
  );
}

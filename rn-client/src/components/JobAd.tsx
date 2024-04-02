import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import React from 'react';
import {Card} from '@rneui/base';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  faArrowAltCircleLeft,
  faArrowAltCircleRight,
} from '@fortawesome/free-solid-svg-icons';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';

export default function JobAd({job}: {job: JobWithSkillsAndKeywords}) {
  const styles = StyleSheet.create({
    card: {
      width: '90%',
      margin: 50,
      padding: 20,
      borderRadius: 25,
      alignItems: 'center',
      backgroundColor: '#ffffff',
    },
    header1: {
      color: '#5d71c9',
      fontSize: 25,
      fontWeight: 'bold',
      marginTop: 50,
      textAlign: 'center',
      margin: 5,
    },
    header2: {
      color: '#5d71c9',
      fontSize: 20,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 5,
    },
    header3: {
      color: '#5d71c9',
      fontSize: 15,
      fontWeight: 'bold',
      textAlign: 'center',
      margin: 5,
    },
    keywords: {
      color: '#ffffff',
      backgroundColor: '#004AAD',
      borderRadius: 25,
      padding: 10,
      width: '50%',
      left: 75,
      top: 10,
    },
    skills: {
      color: '#ffffff',
      backgroundColor: '#004AAD',
      borderRadius: 25,
      padding: 10,
      width: '50%',
      left: 15,
    },
    percent: {
      color: '#ffffff',
      backgroundColor: '#5d71c9',
      paddingTop: 23,
      fontSize: 35,
      textAlign: 'center',
      borderRadius: 50,
      width: 100,
      height: 100,
      left: 70,
      marginVertical: 15,
    },
    buttonRight: {
      color: '#ffffff',
      borderRadius: 25,
      width: 50,
      height: 50,
      top: 40,
      left: 70,
    },
    buttonLeft: {
      color: '#ffffff',
      borderRadius: 25,
      width: 50,
      height: 50,
      bottom: 5,
      right: 60,
    },
  });
  return (
    <View
      style={{
        alignItems: 'center',
      }}
    >
      <Text></Text>
      <Card containerStyle={styles.card}>
        <Text style={styles.header1}>{job.job_title}</Text>
        <Text style={styles.header2}>Yritys: {job.username}</Text>
        <Text style={styles.header3}>Sijainti: {job.job_address}</Text>
        <Text style={styles.header3}>Palkka: {job.salary}€/kk</Text>
        <Text style={styles.percent}>56%</Text>
        <Text style={styles.skills}>{job.skills}</Text>
        <Text style={styles.keywords}>{job.keywords}</Text>
      </Card>
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={faArrowAltCircleRight}
          size={45}
          style={styles.buttonRight}
        />
      </TouchableOpacity>
      <TouchableOpacity>
        <FontAwesomeIcon
          icon={faArrowAltCircleLeft}
          size={45}
          style={styles.buttonLeft}
        />
      </TouchableOpacity>
    </View>
  );
}

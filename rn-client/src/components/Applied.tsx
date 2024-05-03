import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {Application, ApplicationApplied, JobWithUser} from '../types/DBTypes';
import {useApplications, useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

const Applied = () => {
  const {sentApplications} = useApplications();
  const {getJobForApplication} = useJobs();
  const {update} = useUpdateContext();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  useEffect(() => {
    const fetchJobs = async () => {
      const jobsData: JobWithUser[] = [];
      if (!sentApplications || sentApplications.length === 0) {
        return;
      }
      for (const application of sentApplications as Application[]) {
        const job = await getJobForApplication(application.job_id);
        if (job) {
          jobsData.push(job);
        }
      }
    };

    fetchJobs();
  }, [update]);
  console.log(showInstructions, 'showInstructions');
  const renderItem = ({item}: {item: Application}) => (
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.position}>{item.job.username}</Text>
        {item.job.job_title && (
          <Text style={styles.position}>{item.job.job_title}</Text>
        )}
        <Text
          style={styles.date}
        >{`Haettu ${item.created_at.toString().substring(0, 10).split('-').reverse().join('.')}`}</Text>
        <View style={styles.matchContainer}>
          <Text style={styles.matchPercentage}>{item.job.percentage}%</Text>
        </View>
        <Button
          title="Näytä hakemus"
          titleStyle={{color: '#ffffff'}}
          buttonStyle={styles.showButton}
          onPress={() => navigation.navigate('Hakemuksesi', item)}
        />
      </View>
    </View>
  );
  return (
    <>
      <Text style={styles.text}>Lähettämäsi hakemukset</Text>
      <FlatList
        data={sentApplications}
        renderItem={renderItem}
        keyExtractor={(item) => item.application_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      {showInstructions && (
        <TouchableOpacity
          onPress={() => setShowInstructions(false)}
          style={{
            position: 'absolute',
            bottom: 20,
            right: 20,
            backgroundColor: '#004aad',
            borderRadius: 50,
            width: 50,
            height: 50,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{color: '#ffffff', fontWeight: 'bold'}}>?</Text>
        </TouchableOpacity>
      )}
      {showInstructions && (
        <View
          style={{
            ...StyleSheet.absoluteFillObject,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <View
            style={{
              backgroundColor: '#ffffff',
              padding: 20,
              borderRadius: 10,
              margin: 10,
            }}
          >
            <Text style={styles.boldText}>Ohjeet</Text>
            <Text style={styles.text}>
              Tässä näet lähettämäsi hakemukset. Paina "Näytä hakemus"
              nähdäksesi hakemuksen tiedot.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.showButton}
              onPress={() => setShowInstructions(false)}
            />
          </View>
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
    minHeight: 100,
    borderColor: '#5d71c9',
    borderWidth: 2,
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
    color: '#5d71c9',
    textAlign: 'center',
  },
  date: {
    fontSize: 14,
    color: '#5d71c9',
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'center',
  },
  matchContainer: {
    position: 'absolute',
    right: 20,
    top: 20,
    backgroundColor: '#004aad',
    borderRadius: 50,
    width: 50,
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  matchPercentage: {
    color: '#ffffff',
    fontWeight: 'bold',
  },
  tests: {
    fontSize: 14,
    color: 'grey',
  },
  text: {
    fontSize: 16,
    color: '#5d71c9',
    textAlign: 'center',
    margin: 10,
  },
  boldText: {
    fontSize: 16,
    color: '#5d71c9',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
  },
  showButton: {
    margin: 5,
    backgroundColor: '#5d71c9',
    borderColor: '#004AAD',
    borderWidth: 3,
    borderRadius: 12,
  },
});

export default Applied;

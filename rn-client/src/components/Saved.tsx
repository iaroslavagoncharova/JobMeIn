import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  Application,
  ApplicationSaved,
  Job,
  JobWithUser,
} from '../types/DBTypes';
import {useApplications, useJobs, useUser} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

const Saved = () => {
  const {savedApplications} = useApplications();
  const {getJobForApplication} = useJobs();
  const {update} = useUpdateContext();
  const [jobs, setJobs] = useState<JobWithUser[]>([]);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  console.log(savedApplications, 'savedApplications ');

  useEffect(() => {
    const fetchJobs = async () => {
      const jobsData: JobWithUser[] = [];
      if (!savedApplications || savedApplications.length === 0) {
        return;
      }
      for (const application of savedApplications as Application[]) {
        const job = await getJobForApplication(application.job_id);
        if (job) {
          jobsData.push(job);
        }
        console.log(jobsData, 'jobsData');
      }
    };

    fetchJobs();
  }, [update]);

  const renderItem = ({item}: {item: Application}) => (
    <TouchableOpacity onPress={() => navigation.navigate('Hakemuksesi', item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.position}>{item.job.username}</Text>
        {item.job.job_title && (
          <Text style={styles.position}>{item.job.job_title}</Text>
        )}
        <Text
          style={styles.date}
        >{`Tallennettu ${item.created_at.toString().slice(0, 10)}`}</Text>
        <View style={styles.matchContainer}>
          <Text style={styles.matchPercentage}>{`100%`}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={savedApplications}
      renderItem={renderItem}
      keyExtractor={(item) => item.job_id.toString()}
      contentContainerStyle={styles.listContainer}
    />
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
  },
  position: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  date: {
    fontSize: 14,
    color: 'grey',
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
});

export default Saved;

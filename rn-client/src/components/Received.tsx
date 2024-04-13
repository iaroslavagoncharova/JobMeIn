import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useApplications, useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {Application, JobWithSkillsAndKeywords} from '../types/DBTypes';

export default function Received() {
  const {companyJobs, getJobsByCompany} = useJobs();
  const {getApplicationByJobId} = useApplications();
  const [applications, setApplications] = useState<{
    [jobId: number]: Application[];
  }>({});
  const {update} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  // Fetch applications for each job
  useEffect(() => {
    const fetchApplications = async () => {
      const applicationsData: {[jobId: number]: Application[]} = {};
      if (!companyJobs || companyJobs.length === 0) {
        return;
      }
      for (const job of companyJobs as JobWithSkillsAndKeywords[]) {
        const jobApplications = await getApplicationByJobId(job.job_id);
        if (jobApplications) {
          applicationsData[job.job_id] = jobApplications;
        }
      }
      setApplications(applicationsData);
    };

    fetchApplications();
  }, [update]);

  // Render applications for a job
  const renderApplications = (jobId: number) => {
    const jobApplications = applications[jobId] || [];
    return (
      <FlatList
        data={jobApplications}
        renderItem={({item}) => (
          <View style={styles.itemContainer}>
            <Text style={styles.date}>
              Työhakemuksen ID: {''}
              {item.application_id}
            </Text>
            <Text style={styles.date}>
              Lähetetty:{' '}
              {item.created_at
                ? item.created_at
                    .toString()
                    .substring(0, 10)
                    .split('-')
                    .reverse()
                    .join('.')
                : ''}
            </Text>
          </View>
        )}
        keyExtractor={(item) => item.application_id.toString()}
      />
    );
  };

  // Render each job along with its applications
  const renderItem = ({item}: {item: JobWithSkillsAndKeywords}) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('JobDetails', {jobId: item.job_id})}
    >
      <View style={styles.itemContainer}>
        <Text style={styles.position}>{item.job_title}</Text>
        {renderApplications(item.job_id)}
      </View>
    </TouchableOpacity>
  );

  return (
    <FlatList
      data={companyJobs}
      renderItem={renderItem}
      keyExtractor={(item) => item.job_id.toString()}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    padding: 10,
  },
  itemContainer: {
    backgroundColor: '#ffffff',
    borderRadius: 10,
    padding: 20,
    marginBottom: 10,
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
});

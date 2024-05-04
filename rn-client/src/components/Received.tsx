import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useApplications, useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';
import {Application, JobWithSkillsAndKeywords} from '../types/DBTypes';

export default function Received() {
  const {getJobsByCompany} = useJobs();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);
  const [companyJobs, setCompanyJobs] = useState<JobWithSkillsAndKeywords[]>(
    [],
  );
  const {getApplicationByJobId} = useApplications();
  const {update, setUpdate} = useUpdateContext();
  const [applications, setApplications] = useState<{
    [jobId: number]: Application[];
  }>({});
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('receivedInstructions');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('receivedInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);

  const handleFetchJobs = async () => {
    const jobs = await getJobsByCompany();
    if (jobs) {
      setCompanyJobs(jobs);
    }
  };

  useEffect(() => {
    handleFetchJobs();
  }, [update]);

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
    return jobApplications.length === 0 ? (
      <Text style={styles.date}>Ei hakemuksia tähän työpaikkaan</Text>
    ) : (
      <FlatList
        data={jobApplications ? jobApplications : []}
        renderItem={({item}) => (
          <View>
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
              <Button
                title="Näytä hakemus"
                titleStyle={{color: '#ffffff'}}
                buttonStyle={styles.showApplicationButton}
                onPress={() => navigation.navigate('SaapunutHakemus', item)}
              />
            </View>
          </View>
        )}
        keyExtractor={(item) => item.application_id.toString()}
      />
    );
  };

  // Render each job along with its applications
  const renderItem = ({item}: {item: JobWithSkillsAndKeywords}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.position}>{item.job_title}</Text>
      {renderApplications(item.job_id)}
    </View>
  );

  return (
    <>
      <TouchableOpacity onPress={() => setUpdate(!update)}>
        <FontAwesomeIcon icon={faRotateRight} size={40} color={'#5d71c9'} />
      </TouchableOpacity>
      <FlatList
        data={companyJobs}
        renderItem={renderItem}
        keyExtractor={(item) => item.job_id.toString()}
      />
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
              Tässä näet kaikki työpaikkailmoituksesi ja niille saapuneet
              hakemukset. Voit nähdä hakemukset klikkaamalla "Näytä hakemus"
              -nappia. Jos et näe yhtään hakemusta, paina "Päivitä" -nappia.
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
  showApplicationButton: {
    margin: 5,
    backgroundColor: '#5d71c9',
    borderColor: '#004AAD',
    borderWidth: 3,
    borderRadius: 12,
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

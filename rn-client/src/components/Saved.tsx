import React, {useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import {Application, JobWithUser} from '../types/DBTypes';
import {useApplications, useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

const Saved = () => {
  const {savedApplications} = useApplications();
  const {getJobForApplication} = useJobs();
  const {update} = useUpdateContext();
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
    <View>
      <View style={styles.itemContainer}>
        <Text style={styles.position}>{item.job.username}</Text>
        {item.job.job_title && (
          <Text style={styles.position}>{item.job.job_title}</Text>
        )}
        <Text style={styles.date}>
          Hae ennen{' '}
          {item?.job.deadline_date
            ?.toString()
            .substring(0, 10)
            .split('-')
            .reverse()
            .join('.')}
        </Text>
        <Text
          style={{
            color: 'grey',
            textAlign: 'center',
          }}
        >{`Luotu ${item.created_at.toString().substring(0, 10).split('-').reverse().join('.')}`}</Text>
        <View style={styles.matchContainer}>
          <Text style={styles.matchPercentage}>{`100%`}</Text>
        </View>
        <Button
          title="Siirry hakemuksen lähettämiseen"
          titleStyle={{color: '#ffffff'}}
          buttonStyle={styles.applyButton}
          onPress={() => navigation.navigate('Hakemuksesi', item)}
        />
      </View>
    </View>
  );

  return (
    <>
      <Text style={styles.text}>Tykkäämäsi työpaikkailmoitukset</Text>
      <FlatList
        data={savedApplications}
        renderItem={renderItem}
        keyExtractor={(item) => item.job_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
  text: {
    fontSize: 16,
    color: '#5d71c9',
    textAlign: 'center',
    margin: 10,
  },
  applyButton: {
    margin: 5,
    backgroundColor: '#5d71c9',
    borderColor: '#004AAD',
    borderWidth: 3,
    borderRadius: 12,
  },
});

export default Saved;

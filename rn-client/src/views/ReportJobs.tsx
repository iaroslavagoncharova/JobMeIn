import {View, Text, StyleSheet, FlatList, TouchableOpacity} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useReports} from '../hooks/apiHooks';
import {ReportedJob, ReportedUser, User} from '../types/DBTypes';
import useUpdateContext from '../hooks/updateHooks';

export default function ReportedJobs() {
  const {getReportedJobs} = useReports();
  const {update, setUpdate} = useUpdateContext();
  const [jobs, setJobs] = useState<ReportedJob[] | null>(null);
  const navigation: NavigationProp<ParamListBase> = useNavigation();

  const handleGetReportedJobs = async () => {
    const reportedJobs = await getReportedJobs();
    if (reportedJobs) {
      setJobs(reportedJobs);
    }
  };

  console.log(jobs);

  useEffect(() => {
    handleGetReportedJobs();
  }, [update]);

  const renderItem = ({item}: {item: ReportedJob}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.position}>Raportin syy: {item.report_reason}</Text>
      <Text style={styles.text}>Työnimike: {item.job_title}</Text>
      <Text style={styles.text}>Osoite: {item.job_address}</Text>
      <Text style={styles.text}>Palkka: {item.salary}€/kk</Text>
      <Text style={styles.text}>
        Kuvaus: {item.job_description ? item.job_description : 'Ei kuvausta'}
      </Text>
      <Text style={styles.text}>
        Viimeinen hakupäivä:{' '}
        {item.deadline_date
          ? item.deadline_date
              .toString()
              .substring(0, 10)
              .split('-')
              .reverse()
              .join('.')
          : 'Ei määräaikaa'}
      </Text>
      <Text style={styles.text}>
        Ala: {''}
        {item.field ? item.field : 'Ei alaa'}
      </Text>
      <Text style={styles.text}>Yrityksen id: {item.user_id}</Text>
    </View>
  );

  return (
    <>
      <Text style={styles.text}>
        Tässä ovat työpaikat, jotka on raportoitu sivuston ylläpidolle.
      </Text>
      <FlatList
        data={jobs}
        renderItem={renderItem}
        keyExtractor={(job) => job.job_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
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
  text: {
    fontSize: 16,
    color: '#5d71c9',
    textAlign: 'center',
    margin: 10,
  },
});

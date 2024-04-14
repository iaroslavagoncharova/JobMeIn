import {View, Text, TouchableOpacity, FlatList, StyleSheet} from 'react-native';
import React, {useEffect} from 'react';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';
import {useJobs} from '../hooks/apiHooks';
import useUpdateContext from '../hooks/updateHooks';

export default function CompanyJobs() {
  const {companyJobs, getJobsByCompany} = useJobs();
  const {update} = useUpdateContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const renderJob = ({item}: {item: JobWithSkillsAndKeywords}) => (
    <TouchableOpacity onPress={() => navigation.navigate('Työpaikka', item)}>
      <View style={styles.itemContainer}>
        <Text style={styles.position}>{item.job_title}</Text>
        <Text style={styles.date}>
          {' '}
          Ennen{' '}
          {item.deadline_date
            .toString()
            .substring(0, 10)
            .split('-')
            .reverse()
            .join('.')}
        </Text>
      </View>
    </TouchableOpacity>
  );
  useEffect(() => {
    getJobsByCompany();
  }, [update]);
  return (
    <>
      <FlatList
        data={companyJobs}
        renderItem={renderJob}
        keyExtractor={(item) => item.job_id.toString()}
        contentContainerStyle={styles.listContainer}
      />
      <TouchableOpacity onPress={() => navigation.navigate('UusiTyöpaikka')}>
        <FontAwesomeIcon
          icon={faPlus}
          size={50}
          color={'white'}
          style={styles.addButton}
        />
      </TouchableOpacity>
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
  addButton: {
    position: 'absolute',
    margin: 5,
    right: 20,
    bottom: 20,
    backgroundColor: '#004aad',
    borderRadius: 50,
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
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

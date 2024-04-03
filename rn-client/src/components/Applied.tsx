import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

interface JobApplication {
  id: string;
  companyName: string;
  position: string;
  dateApplied: string;
  matchPercentage: number;
  testsCompleted: number;
  totalTests: number;
}

const appliedApplications: JobApplication[] = [
  {
    id: '1',
    companyName: 'Anna Oy',
    position: 'Senior Scrum Master',
    dateApplied: '6.3.2024',
    matchPercentage: 99,
    testsCompleted: 3,
    totalTests: 4,
  },
  {
    id: '2',
    companyName: 'Kamilla Oy',
    position: 'Senior Product Owner',
    dateApplied: '10.3.2024',
    matchPercentage: 99,
    testsCompleted: 3,
    totalTests: 3,
  },
  // Add more mock data here if necessary
];

const Applied = () => {
  const renderItem = ({item}: {item: JobApplication}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.position}>{item.position}</Text>
      <Text style={styles.date}>{`Applied on ${item.dateApplied}`}</Text>
      <View style={styles.matchContainer}>
        <Text style={styles.matchPercentage}>{`${item.matchPercentage}%`}</Text>
      </View>
      <Text
        style={styles.tests}
      >{`Tests: ${item.testsCompleted}/${item.totalTests}`}</Text>
    </View>
  );

  return (
    <FlatList
      data={appliedApplications}
      renderItem={renderItem}
      keyExtractor={(item) => item.id}
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
    minHeight: 100,
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
  tests: {
    fontSize: 14,
    color: 'grey',
  },
});

export default Applied;

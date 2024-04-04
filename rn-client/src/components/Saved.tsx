import React from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';
import {ApplicationSaved} from '../types/DBTypes';

const savedApplications: ApplicationSaved[] = [
  {
    id: '1',
    companyName: 'Anna Oy',
    position: 'Senior Scrum Master',
    dateSaved: '12.3.2024',
    matchPercentage: 99,
  },
];

const Saved = () => {
  const renderItem = ({item}: {item: ApplicationSaved}) => (
    <View style={styles.itemContainer}>
      <Text style={styles.position}>{item.position}</Text>
      <Text style={styles.date}>{`Saved on ${item.dateSaved}`}</Text>
      <View style={styles.matchContainer}>
        <Text style={styles.matchPercentage}>{`${item.matchPercentage}%`}</Text>
      </View>
    </View>
  );

  return (
    <FlatList
      data={savedApplications}
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

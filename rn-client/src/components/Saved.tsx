import React, {useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet, TouchableOpacity} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {Button} from 'react-native-elements';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Application} from '../types/DBTypes';
import {useApplications} from '../hooks/apiHooks';

const Saved = () => {
  const {savedApplications} = useApplications();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  const handleSetInstructions = async () => {
    const show = await AsyncStorage.getItem('savedInstructions');
    if (show) {
      setShowInstructions(false);
    } else {
      setShowInstructions(true);
      await AsyncStorage.setItem('savedInstructions', 'true');
    }
  };

  useEffect(() => {
    handleSetInstructions();
  }, []);

  console.log(savedApplications, 'savedApplications ');

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
        <Text
          style={{
            color: 'grey',
            textAlign: 'center',
          }}
        >
          Testejä: {item.job.userTestsCount ?? 0} /{' '}
          {item.job.jobTestsCount ?? 0}
        </Text>
        <View style={styles.matchContainer}>
          <Text style={styles.matchPercentage}>
            {item.job.percentage ?? 0}%
          </Text>
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
      {savedApplications && savedApplications.length === 0 && (
        <Text style={styles.text}>Ei hakemuksia</Text>
      )}
      <FlatList
        data={savedApplications}
        renderItem={renderItem}
        keyExtractor={(item) => item.job_id.toString()}
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
              Tässä näet työpaikkailmoitukset, joita olet swipannut oikealle.
              Voit siirtyä hakemuksen lähettämiseen painamalla "Siirry
              hakemuksen lähettämiseen" -nappia.
            </Text>
            <Button
              title="Sulje"
              titleStyle={{color: '#ffffff'}}
              buttonStyle={styles.applyButton}
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
  boldText: {
    fontSize: 16,
    color: '#5d71c9',
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 5,
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

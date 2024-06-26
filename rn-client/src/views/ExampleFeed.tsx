/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
  FlatList,
} from 'react-native';
// @ts-ignore
import SwipeCards from 'react-native-swipe-cards';
import {useEffect, useState} from 'react';
import {faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {Text} from 'react-native-elements';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import {Button} from '@rneui/base';
import {useUserContext} from '../hooks/ContextHooks';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';
import ExampleJobAd from '../components/ExampleJobAd';
import {useJobs} from '../hooks/apiHooks';
const ExampleFeed = () => {
  const {handleAutoLogin} = useUserContext();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const [selectedField, setSelectedField] = useState<string>('');
  const [showInstructions, setShowInstructions] = useState<boolean>(true);

  const placeholder = {
    label: 'Valitse ala',
    value: null,
    color: '#5d71c9',
  };

  const items = [
    {label: 'IT', value: 'IT', color: '#5d71c9'},
    {label: 'Ravintola-ala', value: 'Ravintola-ala', color: '#5d71c9'},
    {
      label: 'Sosiaali- ja terveysala',
      value: 'Sosiaali- ja terveysala',
      color: '#5d71c9',
    },
    {
      label: 'Kasvatus- ja opetusala',
      value: 'Kasvatus- ja opetusala',
      color: '#5d71c9',
    },
    {
      label: 'Myynti ja markkinointi',
      value: 'Myynti ja markkinointi',
      color: '#5d71c9',
    },
    {
      label: 'Hallinto ja toimisto',
      value: 'Hallinto ja toimisto',
      color: '#5d71c9',
    },
    {label: 'Rakennusala', value: 'Rakennusala', color: '#5d71c9'},
    {label: 'Teollisuus', value: 'Teollisuus', color: '#5d71c9'},
    {label: 'Muu', value: 'Muu', color: '#5d71c9'},
  ];

  const exampleCard = {
    job_id: 1,
    job_title: 'Esimerkkityö',
    salary: '1000',
    job_description: 'Työpaikkailmoitusesimerkki',
    field: 'Esimerkki',
    deadline_date: '2024-12-12',
    job_address: 'Helsinki',
    username: 'Esimerkki',
    keywords: 'esimerkki',
    skills: 'esimerkki',
  };
  useEffect(() => {
    handleAutoLogin();
  }, []);

  const handleYup = (job: JobWithSkillsAndKeywords) => {
    Alert.alert('Kirjaudu hakeaksesi työpaikkaa', '', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Kirjaudu/luo profiili');
        },
      },
    ]);
  };

  const handleNope = (job: JobWithSkillsAndKeywords) => {
    Alert.alert('Kirjaudu hakeaksesi työpaikkaa', '', [
      {
        text: 'OK',
        onPress: () => {
          navigation.navigate('Kirjaudu/luo profiili');
        },
      },
    ]);
  };

  const styles = StyleSheet.create({
    pickerInput: {
      color: '#ffffff',
      backgroundColor: '#004AAD',
      padding: 5,
      marginBottom: 15,
      width: '70%',
      alignSelf: 'center',
      top: 10,
    },
    button: {
      margin: 5,
      backgroundColor: '#ffffff',
      borderColor: '#004AAD',
      borderWidth: 3,
      borderRadius: 12,
    },
    text: {
      fontSize: 16,
      color: '#5d71c9',
      textAlign: 'center',
      margin: 5,
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

  return (
    <View style={{flex: 1, backgroundColor: '#5d71c9', alignItems: 'center'}}>
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        value={selectedField}
        onValueChange={(value) => setSelectedField(value)}
        style={{
          inputIOS: styles.pickerInput,
          inputAndroid: styles.pickerInput,
          placeholder: {
            color: '#ffffff',
          },
        }}
      />
      <Button
        title={'Tyhjennä suodattimet'}
        titleStyle={{color: '#5d71c9'}}
        buttonStyle={styles.button}
      />
      <SwipeCards
        key={1}
        cards={[exampleCard]}
        renderCard={(exampleCard: JobWithSkillsAndKeywords) => (
          <ExampleJobAd job={exampleCard} />
        )}
        renderNoMoreCards={() => (
          <View>
            <Text style={{color: '#ffffff', fontSize: 20}}>
              Ei enempää työpaikkoja
            </Text>
            <TouchableOpacity>
              <FontAwesomeIcon icon={faRotateRight} color="#ffffff" size={40} />
            </TouchableOpacity>
          </View>
        )}
        handleYup={handleYup}
        handleNope={handleNope}
        showYup={false}
        showNope={false}
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
            <Text style={styles.text}>
              Tinder työnhaulle? Me hoidamme! Swipe-and-match potentiaalisten
              työnantajien kanssa saadaksesi haastatteluja.
            </Text>
            <Text style={styles.boldText}>- Anonyymi ja syrjimätön haku</Text>
            <Text style={styles.boldText}>- Persoonallisuustestit</Text>
            <Text style={styles.boldText}>- Työpaikkailmoitukset</Text>
            <Text style={styles.boldText}>- Chat-keskustelut</Text>
            <Text style={styles.text}>
              Kirjaudu sisään tai luo profiili hakeaksesi työpaikkoja ja
              tallentaaksesi hakemuksia. Aloita urasi JobMe In-sovelluksessa!
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
    </View>
  );
};

export default ExampleFeed;

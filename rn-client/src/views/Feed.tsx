/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  View,
  ActivityIndicator,
  TouchableOpacity,
  Alert,
  StyleSheet,
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
import {useJobs, useMatch, useSwipe} from '../hooks/apiHooks';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';
import JobAd from '../components/JobAd';
import useUpdateContext from '../hooks/updateHooks';

const Feed = () => {
  const {handleAutoLogin} = useUserContext();
  const {jobs, fields, calculatePercentage} = useJobs();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {update, setUpdate} = useUpdateContext();
  const [selectedField, setSelectedField] = useState<string>('');
  const {postSwipe} = useSwipe();
  const {matches, deleteMatch} = useMatch();
  const [loading, setLoading] = useState(false);
  const [swipingEnabled, setSwipingEnabled] = useState(true);

  const handleCalculatePercentage = async (job_id: number) => {
    const result = await calculatePercentage(job_id);
    console.log(result);
  };

  console.log(jobs, 'jobs');

  useEffect(() => {
    handleCalculatePercentage(1);
  }, []);

  const placeholder = {
    label: 'Valitse ala',
    value: null,
    color: '#5d71c9',
  };

  const items = fields.map((field) => ({
    label: field,
    value: field,
    color: '#5d71c9',
  }));

  const filteredJobs =
    selectedField === null || selectedField === ''
      ? jobs
      : jobs.filter((job) => job.field === selectedField);
  console.log(selectedField, 'selectedField');
  console.log(jobs, 'jobs', filteredJobs, 'filteredJobs');
  const [resetTriggered, setResetTriggered] = useState<boolean>(false);

  const resetFilters = () => {
    setSelectedField('');
    setResetTriggered(!resetTriggered);
  };

  useEffect(() => {
    if (resetTriggered) {
      setResetTriggered(false);
    }
  }, [resetTriggered]);

  // display the match alerts and after a user clicks ok, delete the match and navigate to the chat
  useEffect(() => {
    if (matches && matches.length > 0) {
      const match = matches[0];
      Alert.alert(
        'Uusi match!',
        `Sinulla on uusi match yrityksen ${match.user.username} kanssa! Voit aloittaa keskustelun napauttamalla ilmoitusta.`,
        [
          {
            text: 'OK',
            onPress: () => {
              deleteMatch(match.match_id);
              navigation.navigate('Keskustelut');
            },
          },
        ],
      );
    }
  }, [matches]);

  const handleRight = async (job: JobWithSkillsAndKeywords) => {
    setLoading(true);
    setSwipingEnabled(false);
    try {
      const data = {
        swiped_id: job.job_id,
        swipe_direction: 'right',
        swipe_type: 'job',
      };
      const result = await postSwipe(data);
      console.log(result);
      if (result) {
        console.log('swipe saved');
        setUpdate((prevState) => !prevState);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false);
      setSwipingEnabled(true);
    }
  };

  const handleLeft = async (job: JobWithSkillsAndKeywords) => {
    setLoading(true);
    setSwipingEnabled(false);
    try {
      const data = {
        swiped_id: job.job_id,
        swipe_direction: 'left',
        swipe_type: 'job',
      };
      const result = await postSwipe(data);
      if (result) {
        setUpdate((prevState) => !prevState);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false);
      setSwipingEnabled(true);
    }
  };

  const handleYup = (job: JobWithSkillsAndKeywords) => {
    if (jobs.length === 1) {
      setSwipingEnabled(false);
    }
    handleRight(job);
  };

  const handleNope = (job: JobWithSkillsAndKeywords) => {
    if (jobs.length === 1) {
      setSwipingEnabled(false);
    }
    handleLeft(job);
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
  });

  return (
    <View style={{flex: 1, backgroundColor: '#5d71c9', alignItems: 'center'}}>
      <RNPickerSelect
        placeholder={placeholder}
        items={items}
        value={selectedField}
        useNativeAndroidPickerStyle={true}
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
        onPress={resetFilters}
        buttonStyle={styles.button}
      />
      <SwipeCards
        key={jobs.length}
        cards={filteredJobs}
        renderCard={(jobData: JobWithSkillsAndKeywords) => (
          <JobAd job={jobData} key={jobData.job_id} />
        )}
        renderNoMoreCards={() => (
          <View>
            <Text style={{color: '#ffffff', fontSize: 20}}>
              Ei enempää työpaikkoja
            </Text>
            <TouchableOpacity
              onPress={() => setUpdate((prevState) => !prevState)}
            >
              <FontAwesomeIcon icon={faRotateRight} color="#ffffff" size={40} />
            </TouchableOpacity>
          </View>
        )}
        handleYup={swipingEnabled ? handleYup : undefined}
        handleNope={swipingEnabled ? handleNope : undefined}
        showYup={false}
        showNope={false}
        useNativeDriver={true}
      />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
    </View>
  );
};

export default Feed;

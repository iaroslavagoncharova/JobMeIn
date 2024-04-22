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
import {useJobs, useMatch, useSwipe, useUser} from '../hooks/apiHooks';
import {CandidateProfile, JobWithSkillsAndKeywords} from '../types/DBTypes';
import JobAd from '../components/JobAd';
import useUpdateContext from '../hooks/updateHooks';
import Candidate from '../components/Candidate';

const EmployerFeed = () => {
  const {getAllCandidates} = useUser();
  const [candidates, setCandidates] = useState<CandidateProfile[]>([]);
  console.log(candidates, 'candidates');
  const {jobs, fields} = useJobs();
  const navigation: NavigationProp<ParamListBase> = useNavigation();
  const {update, setUpdate} = useUpdateContext();
  const [selectedField, setSelectedField] = useState<string>('');
  const {postSwipe} = useSwipe();
  const {matches, deleteMatch} = useMatch();
  const [loading, setLoading] = useState(false);
  const [swipingEnabled, setSwipingEnabled] = useState(true);

  const getCandidates = async () => {
    const response = await getAllCandidates();
    if (response) {
      setCandidates(response);
    }
  };

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

  const filteredCandidates =
    selectedField === null || selectedField === ''
      ? candidates
      : candidates.filter((candidate) => candidate.field === selectedField);
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

  useEffect(() => {
    getCandidates();
  }, [update]);

  // display the match alerts and after a user clicks ok, delete the match and navigate to the chat
  useEffect(() => {
    if (matches && matches.length > 0) {
      const match = matches[0];
      Alert.alert(
        'Uusi match!',
        `Uusi match työnhakijan ${match.user.username} kanssa! Voit aloittaa keskustelun napauttamalla ilmoitusta.`,
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

  const handleRight = async (candidate: CandidateProfile) => {
    setLoading(true);
    setSwipingEnabled(false);
    try {
      const data = {
        swiped_id: candidate.user_id,
        swipe_direction: 'right',
        swipe_type: 'candidate',
      };
      const result = await postSwipe(data);
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

  const handleLeft = async (candidate: CandidateProfile) => {
    setLoading(true);
    setSwipingEnabled(false);
    try {
      const data = {
        swiped_id: candidate.user_id,
        swipe_direction: 'left',
        swipe_type: 'candidate',
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

  const handleYup = (candidate: CandidateProfile) => {
    if (candidates.length === 1) {
      setSwipingEnabled(false);
    }
    handleRight(candidate);
  };

  const handleNope = (candidate: CandidateProfile) => {
    if (candidates.length === 1) {
      setSwipingEnabled(false);
    }
    handleLeft(candidate);
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
        cards={filteredCandidates}
        renderCard={(candidateData: CandidateProfile) => (
          <Candidate candidate={candidateData} key={candidateData.user_id} />
        )}
        renderNoMoreCards={() => (
          <View>
            <Text style={{color: '#ffffff', fontSize: 20}}>
              Ei enempää työnhakijoita
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
      />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
    </View>
  );
};

export default EmployerFeed;

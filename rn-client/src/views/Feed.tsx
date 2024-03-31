import {View, ActivityIndicator, TouchableOpacity} from 'react-native';
// @ts-ignore
import SwipeCards from 'react-native-swipe-cards';
import {useEffect, useState} from 'react';
import {faRotateRight} from '@fortawesome/free-solid-svg-icons';
import {Text} from 'react-native-elements';
import {FontAwesomeIcon} from '@fortawesome/react-native-fontawesome';
import {useUserContext} from '../hooks/ContextHooks';
import {useJobs, useSwipe} from '../hooks/apiHooks';
import {JobWithSkillsAndKeywords} from '../types/DBTypes';
import JobAd from '../components/JobAd';
import useUpdateContext from '../hooks/updateHooks';

const Feed = () => {
  const {handleAutoLogin} = useUserContext();
  const {jobs} = useJobs();
  const {update, setUpdate} = useUpdateContext();
  const {postSwipe} = useSwipe();
  const [loading, setLoading] = useState(false);
  const [swipingEnabled, setSwipingEnabled] = useState(true);

  useEffect(() => {
    handleAutoLogin();
  }, []);

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
      console.log(result);
      if (result) {
        console.log('swipe saved');
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

  return (
    <View style={{flex: 1, backgroundColor: '#5d71c9'}}>
      <SwipeCards
        key={jobs.length}
        cards={jobs}
        renderCard={(jobData: JobWithSkillsAndKeywords) => (
          <JobAd job={jobData} />
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
      />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
    </View>
  );
};

export default Feed;

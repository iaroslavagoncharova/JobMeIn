import {ActivityIndicator, View} from 'react-native';
// @ts-ignore
import SwipeCards from 'react-native-swipe-cards';
import {useEffect, useState} from 'react';
import {Text} from 'react-native-elements';
import {useUserContext} from '../hooks/ContextHooks';
import {useJobs, useSwipe} from '../hooks/apiHooks';
import {JobWithSkillsAndKeywords, Swipe} from '../types/DBTypes';
import JobAd from '../components/JobAd';
import useUpdateContext from '../hooks/updateHooks';

const Feed = () => {
  const {handleAutoLogin} = useUserContext();
  const {jobs} = useJobs();
  const {postSwipe} = useSwipe();
  const {update, setUpdate} = useUpdateContext();
  const [loading, setLoading] = useState(false);
  const [swipingEnabled, setSwipingEnabled] = useState(true);
  console.log(jobs, 'jobs');
  if (!jobs) {
    return <ActivityIndicator size="large" color="#ffffff" />;
  }
  const handleYup = async (job: JobWithSkillsAndKeywords) => {
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
      // Handle error
    } finally {
      setLoading(false);
      setSwipingEnabled(true);
    }
  };
  const handleNope = async (job: JobWithSkillsAndKeywords) => {
    setLoading(true);
    setSwipingEnabled(false); // Disable swiping
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
        setUpdate((prevState) => !prevState);
      }
    } catch (error) {
      console.error('Error occurred:', error);
    } finally {
      setLoading(false);
      setSwipingEnabled(true);
    }
  };
  useEffect(() => {
    handleAutoLogin();
  }, []);
  return (
    <View style={{flex: 1, backgroundColor: '#5d71c9'}}>
      <SwipeCards
        cards={jobs}
        stackSize={3}
        renderCard={(jobData: JobWithSkillsAndKeywords) => (
          <JobAd job={jobData} />
        )}
        showYup={false}
        showNope={false}
        useNativeDriver={true}
        loop={false}
        renderNoMoreCards={() => (
          <View>
            <Text h4 style={{color: '#ffffff'}}>
              No more jobs
            </Text>
          </View>
        )}
        handleYup={swipingEnabled ? handleYup : undefined}
        handleNope={swipingEnabled ? handleNope : undefined}
      />
      {loading && <ActivityIndicator size="large" color="#ffffff" />}
    </View>
  );
};

export default Feed;

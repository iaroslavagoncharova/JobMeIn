import {ScrollView, Text, View} from 'react-native';
import {useEffect} from 'react';
import {useUserContext} from '../hooks/ContextHooks';
import {useJobs} from '../hooks/apiHooks';
import Job from '../components/Job';

const Feed = () => {
  const {handleAutoLogin} = useUserContext();
  const {jobs} = useJobs();
  console.log(jobs, 'jobs');
  useEffect(() => {
    handleAutoLogin();
  }, []);
  return (
    <ScrollView
      style={{backgroundColor: '#5d71c9'}}
      horizontal={true}
      pagingEnabled={true}
      showsHorizontalScrollIndicator={false}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        gap: 50,
      }}
    >
      {jobs.map((job) => (
        <Job key={job.job_id} job={job} />
      ))}
    </ScrollView>
  );
};

export default Feed;

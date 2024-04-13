import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import CompanyJobs from './CompanyJobs';
import Received from './Received';

const Tab = createMaterialTopTabNavigator();

const JobsApplications = () => {
  return (
    <Tab.Navigator
      initialRouteName="Saved"
      screenOptions={{
        tabBarActiveTintColor: '#004aad',
        tabBarInactiveTintColor: 'grey',
        tabBarIndicatorStyle: {backgroundColor: '#004aad'},
        tabBarLabelStyle: {fontWeight: 'bold'},
        tabBarStyle: {backgroundColor: 'white'},
      }}
    >
      <Tab.Screen name="Minun työpaikat" component={CompanyJobs} />
      <Tab.Screen name="Saapuneet hakemukset" component={Received} />
    </Tab.Navigator>
  );
};

export default JobsApplications;

import {View, Text} from 'react-native';
import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ReportedUsers from './ReportUsers';
import ReportedJobs from './ReportJobs';

const Tab = createMaterialTopTabNavigator();

const Reports = () => {
  return (
    <Tab.Navigator
      initialRouteName="Unresolved"
      screenOptions={{
        tabBarActiveTintColor: '#004aad',
        tabBarInactiveTintColor: 'grey',
        tabBarIndicatorStyle: {backgroundColor: '#004aad'},
        tabBarLabelStyle: {fontWeight: 'bold'},
        tabBarStyle: {backgroundColor: 'white'},
      }}
    >
      <Tab.Screen name="Käyttäjät" component={ReportedUsers} />
      <Tab.Screen name="Työilmoitukset" component={ReportedJobs} />
    </Tab.Navigator>
  );
};

export default Reports;

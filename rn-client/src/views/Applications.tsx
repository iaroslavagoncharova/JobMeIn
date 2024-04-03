import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import Applied from '../components/Applied';
import Saved from '../components/Saved';

const Tab = createMaterialTopTabNavigator();

const Applications = () => {
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
      <Tab.Screen name="Saved" component={Saved} />
      <Tab.Screen name="Applied" component={Applied} />
    </Tab.Navigator>
  );
};

export default Applications;

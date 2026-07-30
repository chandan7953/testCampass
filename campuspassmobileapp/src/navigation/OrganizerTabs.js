import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, ClipboardList, PlusCircle, Users, User } from 'lucide-react-native';

// Organizer Screens
import OrgDashboard from '../screens/organizer/OrgDashboard';
import ManageEvents from '../screens/organizer/ManageEvents';
import CreateEvent from '../screens/organizer/CreateEvent';
import Attendees from '../screens/organizer/Attendees';
import Profile from '../screens/shared/Profile';

const Tab = createBottomTabNavigator();

const OrganizerTabs = () => {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        headerStyle: { backgroundColor: '#0a0a0f', shadowColor: 'transparent', elevation: 0 },
        headerTintColor: '#fff',
        tabBarActiveTintColor: '#3b82f6',
        tabBarInactiveTintColor: '#9ca3af',
        tabBarStyle: { backgroundColor: '#181824', borderTopWidth: 1, borderColor: 'rgba(255, 255, 255, 0.05)' },
      }}
    >
      <Tab.Screen 
        name="OrgDashboard" 
        component={OrgDashboard} 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="ManageEvents" 
        component={ManageEvents} 
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="CreateEvent" 
        component={CreateEvent} 
        options={{
          title: 'Create',
          tabBarIcon: ({ color, size }) => <PlusCircle color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Attendees" 
        component={Attendees} 
        options={{
          title: 'Attendees',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Profile" 
        component={Profile} 
        options={{
          title: 'Profile',
          tabBarIcon: ({ color, size }) => <User color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
};

export default OrganizerTabs;

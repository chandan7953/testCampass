import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Home as HomeIcon, Search, Calendar, Heart, User } from 'lucide-react-native';

// Student Screens
import Home from '../screens/student/Home';
import BrowseEvents from '../screens/student/BrowseEvents';
import MyBookings from '../screens/student/MyBookings';
import Favorites from '../screens/student/Favorites';
import Profile from '../screens/shared/Profile';

const Tab = createBottomTabNavigator();

const StudentTabs = () => {
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
        name="StudentHome" 
        component={Home} 
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <HomeIcon color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Browse" 
        component={BrowseEvents} 
        options={{
          title: 'Browse',
          tabBarIcon: ({ color, size }) => <Search color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Bookings" 
        component={MyBookings} 
        options={{
          title: 'Bookings',
          tabBarIcon: ({ color, size }) => <Calendar color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="Favorites" 
        component={Favorites} 
        options={{
          title: 'Favorites',
          tabBarIcon: ({ color, size }) => <Heart color={color} size={size} />
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

export default StudentTabs;

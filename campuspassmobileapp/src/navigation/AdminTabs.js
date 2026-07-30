import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { LayoutDashboard, ClipboardList, Building2, Tag, Users, User } from 'lucide-react-native';

// Admin Screens
import AdminDashboard from '../screens/admin/AdminDashboard';
import ManageAllEvents from '../screens/admin/ManageAllEvents';
import ManageVenues from '../screens/admin/ManageVenues';
import ManageCategories from '../screens/admin/ManageCategories';
import ManageUsers from '../screens/admin/ManageUsers';

const Tab = createBottomTabNavigator();

const AdminTabs = () => {
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
        name="AdminDashboard" 
        component={AdminDashboard} 
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color, size }) => <LayoutDashboard color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="ManageAllEvents" 
        component={ManageAllEvents} 
        options={{
          title: 'Events',
          tabBarIcon: ({ color, size }) => <ClipboardList color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="ManageVenues" 
        component={ManageVenues} 
        options={{
          title: 'Venues',
          tabBarIcon: ({ color, size }) => <Building2 color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="ManageCategories" 
        component={ManageCategories} 
        options={{
          title: 'Categories',
          tabBarIcon: ({ color, size }) => <Tag color={color} size={size} />
        }} 
      />
      <Tab.Screen 
        name="ManageUsers" 
        component={ManageUsers} 
        options={{
          title: 'Users',
          tabBarIcon: ({ color, size }) => <Users color={color} size={size} />
        }} 
      />
    </Tab.Navigator>
  );
};

export default AdminTabs;

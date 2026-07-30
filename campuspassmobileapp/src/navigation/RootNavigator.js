import React from 'react';
import { useSelector } from 'react-redux';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Navigators
import StudentTabs from './StudentTabs';
import OrganizerTabs from './OrganizerTabs';
import AdminTabs from './AdminTabs';

// Auth Screens
import Login from '../screens/auth/Login';
import Register from '../screens/auth/Register';
import ForgotPassword from '../screens/auth/ForgotPassword';
import ResetPassword from '../screens/auth/ResetPassword';
import Welcome from '../screens/auth/Welcome';

// Other Screens
import QRScanPage from '../screens/organizer/QRScanPage';
import EventDetail from '../screens/shared/EventDetail';
import BookTickets from '../screens/student/BookTickets';
import Payment from '../screens/student/Payment';
import ETicket from '../screens/shared/ETicket';
import EventMap from '../screens/shared/EventMap';

const Stack = createNativeStackNavigator();

const AuthStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Welcome" component={Welcome} />
    <Stack.Screen name="Login" component={Login} />
    <Stack.Screen name="Register" component={Register} />
    <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
    <Stack.Screen name="ResetPassword" component={ResetPassword} />
  </Stack.Navigator>
);

const OrganizerStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="OrganizerTabs" component={OrganizerTabs} />
    <Stack.Screen name="QRScanPage" component={QRScanPage} options={{ headerShown: true, title: 'Scanner' }} />
    <Stack.Screen name="EventDetails" component={EventDetail} options={{ headerShown: true, title: 'Event Details' }} />
  </Stack.Navigator>
);

const StudentStack = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="StudentTabs" component={StudentTabs} />
    <Stack.Screen name="EventDetails" component={EventDetail} />
    <Stack.Screen name="BookTickets" component={BookTickets} />
    <Stack.Screen name="Payment" component={Payment} />
    <Stack.Screen name="ETicket" component={ETicket} />
    <Stack.Screen name="EventMap" component={EventMap} />
  </Stack.Navigator>
);

const RootNavigator = () => {
  const { user, token } = useSelector((state) => state.auth);

  // If not logged in, show Auth flow
  if (!user || !token) {
    return <AuthStack />;
  }

  // If logged in, show appropriate Tab navigator based on role
  if (user.role === 'admin') {
    return <AdminTabs />;
  }
  
  if (user.role === 'organizer') {
    return <OrganizerStack />;
  }

  // Default to student
  return <StudentStack />;
};

export default RootNavigator;

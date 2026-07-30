import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { ClipboardList, PlusCircle, Users, IndianRupee, Ticket, ArrowRight, ScanLine } from 'lucide-react-native';

import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';
import { formatCurrency } from '../../utils/formatters';

const OrgDashboard = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [events, setEvents] = useState([]);
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const [statsRes, eventsRes] = await Promise.all([
        api.get("/organizer/dashboard"),
        api.get("/events/organizer/my-events")
      ]);
      setStats(statsRes.data.data);
      setEvents(eventsRes.data.data || []);
    } catch (error) {
      console.error("Error fetching organizer dashboard:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchDashboardData();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    fetchDashboardData();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
      >
        <PageHeader
          breadcrumb="ORGANIZER CONTROL CENTER"
          title="Organizer Dashboard"
          subtitle="Manage your campus event registrations, monitor seat bookings, and issue passes."
          action={
            <TouchableOpacity
              style={styles.headerActionBtn}
              onPress={() => navigation.navigate("CreateEvent")}
            >
              <PlusCircle size={18} color="#fff" />
              <Text style={styles.headerActionText}>Create New Event</Text>
            </TouchableOpacity>
          }
        />

      <View style={styles.statsGrid}>
        <StatCard
          title="My Organized Events"
          value={stats.totalEvents}
          icon={ClipboardList}
          color="from-blue-500 to-cyan-500"
          loading={loading}
        />
        <StatCard
          title="Total Tickets Reserved"
          value={stats.totalBookings}
          icon={Ticket}
          color="from-purple-500 to-indigo-500"
          loading={loading}
        />
        <StatCard
          title="Estimated Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={IndianRupee}
          color="from-emerald-500 to-teal-500"
          loading={loading}
        />
      </View >

      <View style={styles.quickActionsGrid}>
        <TouchableOpacity 
          style={styles.quickActionCard} 
          onPress={() => navigation.navigate("CreateEvent")}
        >
          <View style={styles.quickActionContent}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(59, 130, 246, 0.1)' }]}>
              <PlusCircle size={22} color="#60a5fa" />
            </View>
            <View style={styles.quickActionTextContainer}>
              <Text style={styles.quickActionTitle}>Host New Event</Text>
              <Text style={styles.quickActionSubtitle}>Add dates, tickets & venue</Text>
            </View>
          </View>
          <ArrowRight size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard} 
          onPress={() => navigation.navigate("Attendees")}
        >
          <View style={styles.quickActionContent}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(168, 85, 247, 0.1)' }]}>
              <Users size={22} color="#c084fc" />
            </View>
            <View style={styles.quickActionTextContainer}>
              <Text style={styles.quickActionTitle}>Attendee List</Text>
              <Text style={styles.quickActionSubtitle}>Check registrations & status</Text>
            </View>
          </View>
          <ArrowRight size={18} color="#9ca3af" />
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.quickActionCard} 
          onPress={() => navigation.push("QRScanPage")}
        >
          <View style={styles.quickActionContent}>
            <View style={[styles.iconWrapper, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <ScanLine size={22} color="#34d399" />
            </View>
            <View style={styles.quickActionTextContainer}>
              <Text style={styles.quickActionTitle}>QR Ticket Scanner</Text>
              <Text style={styles.quickActionSubtitle}>Validate E-Tickets live</Text>
            </View>
          </View>
          <ArrowRight size={18} color="#9ca3af" />
        </TouchableOpacity>
      </View>

      <View style={styles.recentEventsSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Events</Text>
          <TouchableOpacity 
            style={styles.manageAllBtn}
            onPress={() => navigation.navigate("ManageEvents")}
          >
            <Text style={styles.manageAllText}>Manage All ({events.length})</Text>
            <ArrowRight size={14} color="#60a5fa" />
          </TouchableOpacity>
        </View>

        {loading && !refreshing ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : events.length === 0 ? (
          <EmptyState
            title="No Events Created Yet"
            description="Start hosting campus fests, workshops, or tournaments by creating your first event!"
            action={
              <TouchableOpacity
                onPress={() => navigation.navigate("CreateEvent")}
                style={styles.emptyActionBtn}
              >
                <Text style={styles.emptyActionText}>Create Event</Text>
              </TouchableOpacity>
            }
          />
        ) : (
          <View style={styles.eventsList}>
            {events.slice(0, 3).map((evt) => (
              <EventCard
                key={evt._id || evt.id}
                event={evt}
                showActions
                onView={() => navigation.push('EventDetails', { id: evt._id || evt.id })}
                onEdit={() => navigation.navigate('CreateEvent', { eventToEdit: evt })} // Simplified routing
              />
            ))}
          </View>
        )}
      </View>
      </ScrollView >
    </SafeAreaView >
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 24,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#2563eb',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 16,
  },
  headerActionText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  statsGrid: {
    gap: 16,
  },
  quickActionsGrid: {
    gap: 12,
  },
  quickActionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  quickActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quickActionTextContainer: {
    gap: 2,
  },
  quickActionTitle: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  quickActionSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
  },
  recentEventsSection: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  manageAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  manageAllText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyActionBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 12,
    marginTop: 16,
  },
  emptyActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventsList: {
    gap: 16,
  },
});

export default OrgDashboard;

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, RefreshControl, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Users, Building2, CalendarDays, IndianRupee, Ticket, ArrowRight, ShieldCheck, Tag } from 'lucide-react-native';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatCard from '../../components/StatCard';
import { formatCurrency } from '../../utils/formatters';

const quickActions = [
  {
    id: 1,
    icon: CalendarDays,
    label: "Manage All Events",
    desc: "Approve, publish, reject or delete events",
    path: "ManageAllEvents",
    color: "#4f46e5", // indigo-600
  },
  {
    id: 2,
    icon: Users,
    label: "Manage Users",
    desc: "Inspect, block or unblock system users",
    path: "ManageUsers",
    color: "#d946ef", // fuchsia-500
  },
  {
    id: 3,
    icon: Building2,
    label: "Campus Venues",
    desc: "Add or edit university venue locations",
    path: "ManageVenues",
    color: "#14b8a6", // teal-500
  },
  {
    id: 4,
    icon: Tag,
    label: "Event Categories",
    desc: "Configure event category tags",
    path: "ManageCategories",
    color: "#f59e0b", // amber-500
  },
];

const AdminDashboard = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState({
    totalUsers: 0,
    totalOrganizers: 0,
    totalEvents: 0,
    totalBookings: 0,
    totalRevenue: 0,
  });

  const fetchDashboard = async () => {
    try {
      setLoading(true);
      const res = await api.get("/admin/dashboard");
      const data = res.data.data;

      setStats({
        ...data,
        totalUsers: data.totalUsers > 0 ? data.totalUsers - 1 : 0,
      });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.contentContainer}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={fetchDashboard} tintColor="#60a5fa" />}
      >
        <PageHeader
          breadcrumb="SYSTEM ADMINISTRATION"
          title="Admin Control Overview"
          subtitle="Executive dashboard for university event management, organizer oversight, and revenue statistics."
        />

      <View style={styles.statsGrid}>
        <StatCard
          title="Total Users"
          value={stats.totalUsers}
          icon={Users}
          color="#06b6d4" // cyan-500
          loading={loading}
        />
        <StatCard
          title="Organizers"
          value={stats.totalOrganizers}
          icon={Building2}
          color="#f97316" // orange-500
          loading={loading}
        />
        <StatCard
          title="All Events"
          value={stats.totalEvents}
          icon={CalendarDays}
          color="#ec4899" // pink-500
          loading={loading}
        />
        <StatCard
          title="Total Bookings"
          value={stats.totalBookings}
          icon={Ticket}
          color="#8b5cf6" // violet-500
          loading={loading}
        />
        <StatCard
          title="Total Revenue"
          value={formatCurrency(stats.totalRevenue)}
          icon={IndianRupee}
          color="#10b981" // emerald-500
          loading={loading}
        />
      </View>

      <View style={styles.actionsSection}>
        <Text style={styles.sectionTitle}>Administrative Actions</Text>

        <View style={styles.actionsGrid}>
          {quickActions.map((item) => {
            const Icon = item.icon;
            return (
              <TouchableOpacity
                key={item.id}
                style={styles.actionCard}
                onPress={() => navigation.navigate(item.path)}
                activeOpacity={0.7}
              >
                <View style={[styles.iconContainer, { backgroundColor: item.color }]}>
                  <Icon size={26} color="#fff" />
                </View>

                <Text style={styles.actionLabel}>{item.label}</Text>
                <Text style={styles.actionDesc}>{item.desc}</Text>

                <View style={styles.openControl}>
                  <Text style={styles.openControlText}>Open Control</Text>
                  <ArrowRight size={14} color="#60a5fa" />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0a0a0f',
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 40,
  },
  statsGrid: {
    gap: 16,
    marginBottom: 32,
  },
  actionsSection: {
    marginTop: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '900',
    color: '#ffffff',
    marginBottom: 16,
  },
  actionsGrid: {
    gap: 16,
  },
  actionCard: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
  },
  iconContainer: {
    height: 56,
    width: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actionLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionDesc: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    lineHeight: 18,
  },
  openControl: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 24,
    gap: 6,
  },
  openControlText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#60a5fa',
  },
});

export default AdminDashboard;

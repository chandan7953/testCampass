import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { Sparkles, ArrowRight, Ticket, Heart, Flame } from 'lucide-react-native';
import api from '../../api/axios';

import EventCard from '../../components/EventCard';
import StatCard from '../../components/StatCard';
import SearchFilterBar from '../../components/SearchFilterBar';
import EmptyState from '../../components/EmptyState';

const Home = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.auth);

  const [loading, setLoading] = useState(true);
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  const [userStats, setUserStats] = useState({
    myBookingsCount: 0,
    favoritesCount: 0,
  });

  const fetchInitialData = async () => {
    try {
      setLoading(true);
      const [eventsRes, categoriesRes, bookingsRes, favoritesRes] = await Promise.allSettled([
        api.get("/events?status=published"),
        api.get("/categories"),
        api.get("/bookings/my-bookings"),
        api.get("/users/favorites"),
      ]);

      if (eventsRes.status === "fulfilled") {
        setEvents(eventsRes.value.data.data || []);
      }
      if (categoriesRes.status === "fulfilled") {
        setCategories(categoriesRes.value.data.data || []);
      }
      if (bookingsRes.status === "fulfilled") {
        const bookingsList = bookingsRes.value.data.data || [];
        setUserStats((prev) => ({ ...prev, myBookingsCount: bookingsList.length }));
      }
      if (favoritesRes.status === "fulfilled") {
        const favsList = favoritesRes.value.data.data || [];
        setUserStats((prev) => ({ ...prev, favoritesCount: favsList.length }));
      }
    } catch (error) {
      console.error("Error fetching homepage data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      fetchInitialData();
    }, [])
  );

  const filteredEvents = events.filter((evt) => {
    const matchesSearch =
      evt.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      evt.venue?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = selectedCategory
      ? evt.category?._id === selectedCategory || evt.category?.name === selectedCategory
      : true;

    return matchesSearch && matchesCategory;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Banner / Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroGlow} />
          <View style={styles.heroContent}>
            <View style={styles.feedBadge}>
              <Sparkles size={12} color="#93c5fd" />
              <Text style={styles.feedBadgeText}>CAMPUS EVENT FEED</Text>
            </View>

            <Text style={styles.heroTitle}>
              Welcome, {user?.fullName?.split(" ")[0] || "Student"}! 🎓
            </Text>

            <Text style={styles.heroDesc}>
              Discover upcoming hackathons, cultural festivals, tech workshops, and sports matches around your campus. Grab your E-Ticket passes now!
            </Text>

            <View style={styles.heroActions}>
              <TouchableOpacity 
                style={styles.primaryBtn}
                onPress={() => navigation.navigate("BrowseEvents")}
              >
                <Text style={styles.primaryBtnText}>Explore All Events</Text>
                <ArrowRight size={16} color="#fff" />
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.secondaryBtn}
                onPress={() => navigation.navigate("MyBookings")}
              >
                <Ticket size={16} color="#fff" />
                <Text style={styles.secondaryBtnText}>View My Passes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Overview Stat Cards */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.statsScroll}>
          <StatCard
            title="Published Events"
            value={events.length}
            icon={Flame}
            color="from-blue-500 to-cyan-500"
          />
          <StatCard
            title="My Booked Passes"
            value={userStats.myBookingsCount}
            icon={Ticket}
            color="from-purple-500 to-indigo-500"
          />
          <StatCard
            title="Saved Favorites"
            value={userStats.favoritesCount}
            icon={Heart}
            color="from-rose-500 to-pink-500"
          />
        </ScrollView>

        {/* Search & Category Filter */}
        <SearchFilterBar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          placeholder="Search upcoming campus events..."
        />

        {/* Upcoming Events Grid */}
        <View style={styles.sectionContainer}>
          <View style={styles.sectionHeader}>
            <View>
              <Text style={styles.sectionTitle}>Featured Campus Events</Text>
              <Text style={styles.sectionSubtitle}>Handpicked upcoming events for you</Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate("BrowseEvents")} style={styles.seeAllBtn}>
              <Text style={styles.seeAllText}>See All ({events.length})</Text>
              <ArrowRight size={14} color="#60a5fa" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
          ) : filteredEvents.length === 0 ? (
            <EmptyState
              title="No events found"
              description="We couldn't find any campus events matching your criteria. Try adjusting your search filters!"
              action={
                <TouchableOpacity
                  style={styles.clearBtn}
                  onPress={() => {
                    setSearchTerm("");
                    setSelectedCategory("");
                  }}
                >
                  <Text style={styles.clearBtnText}>Clear Filters</Text>
                </TouchableOpacity>
              }
            />
          ) : (
            <View style={styles.eventsGrid}>
              {filteredEvents.map((evt) => (
                <TouchableOpacity 
                  key={evt._id || evt.id} 
                  onPress={() => navigation.navigate("EventDetails", { id: evt._id || evt.id })}
                >
                  <EventCard event={evt} />
                </TouchableOpacity>
              ))}
            </View>
          )}
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
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 24,
  },
  heroCard: {
    backgroundColor: '#12121a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    overflow: 'hidden',
    position: 'relative',
  },
  heroGlow: {
    position: 'absolute',
    top: -100,
    right: -100,
    width: 250,
    height: 250,
    borderRadius: 125,
    backgroundColor: 'rgba(59, 130, 246, 0.15)',
    transform: [{ scale: 1.5 }],
  },
  heroContent: {
    padding: 24,
    gap: 16,
  },
  feedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(96, 165, 250, 0.3)',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    gap: 6,
  },
  feedBadgeText: {
    color: '#93c5fd',
    fontSize: 10,
    fontWeight: 'bold',
  },
  heroTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '900',
  },
  heroDesc: {
    color: '#d1d5db',
    fontSize: 13,
    lineHeight: 20,
  },
  heroActions: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginTop: 8,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2563eb',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 16,
    gap: 8,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  statsScroll: {
    gap: 12,
    paddingBottom: 8,
  },
  sectionContainer: {
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  sectionSubtitle: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  seeAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  seeAllText: {
    color: '#60a5fa',
    fontSize: 12,
    fontWeight: 'bold',
  },
  eventsGrid: {
    gap: 16,
  },
  clearBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  clearBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

export default Home;

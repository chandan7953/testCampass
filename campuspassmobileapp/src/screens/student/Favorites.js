import React, { useState, useEffect } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Heart } from 'lucide-react-native';
import api from '../../api/axios';

import PageHeader from '../../components/PageHeader';
import EventCard from '../../components/EventCard';
import EmptyState from '../../components/EmptyState';

const Favorites = () => {
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    fetchFavorites();
  }, []);

  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const res = await api.get("/users/favorites");
      setFavorites(res.data.data || []);
    } catch (error) {
      Alert.alert("Error", "Failed to load saved favorites");
    } finally {
      setLoading(false);
    }
  };

  const removeFavorite = async (eventId) => {
    try {
      await api.delete(`/users/favorites/${eventId}`);
      setFavorites(
        favorites.filter((fav) => {
          const event = fav.event || fav;
          return (event._id || event.id) !== eventId;
        })
      );
    } catch (error) {
      Alert.alert("Error", "Failed to remove favorite");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <PageHeader
          breadcrumb="SAVED BOOKMARKS"
          title="My Favorite Events"
          subtitle="Keep track of upcoming campus events you want to attend."
        />

        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 40 }} />
        ) : favorites.length === 0 ? (
          <View style={{ marginTop: 24 }}>
            <EmptyState
              title="No Favorites Saved Yet"
              description="Tap the heart icon on any campus event card to save it to your personal wishlist."
              icon={Heart}
              action={
                <TouchableOpacity
                  style={styles.browseBtn}
                  onPress={() => navigation.navigate("BrowseEvents")}
                >
                  <Text style={styles.browseBtnText}>Browse Campus Events</Text>
                </TouchableOpacity>
              }
            />
          </View>
        ) : (
          <View style={styles.eventsGrid}>
            {favorites.map((fav) => {
              const event = fav.event || fav;
              if (!event || !event.title) return null;
              return (
                <EventCard
                  key={fav._id || event._id}
                  event={event}
                  onView={() => navigation.navigate("EventDetails", { id: event._id || event.id })}
                  onRemoveFavorite={() => removeFavorite(event._id || event.id)}
                />
              );
            })}
          </View>
        )}
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
  },
  eventsGrid: {
    gap: 16,
    marginTop: 16,
  },
  browseBtn: {
    backgroundColor: '#2563eb',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 16,
    marginTop: 16,
  },
  browseBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
  }
});

export default Favorites;

import React, { useState, useEffect, useCallback } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, ActivityIndicator, Alert, Modal, Platform } from 'react-native';
import { useNavigation, useRoute, useFocusEffect } from '@react-navigation/native';
import { Users, CheckCircle2, XCircle, Search, Download, Phone, Mail, ChevronDown, Check } from 'lucide-react-native';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import EmptyState from '../../components/EmptyState';

const EventPicker = ({ events, selectedEventId, onSelect }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const selectedEvent = events.find(e => (e._id || e.id) === selectedEventId);

  return (
    <View style={styles.pickerContainer}>
      <Text style={styles.pickerLabel}>Select Event:</Text>
      <TouchableOpacity 
        style={styles.pickerButton} 
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.pickerButtonText} numberOfLines={1}>
          {selectedEvent ? `${selectedEvent.title} (${selectedEvent.bookedSeats || 0} attendees)` : 'Loading events...'}
        </Text>
        <ChevronDown size={18} color="#9ca3af" />
      </TouchableOpacity>

      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Event</Text>
            <ScrollView style={styles.modalList}>
              {events.map((evt) => {
                const id = evt._id || evt.id;
                return (
                  <TouchableOpacity
                    key={id}
                    style={styles.modalItem}
                    onPress={() => {
                      onSelect(id);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={[styles.modalItemText, selectedEventId === id && { color: '#60a5fa' }]}>
                      {evt.title} ({evt.bookedSeats || 0} attendees)
                    </Text>
                    {selectedEventId === id && <Check size={18} color="#60a5fa" />}
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
            <TouchableOpacity style={styles.modalCloseBtn} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCloseBtnText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const Attendees = () => {
  const route = useRoute();
  const eventId = route.params?.eventId;

  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(eventId || "");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchEvents();
  }, []);

  useEffect(() => {
    if (selectedEventId) {
      fetchAttendees(selectedEventId);
    } else if (events.length > 0) {
      setSelectedEventId(events[0]._id || events[0].id);
      fetchAttendees(events[0]._id || events[0].id);
    } else {
      setLoading(false);
    }
  }, [selectedEventId, events]);

  const fetchEvents = async () => {
    try {
      const res = await api.get("/events/organizer/my-events");
      const list = res.data.data || [];
      setEvents(list);
      if (!selectedEventId && list.length > 0) {
        setSelectedEventId(list[0]._id || list[0].id);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAttendees = async (eId) => {
    try {
      setLoading(true);
      const res = await api.get(`/organizer/attendees/${eId}`);
      setAttendees(res.data.data || []);
    } catch (error) {
      setAttendees([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInToggle = async (bookingId, currentCheckIn) => {
    try {
      await api.patch(`/bookings/${bookingId}/check-in`, { checkedIn: !currentCheckIn });
      Alert.alert("Success", currentCheckIn ? "Check-in undone" : "Attendee checked in!");
      fetchAttendees(selectedEventId);
    } catch (error) {
      Alert.alert("Error", "Failed to update check-in status");
    }
  };

  const handleExport = () => {
    Alert.alert("Notice", "Export to CSV is available on the web dashboard.");
  };

  const filteredAttendees = attendees.filter((item) => {
    const user = item.user || {};
    const nameMatch = user.fullName?.toLowerCase().includes(search.toLowerCase());
    const emailMatch = user.email?.toLowerCase().includes(search.toLowerCase());
    const codeMatch = (item.bookingCode || item._id || "").toLowerCase().includes(search.toLowerCase());
    return nameMatch || emailMatch || codeMatch;
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.contentContainer}>
      <PageHeader
        breadcrumb="ATTENDEE MANAGEMENT"
        title="Event Attendees"
        subtitle="Track registered students and verify check-ins."
        action={
          <TouchableOpacity
            style={styles.headerActionBtn}
            onPress={handleExport}
          >
            <Download size={16} color="#fff" />
            <Text style={styles.headerActionText}>Export CSV</Text>
          </TouchableOpacity>
        }
      />

      <View style={styles.controlsContainer}>
        {events.length > 0 && (
          <EventPicker 
            events={events} 
            selectedEventId={selectedEventId} 
            onSelect={setSelectedEventId} 
          />
        )}
        
        <View style={styles.searchWrapper}>
          <Search size={18} color="#9ca3af" style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search name or ticket code..."
            placeholderTextColor="#6b7280"
            value={search}
            onChangeText={setSearch}
          />
        </View>
      </View>

      <View style={styles.listContainer}>
        {loading ? (
          <ActivityIndicator size="large" color="#3b82f6" style={{ marginTop: 20 }} />
        ) : filteredAttendees.length === 0 ? (
          <EmptyState
            title="No Attendees Registered"
            description="There are no registered students matching your search criteria for this event."
            icon={Users}
          />
        ) : (
          filteredAttendees.map((item) => {
            const user = item.user || {};
            return (
              <View key={item._id} style={styles.attendeeCard}>
                <View style={styles.cardHeader}>
                  <Text style={styles.bookingCode}>{item.bookingCode || item._id?.substring(0, 8)}</Text>
                  <StatusBadge status={item.status || "confirmed"} />
                </View>

                <View style={styles.userInfo}>
                  <Text style={styles.userName}>{user.fullName || "Student Name"}</Text>
                  
                  <View style={styles.contactRow}>
                    <Mail size={14} color="#9ca3af" />
                    <Text style={styles.contactText}>{user.email || "student@college.edu"}</Text>
                  </View>
                  
                  <View style={styles.contactRow}>
                    <Phone size={14} color="#9ca3af" />
                    <Text style={styles.contactText}>{user.mobile || "N/A"}</Text>
                  </View>
                  
                  <View style={styles.seatsRow}>
                    <Text style={styles.seatsLabel}>Seats Reserved:</Text>
                    <Text style={styles.seatsValue}>{item.seatsCount || 1}</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={[
                    styles.checkInBtn,
                    item.checkedIn ? styles.checkedInBtn : styles.notCheckedInBtn
                  ]}
                  onPress={() => handleCheckInToggle(item._id, item.checkedIn)}
                >
                  {item.checkedIn ? (
                    <>
                      <CheckCircle2 size={16} color="#34d399" />
                      <Text style={styles.checkedInText}>Checked In</Text>
                    </>
                  ) : (
                    <>
                      <XCircle size={16} color="#d1d5db" />
                      <Text style={styles.notCheckedInText}>Mark as Check In</Text>
                    </>
                  )}
                </TouchableOpacity>
              </View>
            );
          })
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
  contentContainer: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  headerActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 12,
    marginTop: 12,
    alignSelf: 'flex-start',
  },
  headerActionText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  controlsContainer: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    gap: 16,
  },
  pickerContainer: {
    gap: 8,
  },
  pickerLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  pickerButton: {
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
    flex: 1,
  },
  searchWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  listContainer: {
    gap: 12,
  },
  attendeeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 16,
    padding: 16,
    gap: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bookingCode: {
    color: '#60a5fa',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    fontWeight: 'bold',
    fontSize: 14,
  },
  userInfo: {
    gap: 6,
  },
  userName: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  contactText: {
    color: '#9ca3af',
    fontSize: 12,
  },
  seatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  seatsLabel: {
    color: '#6b7280',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seatsValue: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  checkInBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  notCheckedInBtn: {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  checkedInBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  notCheckedInText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: 'bold',
  },
  checkedInText: {
    color: '#34d399',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#181824',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '60%',
    padding: 20,
  },
  modalTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalList: {
    marginBottom: 16,
  },
  modalItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.05)',
  },
  modalItemText: {
    color: '#d1d5db',
    fontSize: 16,
  },
  modalCloseBtn: {
    backgroundColor: '#374151',
    borderRadius: 16,
    paddingVertical: 14,
    alignItems: 'center',
  },
  modalCloseBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default Attendees;

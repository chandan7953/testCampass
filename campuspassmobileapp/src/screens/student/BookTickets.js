import React, { useEffect, useState } from 'react';
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { ArrowLeft, ArrowRight, Calendar, MapPin, Minus, Plus, ShieldCheck, Ticket } from 'lucide-react-native';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import { formatCurrency, formatDate } from '../../utils/formatters';

const BookTickets = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const { eventId } = route.params;

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [event, setEvent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [ticketId, setTicketId] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const loadBookingOptions = async () => {
      try {
        setLoading(true);
        const [eventResponse, ticketsResponse] = await Promise.all([
          api.get(`/events/${eventId}`),
          api.get(`/tickets/event/${eventId}`),
        ]);
        const availableTickets = (ticketsResponse.data.data || []).filter(
          (ticket) => ticket.status === "active" && ticket.remainingQuantity > 0
        );
        setEvent(eventResponse.data.data);
        setTickets(availableTickets);
        setTicketId(availableTickets[0]?._id || "");
      } catch (err) {
        Alert.alert("Error", "Failed to load booking options");
        navigation.goBack();
      } finally {
        setLoading(false);
      }
    };
    loadBookingOptions();
  }, [eventId]);

  const selectedTicket = tickets.find((ticket) => ticket._id === ticketId);
  const maxQuantity = Math.min(5, selectedTicket?.remainingQuantity || 1);
  const total = (selectedTicket?.price || 0) * quantity;

  const selectTicket = (nextTicketId) => {
    setTicketId(nextTicketId);
    setQuantity(1);
  };

  const createBooking = async () => {
    if (!selectedTicket) return;
    try {
      setSubmitting(true);
      const response = await api.post("/bookings", { ticketId, quantity });
      const booking = response.data.data;
      
      Alert.alert(
        "Success", 
        booking.paymentStatus === "paid" ? "Your free pass is confirmed!" : "Pass reserved. Continue to payment."
      );
      
      if (booking.paymentStatus === "paid") {
        navigation.replace("ETicket", { bookingId: booking._id });
      } else {
        navigation.replace("Payment", { bookingId: booking._id });
      }
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Unable to reserve tickets. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Loading ticket options...</Text>
      </View>
    );
  }

  if (!event) return null;

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <ArrowLeft size={16} color="#d1d5db" />
          <Text style={styles.backBtnText}>Back to event</Text>
        </TouchableOpacity>
        
        <PageHeader 
          breadcrumb="RESERVE YOUR PASS" 
          title="Book Event Tickets" 
          subtitle={`Choose a pass for ${event.title}`} 
        />

        {tickets.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyCardText}>No tickets are currently available for this event.</Text>
          </View>
        ) : (
          <View style={styles.contentGrid}>
            <View style={styles.mainSection}>
              <Text style={styles.sectionTitle}>Choose your pass</Text>
              
              <View style={styles.ticketsList}>
                {tickets.map((ticket) => (
                  <TouchableOpacity 
                    key={ticket._id} 
                    onPress={() => selectTicket(ticket._id)}
                    style={[
                      styles.ticketOption, 
                      ticketId === ticket._id ? styles.ticketOptionActive : null
                    ]}
                  >
                    <View style={styles.ticketOptionLeft}>
                      <Text style={styles.ticketOptionTitle}>{ticket.title}</Text>
                      <Text style={styles.ticketOptionDesc}>
                        {ticket.description || `${ticket.remainingQuantity} passes remaining`}
                      </Text>
                    </View>
                    <Text style={styles.ticketOptionPrice}>{formatCurrency(ticket.price)}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <View style={styles.quantitySection}>
                <View>
                  <Text style={styles.quantityLabel}>Quantity</Text>
                  <Text style={styles.quantitySubLabel}>Maximum 5 passes per booking</Text>
                </View>
                <View style={styles.quantityControls}>
                  <TouchableOpacity 
                    onPress={() => setQuantity((value) => Math.max(1, value - 1))}
                    disabled={quantity === 1}
                    style={[styles.qtyBtn, quantity === 1 && styles.qtyBtnDisabled]}
                  >
                    <Minus size={16} color={quantity === 1 ? "#6b7280" : "#fff"} />
                  </TouchableOpacity>
                  
                  <Text style={styles.qtyText}>{quantity}</Text>
                  
                  <TouchableOpacity 
                    onPress={() => setQuantity((value) => Math.min(maxQuantity, value + 1))}
                    disabled={quantity === maxQuantity}
                    style={[styles.qtyBtn, quantity === maxQuantity && styles.qtyBtnDisabled]}
                  >
                    <Plus size={16} color={quantity === maxQuantity ? "#6b7280" : "#fff"} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.infoAlert}>
                <ShieldCheck size={16} color="#93c5fd" />
                <Text style={styles.infoAlertText}>Your QR pass is generated after payment is confirmed.</Text>
              </View>
            </View>

            <View style={styles.summarySection}>
              <Text style={styles.summaryTitle}>Booking summary</Text>
              <Text style={styles.summaryEventTitle}>{event.title}</Text>
              
              <View style={styles.summaryRow}>
                <Calendar size={14} color="#60a5fa" />
                <Text style={styles.summaryRowText}>{formatDate(event.startDate)}</Text>
              </View>
              
              <View style={styles.summaryRow}>
                <MapPin size={14} color="#60a5fa" />
                <Text style={styles.summaryRowText}>{event.venue?.name || "Campus venue"}</Text>
              </View>

              <View style={styles.totalSection}>
                <Text style={styles.totalLabel}>Total</Text>
                <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
              </View>

              <TouchableOpacity 
                style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
                onPress={createBooking}
                disabled={submitting}
              >
                <Ticket size={18} color="#fff" />
                <Text style={styles.submitBtnText}>
                  {submitting ? "Reserving..." : total === 0 ? "Confirm free pass" : "Proceed to payment"}
                </Text>
                {!submitting && <ArrowRight size={16} color="#fff" />}
              </TouchableOpacity>
            </View>
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
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
    gap: 20,
  },
  loadingText: {
    marginTop: 12,
    color: '#9ca3af',
    fontSize: 14,
    fontWeight: 'bold',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: '#12121a',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
  },
  backBtnText: {
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: 'bold',
  },
  emptyCard: {
    backgroundColor: '#12121a',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 32,
    alignItems: 'center',
  },
  emptyCardText: {
    color: '#d1d5db',
    fontSize: 14,
    textAlign: 'center',
  },
  contentGrid: {
    gap: 20,
  },
  mainSection: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    gap: 20,
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  ticketsList: {
    gap: 12,
  },
  ticketOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  ticketOptionActive: {
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderColor: '#3b82f6',
  },
  ticketOptionLeft: {
    flex: 1,
  },
  ticketOptionTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  ticketOptionDesc: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  ticketOptionPrice: {
    color: '#60a5fa',
    fontWeight: 'bold',
    fontSize: 16,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 16,
    padding: 16,
  },
  quantityLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  quantitySubLabel: {
    color: '#9ca3af',
    fontSize: 12,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyBtn: {
    padding: 8,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  qtyBtnDisabled: {
    opacity: 0.3,
  },
  qtyText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
    width: 24,
    textAlign: 'center',
  },
  infoAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.2)',
    borderRadius: 16,
    padding: 16,
    gap: 8,
  },
  infoAlertText: {
    color: '#bfdbfe',
    fontSize: 12,
    flex: 1,
  },
  summarySection: {
    backgroundColor: 'rgba(18, 18, 26, 0.9)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    gap: 16,
  },
  summaryTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255,255,255,0.1)',
    paddingBottom: 12,
  },
  summaryEventTitle: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  summaryRowText: {
    color: '#d1d5db',
    fontSize: 12,
  },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: 16,
    marginTop: 8,
  },
  totalLabel: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  totalValue: {
    color: '#60a5fa',
    fontWeight: 'bold',
    fontSize: 18,
  },
  submitBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },
  submitBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 14,
  }
});

export default BookTickets;

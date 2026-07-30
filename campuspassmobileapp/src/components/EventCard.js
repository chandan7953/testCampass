import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Calendar, MapPin, Users, Eye, Pencil, Trash2, Send, Ban, Tag } from 'lucide-react-native';
import { useSelector } from 'react-redux';
import StatusBadge from './StatusBadge';
import { formatDate, formatCurrency } from '../utils/formatters';

const EventCard = ({
  event,
  showActions = false,
  onView,
  onEdit,
  onPublish,
  onCancel,
  onDelete,
  onRemoveFavorite,
}) => {
  const user = useSelector((state) => state.auth.user);
  const role = user?.role || 'user';

  if (!event) return null;

  return (
    <View style={styles.card}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: event.poster || "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=800&q=80" }}
          style={styles.image}
        />
        <View style={styles.overlay} />
        
        <View style={styles.categoryBadge}>
          <Tag size={12} color="#60a5fa" />
          <Text style={styles.categoryText}>{event.category?.name || "Event"}</Text>
        </View>

        {event.status && (
          <View style={styles.statusBadge}>
            <StatusBadge status={event.status} />
          </View>
        )}

        <View style={styles.priceBadge}>
          <Text style={styles.priceText}>{formatCurrency(event.price)}</Text>
        </View>
      </View>

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>{event.title}</Text>
        <Text style={styles.description} numberOfLines={2}>
          {event.description || "Join us for an exciting campus event filled with networking, learning, and fun!"}
        </Text>

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Calendar size={14} color="#60a5fa" />
            <Text style={styles.infoText}>{formatDate(event.startDate)}</Text>
          </View>

          <View style={styles.infoRow}>
            <MapPin size={14} color="#60a5fa" />
            <Text style={styles.infoText} numberOfLines={1}>{event.venue?.name || "Campus Venue TBD"}</Text>
          </View>

          <View style={styles.infoRow}>
            <Users size={14} color="#60a5fa" />
            <Text style={styles.infoText}>
              <Text style={styles.boldText}>
                {event.availableSeats !== undefined 
                  ? (event.capacity || 100) - event.availableSeats 
                  : (event.bookedSeats || 0)}
              </Text>
              {" / "}{event.capacity || 100} seats reserved
            </Text>
          </View>
        </View>

        {showActions ? (
          <View style={styles.actionsGrid}>
            <TouchableOpacity style={styles.actionBtn} onPress={onView}>
              <Eye size={14} color="#e5e7eb" />
              <Text style={styles.actionText}>View</Text>
            </TouchableOpacity>

            {role === "organizer" && (
              <TouchableOpacity style={styles.actionBtn} onPress={onEdit}>
                <Pencil size={14} color="#e5e7eb" />
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            )}

            {role === "admin" && event.status !== "published" && (
              <TouchableOpacity style={[styles.actionBtn, styles.publishBtn]} onPress={onPublish}>
                <Send size={14} color="#34d399" />
                <Text style={styles.publishText}>Publish</Text>
              </TouchableOpacity>
            )}

            {role === "organizer" && event.status === "published" && (
              <TouchableOpacity style={[styles.actionBtn, styles.cancelBtn]} onPress={onCancel}>
                <Ban size={14} color="#fbbf24" />
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
            )}

            {(role === "organizer" || role === "admin") && (
              <TouchableOpacity style={[styles.actionBtn, styles.deleteBtn, { flex: 2 }]} onPress={onDelete}>
                <Trash2 size={14} color="#fb7185" />
                <Text style={styles.deleteText}>Delete Event</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={styles.userActions}>
            <TouchableOpacity style={styles.primaryBtn} onPress={onView}>
              <Eye size={14} color="#fff" />
              <Text style={styles.primaryBtnText}>Explore Event Details</Text>
            </TouchableOpacity>
            
            {onRemoveFavorite && (
              <TouchableOpacity 
                style={styles.favBtn} 
                onPress={() => onRemoveFavorite()}
              >
                <Trash2 size={16} color="#fb7185" />
              </TouchableOpacity>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    overflow: 'hidden',
    marginVertical: 12,
  },
  imageContainer: {
    height: 200,
    width: '100%',
    position: 'relative',
    backgroundColor: '#000',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  categoryBadge: {
    position: 'absolute',
    left: 16,
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.6)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  categoryText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
  statusBadge: {
    position: 'absolute',
    right: 16,
    top: 16,
  },
  priceBadge: {
    position: 'absolute',
    right: 16,
    bottom: 12,
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(59, 130, 246, 0.3)',
  },
  priceText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '900',
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ffffff',
  },
  description: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
    lineHeight: 18,
  },
  infoSection: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 12,
    color: '#d1d5db',
    marginLeft: 8,
  },
  boldText: {
    fontWeight: 'bold',
    color: '#ffffff',
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    paddingVertical: 8,
    paddingHorizontal: 12,
    flex: 1,
  },
  actionText: {
    color: '#e5e7eb',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  publishBtn: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  publishText: {
    color: '#34d399',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  cancelBtn: {
    backgroundColor: 'rgba(245, 158, 11, 0.1)',
    borderColor: 'rgba(245, 158, 11, 0.2)',
  },
  cancelText: {
    color: '#fbbf24',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  deleteBtn: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.2)',
    width: '100%',
    marginTop: 4,
  },
  deleteText: {
    color: '#fb7185',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 6,
  },
  userActions: {
    flexDirection: 'row',
    marginTop: 16,
    gap: 8,
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(37, 99, 235, 0.9)',
    borderRadius: 16,
    paddingVertical: 12,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  favBtn: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
  },
});

export default EventCard;

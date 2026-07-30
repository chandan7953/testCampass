import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Animated, KeyboardAvoidingView, Platform } from 'react-native';
import { ScanLine, CheckCircle2, XCircle, Search, Ticket } from 'lucide-react-native';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';

const QRScanPage = () => {
  const [ticketId, setTicketId] = useState("");
  const [loading, setLoading] = useState(false);
  const [verificationResult, setVerificationResult] = useState(null);

  const handleVerify = async () => {
    if (!ticketId.trim()) {
      return;
    }

    try {
      setLoading(true);
      setVerificationResult(null);

      const res = await api.get(`/bookings/verify/${ticketId.trim()}`);
      setVerificationResult({
        success: true,
        data: res.data.data,
      });
    } catch (error) {
      setVerificationResult({
        success: false,
        message: error.response?.data?.message || "Invalid or unverified ticket code.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <PageHeader
          breadcrumb="VENUE ENTRY CHECK-IN"
          title="Live QR Scanner"
          subtitle="Verify student ticket QR passes at the entrance gate and record check-ins."
        />

        <View style={styles.scannerBox}>
          <View style={styles.mockCamera}>
            <View style={styles.scanBeam} />
            <ScanLine size={48} color="#60a5fa" />
            <Text style={styles.scannerActiveText}>Scanner Beam Active</Text>
            <Text style={styles.scannerHelperText}>Position QR pass in front of camera or enter pass code below</Text>
          </View>

          <View style={styles.manualInputContainer}>
            <View style={styles.inputWrapper}>
              <Ticket size={18} color="#9ca3af" style={styles.inputIcon} />
              <TextInput
                style={styles.input}
                value={ticketId}
                onChangeText={setTicketId}
                placeholder="Enter Ticket Pass Code..."
                placeholderTextColor="#6b7280"
                autoCapitalize="characters"
              />
            </View>

            <TouchableOpacity 
              style={[styles.verifyBtn, loading && styles.disabledBtn]} 
              onPress={handleVerify}
              disabled={loading || !ticketId.trim()}
            >
              <Search size={16} color="#fff" />
              <Text style={styles.verifyBtnText}>{loading ? "Verifying..." : "Verify"}</Text>
            </TouchableOpacity>
          </View>
        </View>

        {verificationResult && (
          <View style={[
            styles.resultCard, 
            verificationResult.success ? styles.successCard : styles.errorCard
          ]}>
            {verificationResult.success ? (
              <View style={styles.resultContent}>
                <View style={styles.resultHeader}>
                  <CheckCircle2 size={32} color="#34d399" />
                  <View style={styles.resultHeaderText}>
                    <Text style={styles.successTitle}>VALID PASS CONFIRMED</Text>
                    <Text style={styles.successSubtitle}>Grant Entry • Student Verified</Text>
                  </View>
                </View>

                {verificationResult.data && (
                  <View style={styles.resultDetailsGrid}>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Student Name</Text>
                      <Text style={styles.detailValue}>{verificationResult.data.user?.fullName || "Verified Student"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Pass Quantity</Text>
                      <Text style={styles.detailValue}>{verificationResult.data.seatsCount || 1} Ticket(s)</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Event Title</Text>
                      <Text style={styles.detailValue}>{verificationResult.data.event?.title || "Campus Event"}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Text style={styles.detailLabel}>Status</Text>
                      <View style={{ alignSelf: 'flex-start', marginTop: 4 }}>
                        <StatusBadge status={verificationResult.data.status || "confirmed"} />
                      </View>
                    </View>
                  </View>
                )}
              </View>
            ) : (
              <View style={styles.resultHeader}>
                <XCircle size={32} color="#fb7185" />
                <View style={styles.resultHeaderText}>
                  <Text style={styles.errorTitle}>ENTRY DENIED</Text>
                  <Text style={styles.errorSubtitle}>{verificationResult.message}</Text>
                </View>
              </View>
            )}
          </View>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
  scannerBox: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    padding: 24,
    alignItems: 'center',
  },
  mockCamera: {
    width: 240,
    height: 240,
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.5)',
    borderStyle: 'dashed',
    borderRadius: 24,
    backgroundColor: 'rgba(0,0,0,0.4)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 32,
    overflow: 'hidden',
  },
  scanBeam: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 4,
    backgroundColor: '#3b82f6',
    opacity: 0.8,
  },
  scannerActiveText: {
    color: '#d1d5db',
    fontSize: 14,
    fontWeight: 'bold',
    marginTop: 16,
  },
  scannerHelperText: {
    color: '#6b7280',
    fontSize: 10,
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
  },
  manualInputContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#12121a',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    height: 52,
  },
  inputIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#ffffff',
    fontSize: 14,
  },
  verifyBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingHorizontal: 20,
    gap: 8,
    height: 52,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  verifyBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  resultCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 24,
  },
  successCard: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
  },
  errorCard: {
    backgroundColor: 'rgba(244, 63, 94, 0.1)',
    borderColor: 'rgba(244, 63, 94, 0.3)',
  },
  resultContent: {
    gap: 20,
  },
  resultHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  resultHeaderText: {
    flex: 1,
  },
  successTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  successSubtitle: {
    color: '#6ee7b7',
    fontSize: 12,
  },
  errorTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '900',
  },
  errorSubtitle: {
    color: '#fda4af',
    fontSize: 12,
  },
  resultDetailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.05)',
  },
  detailItem: {
    width: '45%',
  },
  detailLabel: {
    color: '#9ca3af',
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  detailValue: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default QRScanPage;

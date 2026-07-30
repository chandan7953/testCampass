import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { User, KeyRound, Save } from 'lucide-react-native';
import api from '../../api/axios';
import PageHeader from '../../components/PageHeader';
import StatusBadge from '../../components/StatusBadge';
import { loginSuccess } from '../../redux/authSlice';
import { getInitials } from '../../utils/formatters';

const Profile = () => {
  const dispatch = useDispatch();
  const { user, token } = useSelector((state) => state.auth);

  const [savingProfile, setSavingProfile] = useState(false);
  const [savingPassword, setSavingPassword] = useState(false);
  
  const [profileForm, setProfileForm] = useState({
    fullName: user?.fullName || "",
    mobile: user?.mobile || "",
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
  });

  const handleProfileSubmit = async () => {
    try {
      setSavingProfile(true);
      const res = await api.put("/users/profile", profileForm);
      const updatedUser = res.data.data;

      dispatch(loginSuccess({ token, user: updatedUser }));
      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Failed to update profile");
    } finally {
      setSavingProfile(false);
    }
  };

  const handlePasswordSubmit = async () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword) {
      Alert.alert("Error", "Please fill in both current and new password");
      return;
    }
    try {
      setSavingPassword(true);
      await api.put("/users/change-password", passwordForm);
      Alert.alert("Success", "Password changed successfully!");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (error) {
      Alert.alert("Error", error.response?.data?.message || "Password change failed");
    } finally {
      setSavingPassword(false);
    }
  };

  const initials = getInitials(user?.fullName);

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={styles.contentContainer} keyboardShouldPersistTaps="handled">
        <PageHeader
          breadcrumb="ACCOUNT & SETTINGS"
          title="Profile Settings"
          subtitle="Manage your profile information, password, and system privileges."
        />

        <View style={styles.profileOverviewCard}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initials}</Text>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.nameRow}>
              <Text style={styles.userName}>{user?.fullName}</Text>
              <StatusBadge status={user?.role || "student"} />
            </View>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.statusText}>
              Account Status: <Text style={styles.statusActive}>Active & Verified</Text>
            </Text>
          </View>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <User size={18} color="#60a5fa" />
            <Text style={styles.formTitle}>Personal Information</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Full Name</Text>
            <TextInput
              style={styles.input}
              value={profileForm.fullName}
              onChangeText={(val) => setProfileForm({ ...profileForm, fullName: val })}
              placeholderTextColor="#6b7280"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email Address</Text>
            <TextInput
              style={[styles.input, styles.disabledInput]}
              value={user?.email || ""}
              editable={false}
            />
            <Text style={styles.helperText}>Email cannot be modified.</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Mobile Number</Text>
            <TextInput
              style={styles.input}
              value={profileForm.mobile}
              onChangeText={(val) => setProfileForm({ ...profileForm, mobile: val })}
              placeholderTextColor="#6b7280"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity 
            style={[styles.primaryBtn, savingProfile && styles.disabledBtn]} 
            onPress={handleProfileSubmit}
            disabled={savingProfile}
          >
            {savingProfile ? <ActivityIndicator color="#fff" size="small" /> : <Save size={16} color="#fff" />}
            <Text style={styles.primaryBtnText}>{savingProfile ? "Saving..." : "Save Changes"}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.formCard}>
          <View style={styles.formHeader}>
            <KeyRound size={18} color="#60a5fa" />
            <Text style={styles.formTitle}>Security & Password</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={passwordForm.currentPassword}
              onChangeText={(val) => setPasswordForm({ ...passwordForm, currentPassword: val })}
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={passwordForm.newPassword}
              onChangeText={(val) => setPasswordForm({ ...passwordForm, newPassword: val })}
              placeholder="••••••••"
              placeholderTextColor="#6b7280"
              secureTextEntry
            />
          </View>

          <TouchableOpacity 
            style={[styles.secondaryBtn, savingPassword && styles.disabledBtn]} 
            onPress={handlePasswordSubmit}
            disabled={savingPassword}
          >
            {savingPassword ? <ActivityIndicator color="#fff" size="small" /> : <KeyRound size={16} color="#fff" />}
            <Text style={styles.secondaryBtnText}>{savingPassword ? "Updating..." : "Update Password"}</Text>
          </TouchableOpacity>
        </View>
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
  profileOverviewCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(30, 58, 138, 0.2)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 24,
    gap: 16,
  },
  avatar: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '900',
  },
  profileInfo: {
    flex: 1,
    gap: 4,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  userName: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '900',
  },
  userEmail: {
    color: '#9ca3af',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  statusText: {
    color: '#9ca3af',
    fontSize: 12,
    marginTop: 4,
  },
  statusActive: {
    color: '#34d399',
    fontWeight: 'bold',
  },
  formCard: {
    backgroundColor: 'rgba(18, 18, 26, 0.8)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    padding: 20,
    gap: 16,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    paddingBottom: 12,
    marginBottom: 4,
  },
  formTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  inputGroup: {
    gap: 8,
  },
  label: {
    color: '#d1d5db',
    fontSize: 12,
    fontWeight: 'bold',
  },
  input: {
    backgroundColor: '#181824',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: '#ffffff',
    fontSize: 14,
  },
  disabledInput: {
    backgroundColor: 'rgba(0,0,0,0.4)',
    color: '#6b7280',
  },
  helperText: {
    color: '#6b7280',
    fontSize: 10,
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#2563eb',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  primaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    paddingVertical: 14,
    gap: 8,
    marginTop: 8,
  },
  secondaryBtnText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  disabledBtn: {
    opacity: 0.5,
  },
});

export default Profile;

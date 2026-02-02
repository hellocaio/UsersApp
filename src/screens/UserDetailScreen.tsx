import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../App';

type Props = NativeStackScreenProps<RootStackParamList, 'UserDetail'>;

export function UserDetailScreen({ route }: Props) {
  const { user } = route.params;
  const firstName = user?.name?.firstName || '';
  const lastName = user?.name?.lastName || '';
  const initials = `${firstName[0] || '?'}${lastName[0] || '?'}`;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.avatar}>
          <Text style={styles.initials}>{initials}</Text>
        </View>
        <Text style={styles.name}>
          {lastName}, {firstName}
        </Text>
        <Text style={styles.role}>{user?.role || 'N/A'}</Text>
      </View>

      <View style={styles.details}>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Email</Text>
          <Text style={styles.value}>{user.email}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Gender</Text>
          <Text style={styles.value}>{user.gender}</Text>
        </View>
        <View style={styles.detailRow}>
          <Text style={styles.label}>Role</Text>
          <Text style={styles.value}>{user.role}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    alignItems: 'center',
    padding: 24,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#4a90d9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  initials: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '600',
  },
  name: {
    fontSize: 24,
    fontWeight: '700',
    color: '#333',
  },
  role: {
    fontSize: 16,
    color: '#666',
    marginTop: 4,
  },
  details: {
    backgroundColor: '#fff',
    marginTop: 16,
    paddingHorizontal: 16,
  },
  detailRow: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  label: {
    fontSize: 12,
    color: '#999',
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  value: {
    fontSize: 16,
    color: '#333',
  },
});

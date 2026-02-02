import React, { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import {
  View,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  Text,
  RefreshControl,
  TouchableOpacity,
  NativeSyntheticEvent,
  NativeScrollEvent,
} from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { User } from '../types/User';
import { fetchUsers } from '../api/users';
import { UserCard } from '../components/UserCard';
import { RootStackParamList } from '../../App';

type Props = {
  navigation: NativeStackNavigationProp<RootStackParamList, 'UserList'>;
};

type ListItem = 
  | { type: 'header'; letter: string }
  | { type: 'user'; user: User };

const HEADER_HEIGHT = 36;
const ITEM_HEIGHT = 81;

export function UserListScreen({ navigation }: Props) {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentLetter, setCurrentLetter] = useState<string>('');
  const [showLetterIndicator, setShowLetterIndicator] = useState(false);
  const flatListRef = useRef<FlatList<ListItem>>(null);
  const scrollTimeout = useRef<NodeJS.Timeout | null>(null);

  const loadUsers = useCallback(async () => {
    try {
      setError(null);
      const data = await fetchUsers();
      setUsers(data.entries);
    } catch (err) {
      setError('Failed to load users. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  // Create flat list with headers and users
  const { listData, letterIndices, availableLetters } = useMemo(() => {
    const validUsers = users.filter(
      (user) => user?.name?.lastName && user?.name?.firstName
    );

    const sorted = [...validUsers].sort((a, b) =>
      a.name.lastName.localeCompare(b.name.lastName)
    );

    const items: ListItem[] = [];
    const indices: { [letter: string]: number } = {};
    const letters: string[] = [];
    let currentLetter = '';

    sorted.forEach((user) => {
      const letter = user.name.lastName[0]?.toUpperCase() || '#';
      if (letter !== currentLetter) {
        indices[letter] = items.length;
        letters.push(letter);
        items.push({ type: 'header', letter });
        currentLetter = letter;
      }
      items.push({ type: 'user', user });
    });

    return { listData: items, letterIndices: indices, availableLetters: letters };
  }, [users]);

  const handleRefresh = () => {
    setRefreshing(true);
    loadUsers();
  };

  const handleUserPress = (user: User) => {
    navigation.navigate('UserDetail', { user });
  };

  const scrollToSection = (letter: string) => {
    const index = letterIndices[letter];
    if (index !== undefined && flatListRef.current) {
      setCurrentLetter(letter);
      setShowLetterIndicator(true);

      flatListRef.current.scrollToIndex({
        index,
        animated: true,
      });

      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setShowLetterIndicator(false);
      }, 1000);
    }
  };

  const onScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      const y = event.nativeEvent.contentOffset.y;

      // Find current section based on scroll position
      let current = availableLetters[0] || '';
      let offset = 0;

      for (let i = 0; i < listData.length; i++) {
        const item = listData[i];
        const itemHeight = item.type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT;
        
        if (item.type === 'header' && y >= offset - 20) {
          current = item.letter;
        }
        offset += itemHeight;
      }

      if (current !== currentLetter) {
        setCurrentLetter(current);
      }

      setShowLetterIndicator(true);
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
      scrollTimeout.current = setTimeout(() => {
        setShowLetterIndicator(false);
      }, 800);
    },
    [currentLetter, listData, availableLetters]
  );

  const getItemLayout = useCallback(
    (_data: ArrayLike<ListItem> | null | undefined, index: number) => {
      let offset = 0;
      for (let i = 0; i < index; i++) {
        const item = listData[i];
        offset += item?.type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT;
      }
      const item = listData[index];
      const length = item?.type === 'header' ? HEADER_HEIGHT : ITEM_HEIGHT;
      return { length, offset, index };
    },
    [listData]
  );

  const renderItem = ({ item }: { item: ListItem }) => {
    if (item.type === 'header') {
      return (
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionHeaderText}>{item.letter}</Text>
        </View>
      );
    }
    return (
      <UserCard user={item.user} onPress={() => handleUserPress(item.user)} />
    );
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#4a90d9" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={listData}
        keyExtractor={(item, index) => 
          item.type === 'header' ? `header-${item.letter}` : `user-${item.user?.id ?? index}`
        }
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        onScroll={onScroll}
        scrollEventThrottle={16}
        getItemLayout={getItemLayout}
        stickyHeaderIndices={
          listData
            .map((item, index) => (item.type === 'header' ? index : null))
            .filter((i): i is number => i !== null)
        }
      />

      {/* Alphabet Index */}
      <View style={styles.alphabetContainer}>
        {availableLetters.map((letter) => (
          <TouchableOpacity
            key={letter}
            onPress={() => scrollToSection(letter)}
            style={styles.letterButton}
          >
            <Text
              style={[
                styles.letterText,
                currentLetter === letter && styles.letterTextActive,
              ]}
            >
              {letter}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Current Letter Indicator */}
      {showLetterIndicator && currentLetter && (
        <View style={styles.currentLetterIndicator}>
          <Text style={styles.currentLetterText}>{currentLetter}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#d32f2f',
    fontSize: 16,
    textAlign: 'center',
    padding: 20,
  },
  sectionHeader: {
    backgroundColor: '#e8e8e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    height: HEADER_HEIGHT,
    justifyContent: 'center',
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#4a90d9',
  },
  alphabetContainer: {
    position: 'absolute',
    right: 4,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 8,
  },
  letterButton: {
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  letterText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4a90d9',
  },
  letterTextActive: {
    color: '#2563eb',
    fontWeight: '800',
    transform: [{ scale: 1.2 }],
  },
  currentLetterIndicator: {
    position: 'absolute',
    right: 40,
    top: '45%',
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: 'rgba(74, 144, 217, 0.9)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  currentLetterText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
});

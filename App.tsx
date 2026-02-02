import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { UserListScreen } from './src/screens/UserListScreen';
import { UserDetailScreen } from './src/screens/UserDetailScreen';
import { User } from './src/types/User';

export type RootStackParamList = {
  UserList: undefined;
  UserDetail: { user: User };
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <StatusBar style="auto" />
      <Stack.Navigator
        initialRouteName="UserList"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#4a90d9',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            fontWeight: '600',
          },
        }}
      >
        <Stack.Screen
          name="UserList"
          component={UserListScreen}
          options={{ title: 'Users' }}
        />
        <Stack.Screen
          name="UserDetail"
          component={UserDetailScreen}
          options={({ route }) => ({
            title: `${route.params.user?.name?.lastName || ''}, ${route.params.user?.name?.firstName || ''}`,
          })}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

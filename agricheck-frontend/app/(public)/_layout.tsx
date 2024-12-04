
import { Stack } from 'expo-router';
import React = require('react');

const PublicLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: '#2f4f4f',
        },
        headerTintColor: '#fff',
        headerBackTitle: 'Back',
      }}>
      <Stack.Screen
        name="login"
        options={{
          headerTitle: 'AgriCheck',
        }}></Stack.Screen>
      <Stack.Screen
        name="register"
        options={{
          headerTitle: 'Create Account',
        }}></Stack.Screen>
      <Stack.Screen
        name="reset"
        options={{
          headerTitle: 'Reset Password',
        }}></Stack.Screen>
    </Stack>
  );
};

export default PublicLayout;

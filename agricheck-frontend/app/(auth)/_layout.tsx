import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, Image, View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import React = require('react');


export const LogoutButton = () => {
  const { signOut } = useAuth();

  const doLogout = () => {
    signOut();
  };

  return (
    <Pressable onPress={doLogout} style={{ marginRight: 10 }}>
      <Ionicons name="log-out-outline" size={24} color={'#2f4f4f'} />
    </Pressable>
  );
};

const TabsPage = () => {
  const { isSignedIn } = useAuth();

  return (
    <Tabs
      screenOptions={{
        headerStyle: {
          backgroundColor: '#f0ffff',
        },
        headerTintColor: '#fff',
      }}>
      <Tabs.Screen
        name="home"
        options={{
          headerTitle: () => (
            <View style={styles.headerContainer}>
              <Image
                source={require("../../images/agri-check-logo.webp")} // Update path if needed
                style={styles.logo}
              />
              <Text style={styles.title}>AgriCheck</Text>
            </View>
          ),
          tabBarIcon: ({ color, size }) => <Ionicons name="home-outline" size={size} color={'#2f4f4f'} />,
          tabBarLabel: 'Home',
          tabBarLabelStyle: {
            color: '#2f4f4f',
            fontSize: 14,
          },
          headerRight: () => <LogoutButton />,
        }}
        redirect={!isSignedIn}
      />
    </Tabs>
  );
};
const styles = StyleSheet.create({
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  logo: {
    width: 40, // Increase width
    height: 40, // Increase height
    marginRight: 10, // Spacing between logo and title
  },
  title: {
    fontSize: 22, // Increase font size
    fontWeight: "bold",
    color: "#000", // Adjust color based on theme (can use dynamic colors)
  },
});
export default TabsPage;

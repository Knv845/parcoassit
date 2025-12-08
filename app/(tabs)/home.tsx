import { View, Text, StyleSheet } from 'react-native';
import { Link } from 'expo-router'; // For navigation if needed

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Parking Assistance App</Text>
      <Text style={styles.subtitle}>
        Use the tabs below to generate your QR for parking or scan a QR to call.
      </Text>
      {/* Optional: Quick links */}
      <Link href="/(tabs)/generate" style={styles.link}>
        <Text>Go to Generate QR</Text>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: 'gray',
  },
  link: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007AFF',
    color: 'white',
    borderRadius: 5,
  },
});
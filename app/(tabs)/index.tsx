import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing, borderRadius, typography } from '../../hooks/useTheme';

export default function HomeScreen() {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>  
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <View style={styles.headerContent}>
          <Text style={[styles.greeting, { color: theme.textSecondary }]}>
            Welcome to
          </Text>
          <Text style={[styles.title, { color: theme.text }]}>
            Parco Assist
          </Text>
        </View>
        <TouchableOpacity 
          style={[styles.themeButton, { backgroundColor: theme.card }]} 
          onPress={toggleTheme}
        >
          <Ionicons 
            name={isDark ? 'sunny' : 'moon'} 
            size={22} 
            color={theme.primary} 
          />
        </TouchableOpacity>
      </View>

      <View style={styles.heroContainer}>
        <LinearGradient
          colors={isDark 
            ? ['#6366F1', '#4F46E5', '#3730A3'] 
            : ['#818CF8', '#6366F1', '#4F46E5']
          }
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.heroGradient}
        >
          <Ionicons name="car-sport" size={64} color="rgba(255,255,255,0.9)" />
          <Text style={styles.heroTitle}>Smart Parking</Text>
          <Text style={styles.heroSubtitle}>
            Generate a QR code with your number.{'\n'}
            Others can scan to call you instantly.
          </Text>
        </LinearGradient>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.md,
  },
  headerContent: {
    flex: 1,
  },
  greeting: {
    ...typography.caption,
    marginBottom: 4,
  },
  title: {
    ...typography.h1,
  },
  themeButton: {
    width: 44,
    height: 44,
    borderRadius: borderRadius.full,
    justifyContent: 'center',
    alignItems: 'center',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 4,
  },
  heroContainer: {
    paddingHorizontal: spacing.lg,
    marginBottom: spacing.xl,
  },
  heroGradient: {
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: 'center',
  },
  heroTitle: {
    ...typography.h2,
    color: '#FFFFFF',
    marginTop: spacing.md,
    marginBottom: spacing.sm,
  },
  heroSubtitle: {
    ...typography.body,
    color: 'rgba(255,255,255,0.85)',
    textAlign: 'center',
    lineHeight: 24,
  },
});

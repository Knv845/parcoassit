import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Modern color palette
const palette = {
  // Primary brand colors
  primary: '#6366F1',      // Indigo
  primaryLight: '#818CF8',
  primaryDark: '#4F46E5',
  
  // Accent colors
  accent: '#22D3EE',       // Cyan
  success: '#10B981',      // Emerald
  warning: '#F59E0B',      // Amber
  error: '#EF4444',        // Red
  
  // Neutrals
  white: '#FFFFFF',
  black: '#000000',
};

export const themes = {
  light: {
    // Backgrounds
    background: '#F8FAFC',
    backgroundSecondary: '#FFFFFF',
    card: '#FFFFFF',
    
    // Text
    text: '#0F172A',
    textSecondary: '#64748B',
    textMuted: '#94A3B8',
    
    // UI Elements
    border: '#E2E8F0',
    divider: '#F1F5F9',
    
    // Interactive
    primary: palette.primary,
    primaryLight: palette.primaryLight,
    accent: palette.accent,
    success: palette.success,
    error: palette.error,
    
    // Tab bar
    tabBar: '#FFFFFF',
    tabBarBorder: '#E2E8F0',
    tabActive: palette.primary,
    tabInactive: '#94A3B8',
    
    // Inputs
    inputBackground: '#F1F5F9',
    inputBorder: '#E2E8F0',
    inputText: '#0F172A',
    placeholder: '#94A3B8',
    
    // Status bar
    statusBar: 'dark' as 'light' | 'dark',
    
    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.08,
  },
  dark: {
    // Backgrounds
    background: '#000000',
    backgroundSecondary: '#121212',
    card: '#121212',
    
    // Text
    text: '#F8FAFC',
    textSecondary: '#94A3B8',
    textMuted: '#64748B',
    
    // UI Elements
    border: '#222222',
    divider: '#1A1A1A',
    
    // Interactive
    primary: palette.primaryLight,
    primaryLight: palette.primary,
    accent: palette.accent,
    success: palette.success,
    error: palette.error,
    
    // Tab bar
    tabBar: '#000000',
    tabBarBorder: '#222222',
    tabActive: palette.primaryLight,
    tabInactive: '#666666',
    
    // Inputs
    inputBackground: '#1A1A1A',
    inputBorder: '#333333',
    inputText: '#F8FAFC',
    placeholder: '#666666',
    
    // Status bar
    statusBar: 'light' as 'light' | 'dark',
    
    // Shadows
    shadowColor: '#000000',
    shadowOpacity: 0.3,
  },
};

export type Theme = typeof themes.light;
export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  mode: ThemeMode;
  isDark: boolean;
  setMode: (mode: ThemeMode) => Promise<void>;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const THEME_STORAGE_KEY = '@parcoassit_theme';

interface ThemeProviderProps {
  children: ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const systemColorScheme = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('system');
  
  // Load saved theme preference
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      if (saved && (saved === 'light' || saved === 'dark' || saved === 'system')) {
        setModeState(saved);
      }
    });
  }, []);
  
  // Determine if dark mode is active
  const isDark = mode === 'system' 
    ? systemColorScheme === 'dark' 
    : mode === 'dark';
  
  const theme = isDark ? themes.dark : themes.light;
  
  const setMode = async (newMode: ThemeMode) => {
    setModeState(newMode);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, newMode);
  };
  
  const toggleTheme = () => {
    const newMode = isDark ? 'light' : 'dark';
    setMode(newMode);
  };
  
  return (
    <ThemeContext.Provider value={{ theme, mode, isDark, setMode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextType {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

// Design system constants
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

export const typography = {
  h1: { fontSize: 32, fontWeight: '700' as const },
  h2: { fontSize: 24, fontWeight: '600' as const },
  h3: { fontSize: 20, fontWeight: '600' as const },
  body: { fontSize: 16, fontWeight: '400' as const },
  bodyMedium: { fontSize: 16, fontWeight: '500' as const },
  caption: { fontSize: 14, fontWeight: '400' as const },
  small: { fontSize: 12, fontWeight: '400' as const },
};

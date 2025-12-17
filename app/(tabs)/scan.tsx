import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking, Dimensions } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme, spacing, borderRadius, typography } from '../../hooks/useTheme';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const SCAN_SIZE = SCREEN_WIDTH * 0.7;

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);
  const [flashOn, setFlashOn] = useState(false);
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();

  // Check if it's night time (6 PM - 6 AM)
  const isNightTime = () => {
    const hour = new Date().getHours();
    return hour >= 18 || hour < 6;
  };

  // Auto-enable flash at night
  useEffect(() => {
    if (isNightTime()) {
      setFlashOn(true);
    }
  }, []);

  useEffect(() => {
    if (!permission) return;
    if (!permission.granted) requestPermission();
  }, [permission, requestPermission]);

  if (!permission) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.loadingContainer}>
          <Ionicons name="camera" size={48} color={theme.textMuted} />
          <Text style={[styles.loadingText, { color: theme.textSecondary }]}>
            Loading camera...
          </Text>
        </View>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <View style={styles.permissionContainer}>
          <View style={[styles.iconContainer, { backgroundColor: theme.primary + '15' }]}>
            <Ionicons name="camera-outline" size={48} color={theme.primary} />
          </View>
          <Text style={[styles.permissionTitle, { color: theme.text }]}>
            Camera Access Required
          </Text>
          <Text style={[styles.permissionText, { color: theme.textSecondary }]}>
            We need camera permission to scan QR codes
          </Text>
          <TouchableOpacity 
            onPress={requestPermission} 
            style={[styles.permissionButton, { backgroundColor: theme.primary }]}
          >
            <Ionicons name="lock-open-outline" size={20} color="#FFFFFF" />
            <Text style={styles.permissionButtonText}>Grant Permission</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  const handleBarCodeScanned = ({ data }: BarcodeScanningResult) => {
    if (scanned) return;
    setScanned(true);
    setScanData(data);
    const phone = data.startsWith('tel:') ? data.replace('tel:', '') : data;
    const cleanPhone = phone.replace(/\s/g, '');
    if (/^\+?\d{10,15}$/.test(cleanPhone)) {
      Linking.openURL(`tel:${cleanPhone}`);
    } else {
      Alert.alert('Invalid QR', 'The QR code does not contain a valid phone number.');
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + spacing.md }]}>
        <Text style={[styles.headerTitle, { color: theme.text }]}>Scan QR Code</Text>
        <Text style={[styles.headerSubtitle, { color: theme.textSecondary }]}>
          Position the QR code within the frame
        </Text>
      </View>

      {/* Scanner area */}
      <View style={styles.scannerContainer}>
        <View style={styles.cameraWrapper}>
          <CameraView
            style={styles.camera}
            facing="back"
            enableTorch={flashOn}
            onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            barcodeScannerSettings={{ barcodeTypes: ['qr'] }}
          />
          <View style={[styles.corner, styles.cornerTL, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.cornerTR, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.cornerBL, { borderColor: theme.primary }]} />
          <View style={[styles.corner, styles.cornerBR, { borderColor: theme.primary }]} />
        </View>
        
        {/* Controls */}
        <View style={styles.controlsContainer}>
          <TouchableOpacity 
            style={[
              styles.flashButton, 
              { 
                backgroundColor: flashOn ? theme.primary : theme.card,
                borderColor: theme.border,
              }
            ]} 
            onPress={() => setFlashOn(!flashOn)}
          >
            <Ionicons 
              name={flashOn ? 'flash' : 'flash-outline'} 
              size={24} 
              color={flashOn ? '#FFF' : theme.text} 
            />
            <Text style={[styles.flashText, { color: flashOn ? '#FFF' : theme.text }]}>
              {flashOn ? 'Flash On' : 'Flash Off'}
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.scanHintContainer}>
          <Ionicons name="qr-code-outline" size={18} color={theme.textSecondary} />
          <Text style={[styles.scanHint, { color: theme.textSecondary }]}>Align QR code here</Text>
        </View>
      </View>

      {/* Result overlay */}
      {scanned && (
        <View style={[styles.resultOverlay, { backgroundColor: theme.background }]}>
          <View style={[styles.resultCard, { backgroundColor: theme.card }]}>
            <View style={[styles.resultIcon, { backgroundColor: theme.success + '20' }]}>
              <Ionicons name="checkmark-circle" size={40} color={theme.success} />
            </View>
            <Text style={[styles.resultTitle, { color: theme.text }]}>QR Scanned!</Text>
            <Text style={[styles.resultData, { color: theme.textSecondary }]}>
              {scanData?.replace('tel:', '')}
            </Text>
            <TouchableOpacity 
              onPress={() => setScanned(false)} 
              style={[styles.scanAgainBtn, { backgroundColor: theme.primary }]}
            >
              <Ionicons name="scan" size={20} color="#FFF" />
              <Text style={styles.scanAgainText}>Scan Again</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { ...typography.body, marginTop: spacing.md },
  permissionContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: spacing.xl },
  iconContainer: { width: 96, height: 96, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.lg },
  permissionTitle: { ...typography.h3, marginBottom: spacing.sm, textAlign: 'center' },
  permissionText: { ...typography.body, textAlign: 'center', marginBottom: spacing.xl },
  permissionButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.md, gap: spacing.sm },
  permissionButtonText: { ...typography.bodyMedium, color: '#FFF' },
  header: { paddingHorizontal: spacing.lg, paddingBottom: spacing.lg },
  headerTitle: { ...typography.h2, textAlign: 'center', marginBottom: spacing.xs },
  headerSubtitle: { ...typography.caption, textAlign: 'center' },
  scannerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingBottom: spacing.xxl },
  cameraWrapper: { width: SCAN_SIZE, height: SCAN_SIZE, borderRadius: borderRadius.lg, overflow: 'hidden', position: 'relative', backgroundColor: '#000' },
  camera: { ...StyleSheet.absoluteFillObject },
  corner: { position: 'absolute', width: 28, height: 28, borderWidth: 4 },
  cornerTL: { top: 0, left: 0, borderRightWidth: 0, borderBottomWidth: 0, borderTopLeftRadius: borderRadius.md },
  cornerTR: { top: 0, right: 0, borderLeftWidth: 0, borderBottomWidth: 0, borderTopRightRadius: borderRadius.md },
  cornerBL: { bottom: 0, left: 0, borderRightWidth: 0, borderTopWidth: 0, borderBottomLeftRadius: borderRadius.md },
  cornerBR: { bottom: 0, right: 0, borderLeftWidth: 0, borderTopWidth: 0, borderBottomRightRadius: borderRadius.md },
  controlsContainer: { marginTop: spacing.lg },
  flashButton: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.sm, paddingHorizontal: spacing.md, borderRadius: borderRadius.md, borderWidth: 1, gap: spacing.xs },
  flashText: { ...typography.caption, fontWeight: '500' },
  scanHintContainer: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.md, gap: spacing.sm },
  scanHint: { ...typography.caption },
  resultOverlay: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center', padding: spacing.lg },
  resultCard: { width: '100%', maxWidth: 320, borderRadius: borderRadius.xl, padding: spacing.xl, alignItems: 'center' },
  resultIcon: { width: 72, height: 72, borderRadius: borderRadius.full, justifyContent: 'center', alignItems: 'center', marginBottom: spacing.md },
  resultTitle: { ...typography.h3, marginBottom: spacing.xs },
  resultData: { ...typography.body, marginBottom: spacing.xl },
  scanAgainBtn: { flexDirection: 'row', alignItems: 'center', paddingVertical: spacing.md, paddingHorizontal: spacing.xl, borderRadius: borderRadius.md, gap: spacing.sm },
  scanAgainText: { ...typography.bodyMedium, color: '#FFF' },
});

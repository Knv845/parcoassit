import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';
import { CameraView, useCameraPermissions, BarcodeScanningResult } from 'expo-camera';

export default function ScanScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [scanData, setScanData] = useState<string | null>(null);

  useEffect(() => {
    if (!permission) {
      // Camera permissions are still loading
      return;
    }

    if (!permission.granted) {
      // Camera permissions are not granted yet
      requestPermission();
    }
  }, [permission, requestPermission]);

  if (!permission) {
    // Camera permissions are still loading
    return <View><Text>Loading camera permissions...</Text></View>;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text>No access to camera</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const handleBarCodeScanned = ({ type, data }: BarcodeScanningResult) => {
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
    <View style={styles.container}>
      <CameraView
        style={StyleSheet.absoluteFillObject}
        facing="back"  // Use back camera for scanning
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
        barcodeScannerSettings={{
          barcodeTypes: ['qr', 'pdf417', 'code128']  // Limit to QR and common types for performance
        }}
      />
      {scanned && (
        <View style={styles.overlay}>
          <Text style={styles.scanText}>Scanned: {scanData}</Text>
          <TouchableOpacity onPress={() => setScanned(false)} style={styles.button}>
            <Text style={styles.buttonText}>Scan Again</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  overlay: {
    position: 'absolute',
    bottom: 50,
    left: 50,
    right: 50,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 15,
    borderRadius: 10,
  },
  scanText: { color: 'white', textAlign: 'center', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 10, borderRadius: 5, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 16 },
});
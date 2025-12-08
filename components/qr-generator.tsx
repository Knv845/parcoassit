import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';

interface QRGeneratorProps {
  value: string;
}

export default function QRGenerator({ value }: QRGeneratorProps) {
  const qrRef = useRef<any>(null);

  const downloadQr = async () => {
    if (qrRef.current) {
      qrRef.current.toDataURL((data: string) => {
        const base64 = data.split(',')[1];
        Sharing.shareAsync(`data:image/png;base64,${base64}`, {
          mimeType: 'image/png',
          dialogTitle: 'Share QR Code',
        });
      });
    }
  };

  const printQr = async () => {
    try {
      const html = `
        <html>
          <body style="display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; font-family: Arial;">
            <div style="text-align: center;">
              <h1>Your Parking QR Code</h1>
              <qr-value>${value}</qr-value> <!-- Placeholder; in prod, embed SVG -->
              <p>Phone: ${value.replace('tel:', '')}</p>
            </div>
          </body>
        </html>
      `;
      await Print.printAsync({ html });
    } catch (error) {
      Alert.alert('Print Error', 'Printing not available on this device.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <Text style={styles.subtitle}>Scan this to auto-dial your number</Text>
      <View style={styles.qrContainer}>
        <QRCode value={value} size={200} getRef={(ref) => (qrRef.current = ref)} />
      </View>
      <TouchableOpacity style={styles.button} onPress={downloadQr}>
        <Text style={styles.buttonText}>Download/Share QR</Text>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.button, styles.secondary]} onPress={printQr}>
        <Text style={styles.buttonText}>Print QR</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 14, color: 'gray', marginBottom: 20, textAlign: 'center' },
  qrContainer: { marginBottom: 30 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10, width: '100%' },
  secondary: { backgroundColor: 'gray' },
  buttonText: { color: 'white', fontSize: 16 },
});
import React, { useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import * as FileSystem from 'expo-file-system/legacy';
interface QRGeneratorProps {
  value: string;
}

export default function QRGenerator({ value }: QRGeneratorProps) {
  const qrRef = useRef<any>(null);

  const downloadQr = async () => {
  if (qrRef.current) {
    qrRef.current.toDataURL(async (data: string) => {
      try {
        const base64Data = data;
        const fileUri = FileSystem.cacheDirectory + 'qrcode.png';
        


        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
          encoding: 'base64',
        });

        // 3. Share the local file URI
        await Sharing.shareAsync(fileUri, {
          mimeType: 'image/png',
          dialogTitle: 'Share QR Code',
          UTI: 'public.png',
        });

      } catch (error) {
        console.error("Error sharing QR code:", error);
        Alert.alert('Share Error', 'Could not share the QR code image.');
      }
    });
  }
};

  const printQr = async () => {
    if (qrRef.current) {
      // 1. Convert the QR code to a Base64 string
      qrRef.current.toDataURL(async (base64Image: string) => {
        try {
          // 2. Construct the HTML with the Base64 image embedded in an <img> tag
          const html = `
            <html>
              <body style="display: flex; flex-direction: column; justify-content: center; align-items: center; min-height: 100vh; margin: 0; font-family: Arial;">
                <div style="text-align: center; padding: 20px; border: 1px solid #ccc; border-radius: 8px;">
                  <h1>Your Parking QR Code</h1>
                  <p>Value: ${value}</p>
                  
                  <img 
                    src="data:image/png;base64,${base64Image}" 
                    style="width: 250px; height: 250px; margin: 20px auto; display: block; border: 5px solid #000;" 
                    alt="Parking QR Code" 
                  />

                  <p style="font-size: 14px; color: #555;">Scan this to auto-dial your number.</p>
                </div>
              </body>
            </html>
          `;

          // 3. Print the HTML content
          await Print.printAsync({ html });

        } catch (error) {
          console.error('Print Error:', error);
          Alert.alert('Print Error', 'Failed to prepare or initiate printing.');
        }
      });
    } else {
      Alert.alert('Error', 'QR Code reference is not available.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Your QR Code</Text>
      <Text style={styles.subtitle}>Scan this to auto-dial your number</Text>
      <View style={styles.qrContainer}>
        <QRCode 
          value={value} 
          size={200} 
          // 👈 Ref setup for toDataURL access
          getRef={(ref) => (qrRef.current = ref)} 
        />
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
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  Keyboard,
} from 'react-native';
import QRGenerator from '../../components/qr-generator';

export default function GenerateScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [qrValue, setQrValue] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter a phone number.');
      return;
    }

    let cleanPhone = phoneNumber.trim().replace(/\s/g, '');

    // Automatically add + if missing (optional – you can remove if you want strict input)
    if (!cleanPhone.startsWith('+')) {
      cleanPhone = '+' + cleanPhone;
    }

    // Basic validation: + followed by 10-15 digits
    if (!/^\+\d{10,15}$/.test(cleanPhone)) {
      Alert.alert('Error', 'Invalid format. Use a valid international number, e.g., +1234567890');
      return;
    }

    setQrValue(`tel:${cleanPhone}`);
    Keyboard.dismiss(); // Hide keyboard after generating
  };

  return (
    <View style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Enter Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="+1234567890"
          keyboardType="phone-pad"
          autoFocus
        />

        <TouchableOpacity style={styles.button} onPress={handleGenerate}>
          <Text style={styles.buttonText}>Generate QR Code</Text>
        </TouchableOpacity>

        {/* Show QR immediately after generating */}
        {qrValue && (
          <>
            <Text style={styles.successText}>
              QR Code Generated for {qrValue.replace('tel:', '')}
            </Text>
            <QRGenerator value={qrValue} />
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  form: { flex: 1, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10, textAlign: 'center', fontWeight: '600' },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 15,
    marginBottom: 20,
    borderRadius: 8,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: { color: '#fff', fontSize: 17, fontWeight: '600' },
  successText: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 16,
    color: '#34C759',
    fontWeight: '500',
  },
});
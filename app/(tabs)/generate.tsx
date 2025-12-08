import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import { useAuth } from '../../hooks/use-auth';
import QRGenerator from '../../components/qr-generator';

export default function GenerateScreen() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState<'phone' | 'otp' | 'qr'>('phone');
  const { loading, confirmation, error, signIn, verify } = useAuth();
  const [qrValue, setQrValue] = useState<string | null>(null);

  const handleSignIn = async () => {
    if (!phoneNumber) {
      Alert.alert('Error', 'Please enter a phone number.');
      return;
    }
    const cleanPhone = phoneNumber.replace(/\s/g, '');
    if (!/^\+?\d{10,15}$/.test(cleanPhone)) {
      Alert.alert('Error', 'Invalid phone number format (e.g., +1234567890).');
      return;
    }
    try {
      await signIn(cleanPhone);
      setStep('otp');
    } catch (err) {
      Alert.alert('Sign In Error', error || 'Failed to send SMS.');
    }
  };

  const handleVerify = async () => {
    if (!otp) {
      Alert.alert('Error', 'Please enter the OTP.');
      return;
    }
    try {
      await verify(otp);
      setQrValue(`tel:${phoneNumber}`);
      setStep('qr');
    } catch (err) {
      Alert.alert('Verification Error', error || 'Invalid OTP. Try again.');
    }
  };

  if (loading) {
    return <ActivityIndicator style={styles.loader} />;
  }

  return (
    <View style={styles.container}>
      {step === 'phone' && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter your phone number</Text>
          <TextInput
            style={styles.input}
            value={phoneNumber}
            onChangeText={setPhoneNumber}
            placeholder="+1234567890"
            keyboardType="phone-pad"
            autoFocus
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleSignIn} disabled={loading}>
            <Text>Send SMS</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'otp' && (
        <View style={styles.form}>
          <Text style={styles.label}>Enter OTP sent to {phoneNumber}</Text>
          <TextInput
            style={styles.input}
            value={otp}
            onChangeText={setOtp}
            placeholder="123456"
            keyboardType="number-pad"
            maxLength={6}
            autoFocus
          />
          {error && <Text style={styles.error}>{error}</Text>}
          <TouchableOpacity style={styles.button} onPress={handleVerify} disabled={loading}>
            <Text>Verify OTP</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, styles.secondary]} onPress={handleSignIn}>
            <Text>Resend SMS</Text>
          </TouchableOpacity>
        </View>
      )}
      {step === 'qr' && qrValue && <QRGenerator value={qrValue} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  form: { flex: 1, justifyContent: 'center' },
  label: { fontSize: 18, marginBottom: 10, textAlign: 'center' },
  input: { borderWidth: 1, borderColor: 'gray', padding: 10, marginBottom: 20, borderRadius: 5 },
  error: { color: 'red', textAlign: 'center', marginBottom: 10 },
  button: { backgroundColor: '#007AFF', padding: 15, borderRadius: 5, alignItems: 'center', marginBottom: 10 },
  secondary: { backgroundColor: 'gray' },
  loader: { flex: 1, justifyContent: 'center' },
});
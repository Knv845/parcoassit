import { useState, useEffect } from 'react';
import { User, onAuthStateChanged, signInWithPhoneNumber, ConfirmationResult } from 'firebase/auth';
import { auth } from '../lib/firebase';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmation, setConfirmation] = useState<ConfirmationResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signIn = async (phoneNumber: string): Promise<void> => {
    
    try {
        
      setError(null);
      const confirm = await signInWithPhoneNumber(auth, phoneNumber);
      setConfirmation(confirm);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const verify = async (code: string): Promise<void> => {
    if (!confirmation) throw new Error('No confirmation pending');
    try {
      setError(null);
      await confirmation.confirm(code);
      setConfirmation(null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    }
  };

  const signOut = async (): Promise<void> => {
    await auth.signOut();
    setUser(null);
  };

  return { user, loading, confirmation, error, signIn, verify, signOut };
};
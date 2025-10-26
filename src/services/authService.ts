import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
  User as FirebaseUser,
  UserCredential
} from 'firebase/auth';
import { doc, setDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { User } from '../types';

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

// Convert Firebase user to our User type
const convertFirebaseUser = async (firebaseUser: FirebaseUser): Promise<User> => {
  // First try to get user data by Firebase UID
  let userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
  let userData = userDoc.data();

  // If not found by UID, search by email in the seeded users
  if (!userData) {
    const usersRef = collection(db, 'users');
    const q = query(usersRef, where('email', '==', firebaseUser.email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      userData = querySnapshot.docs[0].data();
      // Update the user document with the Firebase UID for future lookups
      await setDoc(doc(db, 'users', firebaseUser.uid), {
        ...userData,
        firebaseUid: firebaseUser.uid,
        updatedAt: new Date().toISOString()
      });
    }
  }

  return {
    id: firebaseUser.uid,
    email: firebaseUser.email!,
    firstName: userData?.firstName || firebaseUser.displayName?.split(' ')[0] || '',
    lastName: userData?.lastName || firebaseUser.displayName?.split(' ')[1] || '',
    phone: userData?.phone || '',
    role: (userData?.role as 'customer' | 'admin' | 'manager' | 'staff') || 'customer',
    createdAt: userData?.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
};

// Sign up with email and password
export const signUpWithEmail = async (signupData: SignupData): Promise<User> => {
  try {
    const { email, password, firstName, lastName, phone } = signupData;
    
    // Create user with Firebase Auth
    const userCredential: UserCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    // Update the user's display name
    await updateProfile(firebaseUser, {
      displayName: `${firstName} ${lastName}`
    });

    // Create user document in Firestore
    const userData = {
      firstName,
      lastName,
      email,
      phone: phone || '',
      role: 'customer' as const,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    await setDoc(doc(db, 'users', firebaseUser.uid), userData);

    // Return our User type
    return {
      id: firebaseUser.uid,
      ...userData
    };
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create account');
  }
};

// Sign in with email and password
export const signInWithEmail = async (loginData: LoginData): Promise<User> => {
  try {
    const { email, password } = loginData;
    
    const userCredential: UserCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebaseUser = userCredential.user;

    return await convertFirebaseUser(firebaseUser);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign in');
  }
};

// Sign out
export const signOutUser = async (): Promise<void> => {
  try {
    await signOut(auth);
  } catch (error: any) {
    throw new Error(error.message || 'Failed to sign out');
  }
};

// Get current user
export const getCurrentUser = async (): Promise<User | null> => {
  const firebaseUser = auth.currentUser;
  if (!firebaseUser) return null;

  return await convertFirebaseUser(firebaseUser);
};

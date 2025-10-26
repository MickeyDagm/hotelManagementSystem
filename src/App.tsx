import React, { useEffect } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from 'sonner';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from './config/firebase';
import { store } from './app/store';
import { AppRoutes } from './routes';
import { useAppDispatch } from './app/hooks';
import { setUser, setLoading } from './features/auth/authSlice';
import { getCurrentUser } from './services/authService';
import './../styles/globals.css';

const AppContent: React.FC = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const user = await getCurrentUser();
          dispatch(setUser(user));
        } catch (error) {
          console.error('Error getting user data:', error);
          dispatch(setUser(null));
        }
      } else {
        dispatch(setUser(null));
      }
      dispatch(setLoading(false));
    });

    return () => unsubscribe();
  }, [dispatch]);

  return <AppRoutes />;
};

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <AppContent />
      <Toaster position="top-right" richColors />
    </Provider>
  );
};

export default App;

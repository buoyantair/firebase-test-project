import { createContext, useContext, useEffect, useState } from 'react';
import { addUser } from '../utils/db';
import {GoogleAuthProvider, getAuth, signOut as fbsignOut, signInWithPopup} from 'firebase/auth'


const authContext = createContext({
  auth: null,
  loading: true,
  siginWithGoogle: async () => {},
  signOut: async () => {},
});

const formatAuthState = (user) => ({
  uid: user.uid,
  email: user.email,
  name: user.displayName,
  photoUrl: user.photoURL,
  token: null,
});

function useProvideAuth() {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleAuthChange = async (authState) => {
    if (!authState) {
      setLoading(false);
      return;
    }
    const formattedAuth = formatAuthState(authState);
    formattedAuth.token = await authState.getIdToken();
    setAuth(formattedAuth);
    setLoading(false);
  };

  const signedIn = async (
    response,
    provider = 'google'
  ) => {
    if (!response.user) {
      throw new Error('No User');
    }
    console.log('hurray')
    const authUser = formatAuthState(response.user);
    await addUser({ ...authUser, provider });
  };

  const clear = () => {
    setAuth(null);
    setLoading(true);
  };

  const siginWithGoogle = async () => {
    setLoading(true);
    return signInWithPopup(getAuth(), new GoogleAuthProvider())
      .then(signedIn);
  };
  const signOut = async () => {
    return fbsignOut(getAuth()).then(clear);
  };

  useEffect(() => {
    const unsubscribe = getAuth().onAuthStateChanged(handleAuthChange);
    return () => unsubscribe();
  }, []);

  return {
    auth,
    loading,
    siginWithGoogle,
    signOut,
  };
}

export function AuthProvider({ children }) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => useContext(authContext);
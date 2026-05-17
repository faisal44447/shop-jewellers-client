import { createContext, useEffect, useState } from "react";
import axios from "axios";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";

import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);

const auth = getAuth(app);

// axios instance
const axiosPublic = axios.create({
  baseURL: "https://shop-jewellers-server.vercel.app",
});

// 🔥 ONLY ONE Google Provider (IMPORTANT)
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CREATE USER
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // LOGIN
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔥 GOOGLE LOGIN (ONLY THIS)
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // LOGOUT
  const logOut = async () => {
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // UPDATE PROFILE
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // AUTH OBSERVER
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.email) {
        try {
          const res = await axiosPublic.post("/jwt", {
            email: currentUser.email,
          });

          if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
            setUser(currentUser);
          }
        } catch (error) {
          console.log("JWT ERROR:", error);
          setUser(null);
        }
      } else {
        localStorage.removeItem("access-token");
        setUser(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const authInfo = {
    user,
    loading,
    createUser,
    signIn,
    googleSignIn,
    logOut,
    updateUserProfile,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
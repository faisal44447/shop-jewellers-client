import { createContext, useEffect, useState } from "react";
import axios from "axios";

import {
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithRedirect,
  GoogleAuthProvider,
  signOut,
  updateProfile,
} from "firebase/auth";

import { app } from "../firebase/firebase.config";

export const AuthContext = createContext(null);
const auth = getAuth(app);

// Axios Public Instance
const axiosPublic = axios.create({
  baseURL: "https://shop-jewellers-server.vercel.app",
});

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // CREATE USER
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // LOGINWITH EMAIL & PASSWORD
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // 🔥 GOOGLE SIGN IN (REDIRECT MODE)
  const googleSignIn = () => {
    setLoading(true);
    return signInWithRedirect(auth, googleProvider);
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

  // AUTH OBSERVER (রিডাইরেক্ট হয়ে ফিরে আসার পর ইউজার এখানে ডাটা পাবে)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setLoading(true);

      if (currentUser?.email) {
        try {
          // 🟢 গুগল থেকে আসা ইউজার প্রথমবার ঢুকলে ডাটাবেজে সেভ হবে
          // (ব্যাকএন্ডে /users এ অলরেডি 'user already exists' চেক করা আছে, তাই সমস্যা হবে না)
          await axiosPublic.post("/users", {
            name: currentUser.displayName || "Google User",
            email: currentUser.email,
            role: "user",
          });

          // টোকেন নেওয়া হচ্ছে
          const res = await axiosPublic.post("/jwt", {
            email: currentUser.email,
          });

          if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
            setUser(currentUser);
          }
        } catch (error) {
          console.log("AUTH OBSERVER ERROR:", error);
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
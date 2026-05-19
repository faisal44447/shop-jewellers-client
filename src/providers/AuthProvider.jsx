import { createContext, useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  getAuth,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile
} from "firebase/auth";
import { app } from "../firebase/firebase.config";
import useAxiosPublic from "../hooks/useAxiosPublic";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();
  const axiosPublic = useAxiosPublic(); // 👈 এটি অলরেডি ছিল

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

  // GOOGLE LOGIN
  const googleSignIn = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // LOGOUT
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token");
    return signOut(auth);
  };

  // UPDATE PROFILE
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo || "",
    });
  };

  // 🌟 OBSERVER (JWT Token handler Fixed)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);

      if (currentUser) {
        const userInfo = { email: currentUser.email };
        try {
          // 🎯 ফিক্স: axios এর বদলে axiosPublic ব্যবহার এবং টোকেন রিকোয়েস্ট
          const res = await axiosPublic.post('/jwt', userInfo);
          if (res.data.token) {
            localStorage.setItem('access-token', res.data.token);
            setLoading(false); // 👈 টোকেন পাওয়ার পর সাকসেসফুলি লোডিং ফলস
          }
        } catch (error) {
          console.error("JWT Token Fetch Error:", error);
          localStorage.removeItem('access-token');
          setLoading(false);
        }
      } else {
        localStorage.removeItem('access-token');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [axiosPublic]);

  const authInfo = {
    user,
    loading,
    setLoading,
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
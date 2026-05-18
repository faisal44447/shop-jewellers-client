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
  const axiosPublic = useAxiosPublic();

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

  // OBSERVER (JWT Token handler)
  // OBSERVER (JWT Token handler)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, currentUser => {
      setUser(currentUser);

      // টোকেন হ্যান্ডেল করার লজিক
      if (currentUser) {
        // আপনার ব্যাকএন্ডে টোকেনের জন্য রিকোয়েস্ট (যদি axios ব্যবহার করেন)
        axios.post('https://your-server-url.com/jwt', { email: currentUser.email })
          .then(data => {
            if (data.data.token) {
              localStorage.setItem('access-token', data.data.token);
              setLoading(false); // 👈 টোকেন পাওয়ার পরই কেবল লোডিং ফলস হবে
            }
          })
      }
      else {
        // ইউজার লগআউট করলে টোকেন মুছে যাবে
        localStorage.removeItem('access-token');
        setLoading(false);
      }
    });
    return () => {
      return unsubscribe();
    }
  }, []);

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
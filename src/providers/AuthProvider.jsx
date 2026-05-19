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
import { app } from "../firebase/firebase.config"; // আপনার ফাইল পাথ অনুযায়ী দিন
import axios from "axios";

export const AuthContext = createContext(null);
const auth = getAuth(app);

const AuthProvider = ({ children }) => {
  const comedies = useState(null);
  const [user, setUser] = comedies[0] ? comedies : [null, () => { }]; // (নিরাপত্তার জন্য স্ট্যান্ডার্ড স্টেট)
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const googleProvider = new GoogleAuthProvider();

  // ১. ইউজার তৈরি করা (Sign Up)
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // ২. লগইন করা (Sign In)
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // ৩. গুগল লগইন (Google Login)
  const googleLogin = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // ৪. লগআউট (Log Out)
  const logOut = () => {
    setLoading(true);
    localStorage.removeItem("access-token"); // লগআউট হলে টোকেন মুছে যাবে
    return signOut(auth);
  };

  // ৫. প্রোফাইল আপডেট (Update Profile)
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // 🎯 মূল ফিক্সড এরিয়া: অন অথ স্টেট চেঞ্জ এবং JWT টোকেন ম্যানেজমেন্ট
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (loggedUser) => {
      setCurrentUser(loggedUser);

      if (loggedUser?.email) {
        const userInfo = { email: loggedUser.email };

        // 🚀 ব্যাকএন্ডের /jwt এপিআই তে রিকোয়েস্ট পাঠানো হচ্ছে
        axios.post("https://shop-jewellers-server.vercel.app/jwt", userInfo)
          .then(res => {
            if (res.data.token) {
              localStorage.setItem("access-token", res.data.token);
              setLoading(false); // 🔥 টোকেন সাকসেসফুলি সেট হওয়ার পরেই লোডিং ফলস হবে!
            }
          })
          .catch(err => {
            console.error("Token Fetch Error:", err);
            setLoading(false);
          });
      } else {
        localStorage.removeItem("access-token");
        setLoading(false);
      }
    });

    return () => {
      return unsubscribe();
    };
  }, []);

  const authInfo = {
    user: currentUser,
    loading,
    createUser,
    signIn,
    googleLogin,
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
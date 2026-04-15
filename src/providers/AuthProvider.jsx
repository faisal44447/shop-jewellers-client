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
import axios from "axios";

export const AuthContext = createContext(null);

const auth = getAuth(app);

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const googleProvider = new GoogleAuthProvider();

    // ✅ REGISTER
    const createUser = (email, password) => {
        setLoading(true);
        return createUserWithEmailAndPassword(auth, email, password);
    };

    // ✅ LOGIN
    const signIn = async (email, password) => {
        setLoading(true);
        const result = await signInWithEmailAndPassword(auth, email, password);

        // 🔥 LOGIN এর সাথে সাথে TOKEN নাও
        const user = result.user;

        const res = await axios.post("https://jewellers-shop-server.vercel.app/jwt", {
            email: user.email
        });

        if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
        }

        return result;
    };

    // ✅ GOOGLE LOGIN
    const googleSignIn = async () => {
        setLoading(true);
        const result = await signInWithPopup(auth, googleProvider);

        const user = result.user;

        const res = await axios.post("https://jewellers-shop-server.vercel.app/jwt", {
            email: user.email
        });

        if (res.data.token) {
            localStorage.setItem("access-token", res.data.token);
        }

        return result;
    };

    // ✅ LOGOUT
    const logOut = () => {
        localStorage.removeItem("access-token"); // 🔥 logout এ remove
        setLoading(true);
        return signOut(auth);
    };

    // ✅ UPDATE PROFILE
    const updateUserProfile = (name, photo) => {
        return updateProfile(auth.currentUser, {
            displayName: name,
            photoURL: photo
        });
    };

    // ✅ USER TRACK (NO TOKEN HERE ❌)
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
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
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={authInfo}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
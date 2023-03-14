import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "./Config";
import { v4 as uuid } from "uuid";
import {
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  updateProfile,
} from "firebase/auth";
const Authenticate = createContext({
  user: "CurrentUser",
  login: (email, password) => {},
  signup: (email, password) => {},
  logout: () => {},
  updateProfile: () => {},
});
export const useAuth = () => {
  return useContext(Authenticate);
};

const Authentication = ({ children }) => {
  const [currentUser, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
  };
  const signup = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
  };
  const logout = () => {
    return signOut(auth);
  };
  const profileUpdate = () => {
    return updateProfile(auth);
  };

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setIsLoading(false);
    });

    return () => {
      unsub();
    };
  }, []);
  const vals = {
    user: currentUser,
    login,
    SignUp: signup,
    logout,
    profileUpdate,
  };
  return (
    <Authenticate.Provider value={vals}>
      {!isLoading && children}
    </Authenticate.Provider>
  );
};

export default Authentication;

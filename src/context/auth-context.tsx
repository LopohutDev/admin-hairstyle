"use client";

import {
  ReactNode,
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth";
import { auth, database } from "@/lib/firebase";
import { onValue, ref } from "firebase/database";
import "firebase/auth";

export interface AuthContextType {
  //   cartItems: EventTicket[];
  //   voucher?: Voucher;
  //   voucherErrorMessage?: string;
  //   code: string;
  //   setCode: (value: any) => void;
  //   setCartItems: (value: any) => void;
  //   setVoucher: (value: any) => void;
  //   setVoucherErrorMessage: (value: any) => void;
  //   handleCheckout: (eventId: string) => any;
  //   handleVoucher: (value: VoucherRequest) => any;
  onLogin: (data: LoginForm) => Promise<void>;
  setIsSignedIn: React.Dispatch<React.SetStateAction<boolean>>;
  isSignedIn: boolean;
  loginError?: string;
  handleLogout: () => Promise<void>;
}

export interface LoginForm {
  email: string;
  password: string;
}

export type UserProfile =
  | {
      role: "admin" | "user";
    }
  | undefined;

const defaultAuthContext: AuthContextType = {
  //   cartItems: [],
  //   code: "",
  //   setCode: () => {},
  //   setCartItems: () => {},
  //   setVoucher: () => {},
  //   handleCheckout: () => {},
  //   handleVoucher: () => {},
  //   setVoucherErrorMessage: () => {},
  setIsSignedIn: () => {},
  isSignedIn: false,
  onLogin: async () => {},
  handleLogout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

export const useAuthContext = () => useContext(AuthContext);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [isSignedIn, setIsSignedIn] = useState<boolean>(false);
  const [loginError, setLoginError] = useState<string | undefined>();
  const [userList, setUserList] = useState();

  useEffect(() => {
    const dbRef = ref(database, "User_Profiling");

    const onDataChange = (snapshot: any) => {
      const fetchedData = snapshot.val();

      setUserList(fetchedData);
    };

    onValue(dbRef, onDataChange);

    return () => {
      onValue(dbRef, onDataChange);
      setLoginError(undefined);
    };
  }, [database]);

  useEffect(() => {
    // Add an observer to check if the user is still authenticated
    const unsubscribe = onAuthStateChanged(auth, () => {
      setIsSignedIn(true);
    });

    // Cleanup the observer on component unmount
    return () => unsubscribe();
  }, []);

  const onLogin = async (data: LoginForm) => {
    try {
      setLoginError(undefined);
      const userCreds = await signInWithEmailAndPassword(
        auth,
        data.email,
        data.password
      );

      const userProfile =
        (userList?.[userCreds.user.uid] as UserProfile) ?? undefined;

      if (userProfile && userProfile.role === "admin") {
        setIsSignedIn(true);
      } else {
        setIsSignedIn(false);
        setLoginError("User is not an admin!");
      }

      console.log("Signed in successfully!", userCreds);
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }

      setLoginError(`Error signing in: ${errorMessage}`);
      console.error("Error signing in:", errorMessage);
    }
  };

  const handleLogout = async () => {
    try {
      // Call the signOut method from Firebase Authentication
      await signOut(auth);

      setIsSignedIn(false);
    } catch (error) {
      let errorMessage = "Failed to do something exceptional";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      console.error("Error logging out:", errorMessage);
    }
  };

  return (
    <AuthContext.Provider
      value={{ setIsSignedIn, isSignedIn, onLogin, loginError, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

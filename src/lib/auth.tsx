import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { auth, isFirebaseConfigured } from "./firebase";

interface AuthContextValue {
  user: string | null; // email or "demo-admin"
  ready: boolean;
  mode: "firebase" | "local";
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const DEMO_PASSWORD = import.meta.env.VITE_DEMO_ADMIN_PASSWORD || "linen-admin";
const DEMO_KEY = "tls:admin";
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export function AuthProvider({ children }: { children: ReactNode }) {
  const mode = isFirebaseConfigured ? "firebase" : "local";
  const [user, setUser] = useState<string | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (mode === "local") {
      setUser(sessionStorage.getItem(DEMO_KEY));
      setReady(true);
      return;
    }
    // Firebase: subscribe to auth state.
    let unsub = () => {};
    import("firebase/auth").then(({ onAuthStateChanged }) => {
      unsub = onAuthStateChanged(auth!, (u) => {
        setUser(u?.email ?? null);
        setReady(true);
      });
    });
    return () => unsub();
  }, [mode]);

  const signIn: AuthContextValue["signIn"] = async (email, password) => {
    if (mode === "local") {
      if (password !== DEMO_PASSWORD) {
        throw new Error("Incorrect password.");
      }
      sessionStorage.setItem(DEMO_KEY, "demo-admin");
      setUser("demo-admin");
      return;
    }
    if (ADMIN_EMAIL && email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase()) {
      throw new Error("This account is not authorised for admin access.");
    }
    const { signInWithEmailAndPassword } = await import("firebase/auth");
    await signInWithEmailAndPassword(auth!, email.trim(), password);
  };

  const signOut: AuthContextValue["signOut"] = async () => {
    if (mode === "local") {
      sessionStorage.removeItem(DEMO_KEY);
      setUser(null);
      return;
    }
    const { signOut: fbSignOut } = await import("firebase/auth");
    await fbSignOut(auth!);
  };

  return (
    <AuthContext.Provider value={{ user, ready, mode, signIn, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { isFirebaseConfigured } from "../firebase";
import { LocalProvider } from "./localProvider";
import { FirebaseProvider } from "./firebaseProvider";
import type { DataProvider, SiteData } from "./types";

// Pick the live provider once, at module load.
export const provider: DataProvider = isFirebaseConfigured
  ? new FirebaseProvider()
  : new LocalProvider();

interface DataContextValue {
  data: SiteData | null;
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  provider: DataProvider;
}

const DataContext = createContext<DataContextValue | null>(null);

export function DataProviderRoot({ children }: { children: ReactNode }) {
  const [data, setData] = useState<SiteData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setError(null);
      const next = await provider.load();
      setData(next);
    } catch (e) {
      console.error(e);
      setError(
        "We couldn't load the catalogue. Please check your connection and try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const value = useMemo(
    () => ({ data, loading, error, refresh, provider }),
    [data, loading, error, refresh]
  );

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
}

export function useSiteData(): DataContextValue {
  const ctx = useContext(DataContext);
  if (!ctx) throw new Error("useSiteData must be used within DataProviderRoot");
  return ctx;
}

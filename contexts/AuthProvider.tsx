import AsyncStorageLib from "@react-native-async-storage/async-storage";
import { AuthSession } from "@supabase/supabase-js";
import {
  createContext,
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { LogBox, Platform } from "react-native";
import { supabase } from "../hooks/useSupabase";

// https://www.hxann.com/blog/posts/using-supabase-authentication-on-expo

const isBrowser = () => Platform.OS === "web";

type State = {
  session: AuthSession | null | undefined;
};

export const AuthContext = createContext<State | undefined>(undefined);

function AuthContextProvider({ children }: { children: ReactNode }) {
  /**
   * What the session state can tell us:
   * - undefined: The session is being loaded.
   * - null: The session is fetched and is unavailable.
   * - AuthSession: There is a session.
   */
  const [session, setSession] = useState<AuthSession | null | undefined>(
    undefined
  );

  useEffect(() => {
    LogBox.ignoreLogs(["Setting a timer"]);

    const fetchedSession = supabase.auth.session();
    setSession(fetchedSession || isBrowser() ? fetchedSession : undefined);
    (async () => {
      if (isBrowser()) return;
      const storageSession = await AsyncStorageLib.getItem(
        "supabase.auth.token"
      );
      if (!storageSession) {
        setSession((oldSession) =>
          oldSession === undefined ? null : oldSession
        );
      }
    })();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (_event, newSession) => {
        setSession(newSession);
      }
    );

    return () => {
      if (authListener) {
        authListener.unsubscribe();
      }
    };
  }, []);

  const value = useMemo(
    () => ({
      session,
    }),
    [session]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error(
      `useAuthContext must be used within a AuthContextProvider.`
    );
  }
  return context;
};

const useAuthUser = () => {
  const { session } = useAuthContext();
  if (session === undefined) return undefined;
  return session?.user ?? null;
};

export { AuthContextProvider, useAuthContext, useAuthUser };

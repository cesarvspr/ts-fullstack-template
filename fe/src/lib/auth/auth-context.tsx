'use client';

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';
import {
  graphqlClient,
  setAuthToken,
  clearAuthToken,
  getAuthToken,
} from './graphql-client';

type User = {
  id: string;
  email: string;
  name: string;
  role: 'ADMIN' | 'USER';
};

type AuthContextType = {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (data: {
    email: string;
    password: string;
    name: string;
  }) => Promise<void>;
  signOut: () => void;
};

type AuthPayload = { token: string; user: User };

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SIGN_IN_MUTATION = `
  mutation SignIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      token
      user { id email name role }
    }
  }
`;

const SIGN_UP_MUTATION = `
  mutation SignUp($email: String!, $password: String!, $name: String!) {
    signUp(email: $email, password: $password, name: $name) {
      token
      user { id email name role }
    }
  }
`;

const ME_QUERY = `
  query Me {
    me { id email name role }
  }
`;

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    const storedToken = getAuthToken();
    if (!storedToken) {
      setIsLoading(false);
      return;
    }

    try {
      setAuthToken(storedToken);
      const data = await graphqlClient<{ me: User | null }>(ME_QUERY);
      if (data.me) {
        setUser(data.me);
        setToken(storedToken);
      } else {
        clearAuthToken();
        setToken(null);
      }
    } catch {
      clearAuthToken();
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const signIn = useCallback(
    async (email: string, password: string): Promise<User> => {
      const data = await graphqlClient<{ signIn: AuthPayload }>(
        SIGN_IN_MUTATION,
        { email, password },
      );
      setAuthToken(data.signIn.token);
      setToken(data.signIn.token);
      setUser(data.signIn.user);
      return data.signIn.user;
    },
    [],
  );

  const signUp = useCallback(
    async (signUpData: {
      email: string;
      password: string;
      name: string;
    }) => {
      const data = await graphqlClient<{ signUp: AuthPayload }>(
        SIGN_UP_MUTATION,
        signUpData,
      );
      setAuthToken(data.signUp.token);
      setToken(data.signUp.token);
      setUser(data.signUp.user);
    },
    [],
  );

  const signOut = useCallback(() => {
    clearAuthToken();
    setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isLoading,
        isAuthenticated: !!user,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

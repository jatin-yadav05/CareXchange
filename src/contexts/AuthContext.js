'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const userData = await res.json();
        setUser(userData);
      } else if (res.status === 401) {
        // User is not authenticated, this is a normal state
        setUser(null);
      } else {
        // Handle other errors
        console.error('Error checking user status:', await res.text());
      }
    } catch (error) {
      // Handle network errors or other exceptions
      console.error('Error checking user:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to login');
      }

      // Set user data from response
      if (data.user) {
        setUser(data.user);
      } else {
        await checkUser(); // Fallback to checking user if no data in response
      }
      
      // Get the redirect URL from query params or default to home
      const params = new URLSearchParams(window.location.search);
      const from = params.get('from') || '/';
      router.push(from);
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const signup = async (name, email, password, role, phone, address) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          name, 
          email, 
          password,
          role,
          phone,
          address
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Failed to signup');
      }

      // Set user data from response
      if (data.user) {
        setUser(data.user);
      } else {
        await checkUser(); // Fallback to checking user if no data in response
      }

      router.push('/');
      router.refresh();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    try {
      const res = await fetch('/api/auth/logout', {
        method: 'POST',
      });

      if (!res.ok) {
        throw new Error('Failed to logout');
      }

      setUser(null);
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login, 
      signup, 
      logout,
      isAuthenticated: !!user 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}; 
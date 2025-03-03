'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from 'react-hot-toast';

export default function Providers({ children }) {
  return (
    <AuthProvider>
      <ToastProvider>
        {children}
        <Toaster position="top-right" />
      </ToastProvider>
    </AuthProvider>
  );
} 
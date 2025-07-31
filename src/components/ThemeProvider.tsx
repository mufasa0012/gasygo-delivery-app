
'use client';

import * as React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    // Set a default theme or get from localStorage
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.classList.add(savedTheme);
    
    const fetchAndApplyTheme = async () => {
      const docRef = doc(db, 'settings', 'businessInfo');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const settings = docSnap.data();
        if (settings.primaryColor) {
          document.documentElement.style.setProperty('--primary', settings.primaryColor);
        }
      }
    };

    fetchAndApplyTheme();
  }, []);

  return <>{children}</>;
}

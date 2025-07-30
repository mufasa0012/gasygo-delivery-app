
'use client';

import * as React from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  React.useEffect(() => {
    const fetchAndApplyTheme = async () => {
      const docRef = doc(db, 'settings', 'businessInfo');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const settings = docSnap.data();
        if (settings.primaryColor) {
           // This will work for both light and dark mode as long as the variable is defined in both
          document.documentElement.style.setProperty('--primary-hsl', settings.primaryColor);
        }
      }
    };

    fetchAndApplyTheme();
  }, []);

  return <>{children}</>;
}

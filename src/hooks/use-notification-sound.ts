// src/hooks/use-notification-sound.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';

const MUTE_STORAGE_KEY = 'gasygo-mute-preference';
const DEFAULT_NEW_ORDER_SOUND_URL = 'https://cdn.jsdelivr.net/gh/k-g-g/static-files/audio/notification.mp3';
const DEFAULT_REMINDER_SOUND_URL = 'https://cdn.jsdelivr.net/gh/k-g-g/static-files/audio/reminder.mp3';

export function useNotificationSound() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [volume, setVolume] = useState(1);

  const newOrderAudioRef = useRef<HTMLAudioElement | null>(null);
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load mute preference from local storage
    const storedMutePref = localStorage.getItem(MUTE_STORAGE_KEY);
    setIsMuted(storedMutePref === 'true');

    // Fetch sound settings from Firestore
    const fetchSoundSettings = async () => {
      try {
        const settingsDoc = await getDoc(doc(db, 'settings', 'site-settings'));
        if (settingsDoc.exists()) {
          const data = settingsDoc.data();
          setVolume(data.notificationVolume ?? 1);
          newOrderAudioRef.current = new Audio(data.newOrderSoundUrl || DEFAULT_NEW_ORDER_SOUND_URL);
          reminderAudioRef.current = new Audio(data.reminderSoundUrl || DEFAULT_REMINDER_SOUND_URL);
        } else {
          // Fallback to defaults if no settings doc exists
          newOrderAudioRef.current = new Audio(DEFAULT_NEW_ORDER_SOUND_URL);
          reminderAudioRef.current = new Audio(DEFAULT_REMINDER_SOUND_URL);
        }
        newOrderAudioRef.current.load();
        reminderAudioRef.current.load();
      } catch (error) {
        console.error("Failed to fetch sound settings, using defaults:", error);
        newOrderAudioRef.current = new Audio(DEFAULT_NEW_ORDER_SOUND_URL);
        reminderAudioRef.current = new Audio(DEFAULT_REMINDER_SOUND_URL);
        newOrderAudioRef.current.load();
        reminderAudioRef.current.load();
      }
    };

    fetchSoundSettings();
  }, []);

  const requestInteraction = useCallback(() => {
    if (!hasInteracted) {
      setHasInteracted(true);
    }
  }, [hasInteracted]);

  const toggleMute = useCallback(() => {
    setIsMuted((prevMuted) => {
      const newMutedState = !prevMuted;
      localStorage.setItem(MUTE_STORAGE_KEY, String(newMutedState));
      if (!newMutedState) {
        requestInteraction();
      }
      return newMutedState;
    });
  }, [requestInteraction]);

  const playSound = useCallback((audioRef: React.RefObject<HTMLAudioElement>) => {
    if (!isMuted && hasInteracted && audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        console.warn("Audio play failed:", err);
      });
    }
  }, [isMuted, hasInteracted, volume]);

  const playNewOrderSound = useCallback(() => {
    playSound(newOrderAudioRef);
  }, [playSound]);

  const playReminderSound = useCallback(() => {
    playSound(reminderAudioRef);
  }, [playSound]);

  return { isMuted, toggleMute, playNewOrderSound, playReminderSound, requestInteraction };
}

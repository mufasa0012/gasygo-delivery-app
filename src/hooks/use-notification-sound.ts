// src/hooks/use-notification-sound.ts
'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const MUTE_STORAGE_KEY = 'gasygo-mute-preference';
const NEW_ORDER_SOUND_URL = 'https://cdn.jsdelivr.net/gh/k-g-g/static-files/audio/notification.mp3';
const REMINDER_SOUND_URL = 'https://cdn.jsdelivr.net/gh/k-g-g/static-files/audio/reminder.mp3';

export function useNotificationSound() {
  const [isMuted, setIsMuted] = useState(true);
  const [hasInteracted, setHasInteracted] = useState(false);

  const newOrderAudioRef = useRef<HTMLAudioElement | null>(null);
  const reminderAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    // Load mute preference from local storage
    const storedMutePref = localStorage.getItem(MUTE_STORAGE_KEY);
    setIsMuted(storedMutePref === 'true');

    // Preload audio elements
    newOrderAudioRef.current = new Audio(NEW_ORDER_SOUND_URL);
    reminderAudioRef.current = new Audio(REMINDER_SOUND_URL);
    newOrderAudioRef.current.load();
    reminderAudioRef.current.load();
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
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(err => {
        // This might happen if the user hasn't interacted with the page yet.
        console.warn("Audio play failed:", err);
      });
    }
  }, [isMuted, hasInteracted]);

  const playNewOrderSound = useCallback(() => {
    playSound(newOrderAudioRef);
  }, [playSound]);

  const playReminderSound = useCallback(() => {
    playSound(reminderAudioRef);
  }, [playSound]);

  return { isMuted, toggleMute, playNewOrderSound, playReminderSound, requestInteraction };
}

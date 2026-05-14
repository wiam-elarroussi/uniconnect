import { createContext, useContext } from 'react';

/** Même clé que le mood du fil (Dashboard) pour rester cohérent après connexion */
export const WELCOME_MOOD_STORAGE_KEY = 'uniconnect.dashboard.mood';

export const WelcomeMoodContext = createContext({
  mood: 'light',
  setMood: () => {},
  toggleMood: () => {},
});

export function useWelcomeMood() {
  return useContext(WelcomeMoodContext);
}

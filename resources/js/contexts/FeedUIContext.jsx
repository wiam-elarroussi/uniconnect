import { createContext, useContext, useMemo, useState } from 'react';
import { usePage } from '@inertiajs/react';

const FeedUIContext = createContext(null);

export function FeedUIProvider({ children }) {
  const unreadCount = usePage()?.props?.unreadNotificationsCount ?? 0;
  const [composerOpen, setComposerOpen] = useState(false);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [storyCreateOpen, setStoryCreateOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  const value = useMemo(
    () => ({
      composerOpen,
      setComposerOpen,
      openComposer: () => setComposerOpen(true),
      closeComposer: () => setComposerOpen(false),
      createMenuOpen,
      setCreateMenuOpen,
      openCreateMenu: () => setCreateMenuOpen(true),
      closeCreateMenu: () => setCreateMenuOpen(false),
      toggleCreateMenu: () => setCreateMenuOpen((v) => !v),
      storyCreateOpen,
      setStoryCreateOpen,
      openStoryCreate: () => setStoryCreateOpen(true),
      closeStoryCreate: () => setStoryCreateOpen(false),
      notifOpen,
      setNotifOpen,
      moreOpen,
      setMoreOpen,
      unreadCount,
    }),
    [composerOpen, createMenuOpen, storyCreateOpen, notifOpen, moreOpen, unreadCount]
  );

  return <FeedUIContext.Provider value={value}>{children}</FeedUIContext.Provider>;
}

const noOpFeed = {
  composerOpen: false,
  setComposerOpen: () => {},
  openComposer: () => {},
  closeComposer: () => {},
  createMenuOpen: false,
  setCreateMenuOpen: () => {},
  openCreateMenu: () => {},
  closeCreateMenu: () => {},
  toggleCreateMenu: () => {},
  storyCreateOpen: false,
  setStoryCreateOpen: () => {},
  openStoryCreate: () => {},
  closeStoryCreate: () => {},
  notifOpen: false,
  setNotifOpen: () => {},
  moreOpen: false,
  setMoreOpen: () => {},
  unreadCount: 0,
};

export function useFeedUI() {
  const value = useContext(FeedUIContext);
  if (value == null) {
    if (import.meta.env.DEV) {
      // eslint-disable-next-line no-console
      console.warn('useFeedUI: aucun FeedUIProvider ancêtre. Utilisez le hook dans le contenu du feed, pas dans le page component racine.');
    }
    return noOpFeed;
  }
  return value;
}

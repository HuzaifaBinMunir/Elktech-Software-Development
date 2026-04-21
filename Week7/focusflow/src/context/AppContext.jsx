import { createContext, useContext, useMemo, useState } from "react";

const AppContext = createContext();

export function AppProvider({ children }) {
  const [savedItems, setSavedItems] = useState([]);

  const toggleSave = (item) => {
    setSavedItems((prev) => {
      const exists = prev.some((saved) => saved.id === item.id);
      if (exists) {
        return prev.filter((saved) => saved.id !== item.id);
      }
      return [...prev, item];
    });
  };

  const isSaved = (id) => savedItems.some((item) => item.id === id);

  const value = useMemo(
    () => ({
      savedItems,
      toggleSave,
      isSaved,
    }),
    [savedItems]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useAppContext() {
  return useContext(AppContext);
}
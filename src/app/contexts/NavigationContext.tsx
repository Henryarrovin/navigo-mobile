import { createContext, useState, ReactNode } from "react";

export type Navigation = {
  start: string;
  end: string;
};

export type NavigationContextType = {
  navigation: Navigation;
  setNavigation: (nav: Navigation) => void;
  isEditMode: boolean;
  setIsEditMode: (edit: boolean) => void;
};

const NavigationContext = createContext<NavigationContextType | null>(null);

export const NavigationProvider = ({ children }: { children: ReactNode }) => {
  const [navigation, setNavigation] = useState<Navigation>({ start: "v35", end: "" });
  const [isEditMode, setIsEditMode] = useState(false);

  return (
    <NavigationContext.Provider value={{ navigation, setNavigation, isEditMode, setIsEditMode }}>
      {children}
    </NavigationContext.Provider>
  );
};

export default NavigationContext;
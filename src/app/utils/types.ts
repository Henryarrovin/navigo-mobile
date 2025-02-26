export interface Navigation {
    start: string;
    end?: string;
}

export interface NavigationContextType {
    navigation: Navigation;
    setNavigation: React.Dispatch<React.SetStateAction<Navigation>>;
    isEditMode: boolean;
    setIsEditMode: React.Dispatch<React.SetStateAction<boolean>>;
}
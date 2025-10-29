"use client";

import { createContext, useState } from "react";

export enum DrawerEnum {
    statistic = "statistic"
}

export type DrawerContextType = {
    showedDrawer: DrawerEnum | null,
    setShowedDrawer: (d: DrawerEnum | null) => void;
}

export const DrawerContext = createContext<DrawerContextType>({
    showedDrawer: null,
    setShowedDrawer: () => { },
})

export const DrawerProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [drawerKind, setDrawerKind] = useState<DrawerEnum | null>(null);

    function setDrawerShowUp(d: DrawerEnum | null) {
        setDrawerKind(d);
    }

    return (
        <DrawerContext.Provider value={{
            showedDrawer: drawerKind,
            setShowedDrawer: setDrawerShowUp,
        }}>
            {children}
        </DrawerContext.Provider>
    );
}
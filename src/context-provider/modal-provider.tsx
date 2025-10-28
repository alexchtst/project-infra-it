"use client";

import { createContext, useState } from "react";

export enum ModalKindEnum {
    loginopt = "loginopt",
}

export type ModalContextType = {
    modalKind: ModalKindEnum | null,
    setModalKind: (d: ModalKindEnum | null) => void;
}

export const ModalContext = createContext<ModalContextType>({
    modalKind: null,
    setModalKind: () => { },
})

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    return (
        <ModalContext.Provider value={{
            modalKind: modalKind,
            setModalKind: setModalShowUp,
        }}>
            {children}
        </ModalContext.Provider>
    );
}

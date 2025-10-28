"use client";

import { createContext } from "react";
import { ModalKindEnum } from "./modal-provider";
import { useState } from "react";

export type DataFlowContextType = {
    modalOption: ModalKindEnum | null,
    setModalOption: (d: ModalKindEnum | null) => void;
}

export const DataFlowContext = createContext<DataFlowContextType>({
    modalOption: null,
    setModalOption: () => { },
})

export const DataFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    return (
        <DataFlowContext.Provider value={{
            modalOption: modalKind,
            setModalOption: setModalShowUp,
        }}>
            {children}
        </DataFlowContext.Provider>
    );
}
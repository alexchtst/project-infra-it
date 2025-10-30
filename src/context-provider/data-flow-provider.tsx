"use client";

import { createContext, useState } from "react";
import { ModalKindEnum } from "./modal-provider";

export enum mapdataproperty {
    g4 = "g4",
    g2 = "g2",
    sekolah = "sekolah",
    puskesmas = "puskesmas",
    posyandu = "posyandu",
}

export enum maptype {
    satellite = "satellite",
    streets = "streets",
    terrain = "terrain",
}

export type DataFlowContextType = {
    modalOption: ModalKindEnum | null,
    mapType: maptype,
    setModalOption: (d: ModalKindEnum | null) => void;
    setMapType: (d: maptype) => void;
}

export const DataFlowContext = createContext<DataFlowContextType>({
    modalOption: null,
    mapType: maptype.satellite,
    setMapType: () => { },
    setModalOption: () => { },
})

export const DataFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [showedMaptype, setShowedMaptype] = useState<maptype>(maptype.satellite);

    function setModalShowUp(d: ModalKindEnum | null) {
        setModalKind(d);
    }

    function setMapType(d: maptype) {
        setShowedMaptype(d);
    }

    return (
        <DataFlowContext.Provider value={{
            modalOption: modalKind,
            mapType: showedMaptype,
            setModalOption: setModalShowUp,
            setMapType: setMapType,
        }}>
            {children}
        </DataFlowContext.Provider>
    );
}
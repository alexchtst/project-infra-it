"use client";

import { createContext, useState } from "react";
import { ModalKindEnum } from "./modal-provider";

export enum mapdataproperty {
    g4 = "4G",
    g2 = "2G",
    sekolah = "sekolah",
    penduduk = "penduduk",
    listrik = "listrik",
}

export enum maptype {
    satellite = "satellite",
    streets = "streets",
}

export interface NamaDaereahInterface {
    village: string;
    district: string;
    tobedisplayed: string
}

export type DataFlowContextType = {
    modalOption: ModalKindEnum | null,
    namadesaConfig: NamaDaereahInterface;
    namadesaStatistic: NamaDaereahInterface;
    configvalueManagement: {
        data: mapdataproperty[];
        reseter: () => void;
        togglesetter: (d: mapdataproperty) => void;
        setter: (d: mapdataproperty[]) => void;
        remover: (d: mapdataproperty) => void;
    }
    setModalOption: (d: ModalKindEnum | null) => void;
    setNamadesaConfig: (d: NamaDaereahInterface) => void;
    setNamadesaStatistic: (d: NamaDaereahInterface) => void;
}

export const DataFlowContext = createContext<DataFlowContextType>({
    modalOption: null,
    namadesaConfig: {district: "", tobedisplayed: "", village: ""},
    namadesaStatistic: {district: "", tobedisplayed: "", village: ""},
    configvalueManagement: {
        data: [],
        remover: () => { },
        togglesetter: () => { },
        reseter: () => { },
        setter: () => { }
    },
    setModalOption: () => { },
    setNamadesaConfig: () => { },
    setNamadesaStatistic: () => { },
})

export const DataFlowProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [modalKind, setModalKind] = useState<ModalKindEnum | null>(null);
    const [namadesaStatistic, setNamadesaStatistic] = useState<NamaDaereahInterface>({district: "", tobedisplayed: "", village: ""});
    const [namadesaConfig, setNamadesaConfig] = useState<NamaDaereahInterface>({district: "", tobedisplayed: "", village: ""});
    const [configValue, setConfigValue] = useState<mapdataproperty[]>([]);

    function removeConfig(d: mapdataproperty) {
        setConfigValue((prev) => (prev ?? []).filter((item) => item !== d));
    }

    function reseterConfig() {
        setConfigValue([]);
    }

    function setterConfig(d: mapdataproperty[]) {
        setConfigValue(d);
    }

    function toggle(d: mapdataproperty) {
        setConfigValue((prev) =>
            prev.includes(d)
                ? prev.filter((item) => item !== d)
                : [...prev, d]
        );
    }

    return (
        <DataFlowContext.Provider value={{
            modalOption: modalKind,
            namadesaConfig: namadesaConfig,
            namadesaStatistic: namadesaStatistic,
            configvalueManagement: {
                data: configValue,
                remover: removeConfig,
                reseter: reseterConfig,
                setter: setterConfig,
                togglesetter: toggle
            },
            setNamadesaConfig: setNamadesaConfig,
            setNamadesaStatistic: setNamadesaStatistic,
            setModalOption: setModalKind,
        }}>
            {children}
        </DataFlowContext.Provider>
    );
}
"use client";

import React from "react";
import { ModalContext } from "@/context-provider/modal-provider";
import { X, CheckSquare, Square } from "lucide-react";
import SearchDistrict from "../search-district";
import { DataFlowContext, mapdataproperty, NamaDaereahInterface } from "@/context-provider/data-flow-provider";

export default function ModalOption() {
    const { setModalKind } = React.useContext(ModalContext);
    const { configvalueManagement, namadesaConfig, setNamadesaConfig } = React.useContext(DataFlowContext)
    const [selectedOptions, setSelectedOptions] = React.useState<mapdataproperty[]>(configvalueManagement.data);

    const [desa, setDesa] = React.useState<NamaDaereahInterface>(namadesaConfig);

    function handleClose() {
        setModalKind(null);
    }

    function handleToggle(option: mapdataproperty) {
        setSelectedOptions((prev) =>
            prev.includes(option)
                ? prev.filter((item) => item !== option)
                : [...prev, option]
        );
    }

    function handleSave() {
        console.log("Selected properties:", selectedOptions);
        configvalueManagement.setter(selectedOptions);
        setNamadesaConfig(desa);
        setModalKind(null);
    }

    return (
        <div className="bg-white rounded-2xl shadow-lg max-w-md w-[90vw] md:w-[700px] max-h-[85vh] relative animate-fadeIn flex flex-col border border-gray-200">
            {/* Tombol close */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full p-1 transition"
                aria-label="Close modal"
            >
                <X size={16} />
            </button>

            {/* Konten utama */}
            <div className="p-6 space-y-6 overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">
                        Overlay Tampilan
                    </h2>
                    <p className="text-sm text-gray-500">
                        Pilih data yang akan ditampilkan sebagai{" "}
                        <span className="font-medium text-gray-700">sebaran</span>{" "}
                        dan{" "}
                        <span className="font-medium text-gray-700">kondisi</span>{" "}
                        infrastruktur{" "}
                        pada peta.
                    </p>
                </div>

                <SearchDistrict name={desa} setter={setDesa} />

                <div className="grid grid-cols-3 gap-2">
                    {Object.values(mapdataproperty).map((option) => {
                        const isSelected = selectedOptions.includes(option);
                        return (
                            <button
                                key={option}
                                onClick={() => handleToggle(option)}
                                className={`w-full flex items-center justify-between border rounded-xl px-4 py-3 text-sm font-medium transition ${isSelected
                                    ? "border-gray-500 bg-gray-50 text-gray-700"
                                    : "border-gray-200 hover:border-gray-300 text-gray-700"
                                    }`}
                            >
                                <span className="capitalize">{option}</span>
                                {isSelected ? (
                                    <CheckSquare
                                        className="text-gray-500"
                                        size={18}
                                    />
                                ) : (
                                    <Square size={18} />
                                )}
                            </button>
                        );
                    })}
                </div>

                <div className="flex gap-2">
                    <button
                        onClick={handleClose}
                        className="text-sm px-3 py-1.5 rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Batal
                    </button>
                    <button
                        onClick={handleSave}
                        className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Simpan
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 rounded-b-2xl flex items-center justify-between">
                <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-bold">Petunjuk:</span> pilih satu
                    atau lebih layer daerah pada map yang ingin ditampilkan pada peta.
                </p>
            </div>
        </div>
    );
}

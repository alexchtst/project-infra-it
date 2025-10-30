import { DrawerContext, DrawerEnum } from "@/context-provider/drawer-provider";
import { ModalContext } from "@/context-provider/modal-provider";
import { X } from "lucide-react";
import React from "react";
import SearchDesa from "../search-desa";
import { DataFlowContext, NamaDaereahInterface } from "@/context-provider/data-flow-provider";

export default function ModalStatistics() {
    const { setModalKind } = React.useContext(ModalContext);
    const { setShowedDrawer } = React.useContext(DrawerContext);
    const { namadesaStatistic, setNamadesaStatistic } = React.useContext(DataFlowContext)

    const [desa, setDesa] = React.useState<NamaDaereahInterface>(namadesaStatistic);

    function handleClose() {
        setNamadesaStatistic(desa);
        setModalKind(null);
    }

    function handleSave() {
        console.log("Selected properties:");
        setModalKind(null);
    }

    function handleOverview() {
        setModalKind(null);
        setShowedDrawer(DrawerEnum.statistic);
    }

    return (
        <div className="bg-white rounded-2xl shadow-md max-w-md w-[90vw] md:w-[700px] max-h-[85vh] relative animate-fadeIn flex flex-col">
            {/* Tombol close */}
            <button
                onClick={handleClose}
                className="absolute top-3 right-3 bg-gray-100 hover:bg-gray-200 text-gray-500 rounded-full p-1 transition"
            >
                <X size={16} />
            </button>

            {/* Konten */}
            <div className="p-6 space-y-5 overflow-y-auto no-scrollbar">
                {/* Header */}
                <div className="text-center space-y-1">
                    <h2 className="text-xl font-semibold text-gray-800">Overview Statistik Daerah</h2>
                    <p className="text-sm text-gray-500">
                        Pilih daerah dan kondisi untuk melihat statistik penyebarannya
                    </p>
                </div>

                <SearchDesa name={desa} setter={setDesa} />

                <div className="flex gap-2">
                    <button
                        onClick={handleSave}
                        className="text-sm px-3 py-1.5 min-w-[3vw] rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
                    >
                        Lengkap
                    </button>
                    <button
                        onClick={handleOverview}
                        className="text-sm px-3 py-1.5 min-w-[3vw] rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Overview
                    </button>
                    <button
                        onClick={handleClose}
                        className="text-sm px-3 py-1.5 min-w-[3vw] rounded-lg border border-gray-300 text-gray-600 hover:bg-gray-100 transition"
                    >
                        Batal
                    </button>
                </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 text-center bg-gray-50 rounded-b-2xl">
                <p className="text-xs text-gray-500 leading-relaxed">
                    <span className="font-bold">Petunjuk:</span> pilih satu
                    atau lebih layer daerah pada map yang ingin ditampilkan pada peta.
                </p>
            </div>
        </div>
    )
}
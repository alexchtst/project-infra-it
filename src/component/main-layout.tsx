import React from "react";
import ModalWrapper from "./modal-wrapper";

export function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col w-full min-h-screen">

            <div className="flex-grow">
                {children}
            </div>

            <ModalWrapper
                listcontent={[]}
            />

        </div>
    )
};
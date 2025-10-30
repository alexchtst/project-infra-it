"use client";

import React from "react";
import { ModalContext, ModalKindEnum } from "@/context-provider/modal-provider"

export interface ModalWrapperInterface {
    name: ModalKindEnum;
    component: React.ReactNode;
}

export default function ModalWrapper({ listcontent }: { listcontent: ModalWrapperInterface[] }) {
    const { modalKind } = React.useContext(ModalContext);
    return (
        <div className={`${modalKind === null ? 'hidden' : 'fixed inset-0 bg-white/40 z-[100] flex items-center justify-center'}`}>
            {listcontent.find(c => c.name === modalKind)?.component}
        </div>
    );
}
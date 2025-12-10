/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import { MainLayout } from "@/component/main-layout";
import { ModalContext } from "@/context-provider/modal-provider";
import React from "react";

export default function InsightPage() {
    const { setModalKind } = React.useContext(ModalContext);
    
    React.useEffect(() => {
        setModalKind(null)
    }, [])

    return (
        <MainLayout>
            <div>Insight Page</div>
        </MainLayout>
    )
}
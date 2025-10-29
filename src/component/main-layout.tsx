"use client"

import React from "react";
import ModalWrapper from "./modal-wrapper";
import DrawerWrapper from "./drawer-wrapper";
import { ModalKindEnum } from "@/context-provider/modal-provider";
import ModalOption from "./map-screen/modal/modal-options";
import { DrawerEnum } from "@/context-provider/drawer-provider";
import DrawerOption from "./map-screen/drawer/drawer-option";

export function MainLayout({ children }: { children: React.ReactNode }) {

    return (
        <div className="flex flex-col w-full min-h-screen">

            <div className="flex-grow">
                {children}
            </div>

            <ModalWrapper
                listcontent={[
                    { name: ModalKindEnum.option, component: <ModalOption /> }
                ]}
            />

            <DrawerWrapper
                listcontent={[
                    { name: DrawerEnum.statistic, component: <DrawerOption /> }
                ]}
            />

        </div>
    )
};
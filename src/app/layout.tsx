import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataFlowProvider } from "@/context-provider/data-flow-provider";
import { ModalProvider } from "@/context-provider/modal-provider";
import { DrawerProvider } from "@/context-provider/drawer-provider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Infrastruktur IT",
  description: "Visualisasi Infrastruktur IT KUTA",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`} suppressHydrationWarning={true}
      >
        <DataFlowProvider>
          <ModalProvider>
            <DrawerProvider>
              {children}
            </DrawerProvider>
          </ModalProvider>
        </DataFlowProvider>
      </body>
    </html>
  );
}

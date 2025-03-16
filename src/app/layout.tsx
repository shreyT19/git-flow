import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/ModalProvider";

export const metadata: Metadata = {
  title: "Git Flow",
  description: "Streamline Git Workflow Automation",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <ClerkProvider>
      <html lang="en" className={`${GeistSans.variable}`}>
        <body>
          <ModalProvider>
            <Toaster
              richColors
              closeButton
              position="top-right"
              duration={3500}
            />
            <TRPCReactProvider>{children}</TRPCReactProvider>
          </ModalProvider>
        </body>
      </html>
    </ClerkProvider>
  );
}

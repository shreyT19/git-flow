import "@/styles/globals.css";
import { GeistSans } from "geist/font/sans";
import { type Metadata } from "next";
import { TRPCReactProvider } from "@/trpc/react";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "sonner";
import { ModalProvider } from "@/providers/ModalProvider";
import Transition from "@/providers/TransitionProvider";
import { NuqsAdapter } from "nuqs/adapters/next/app";

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
          <NuqsAdapter>
            <ModalProvider>
              <Toaster richColors position="top-center" duration={1500} />
              <Transition>
                <TRPCReactProvider>{children}</TRPCReactProvider>
              </Transition>
            </ModalProvider>
          </NuqsAdapter>
        </body>
      </html>
    </ClerkProvider>
  );
}

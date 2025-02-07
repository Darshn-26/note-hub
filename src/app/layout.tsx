import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import SideBar from "@/components/SideBar";
import { Toaster } from "sonner";



export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
    <html lang="en">
      <body>
        <Header/>

        <div className="flex min-h-screen">
          <SideBar/>
            <div className="flex-1 p-4 bg-gray-100 overflow-y-auto scrollr-hide">
              {children}</div>
        </div>
        <Toaster position="bottom-center" />
      </body>
    </html>
    </ClerkProvider>
  );
}

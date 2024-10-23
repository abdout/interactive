import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { SessionProvider } from 'next-auth/react'
import { auth } from '../../auth'
import "./globals.css";
import Navbar from "@/components/x/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Lama Dev Social Media App",
  description: "Social media app built with Next.js",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth();
  
  return (
    <SessionProvider session={session}>
      <html lang="en">
        <body className={inter.className}>
          <div className="w-full bg-white px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            <Navbar />
          </div>
          <div className=" bg-slate-100 px-4 md:px-8 lg:px-16 xl:px-32 2xl:px-64">
            {children}
          </div>
        </body>
      </html>
      </SessionProvider>
  );
}

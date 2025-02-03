import { Inter } from 'next/font/google';
import type { Metadata } from "next";
import "./globals.css";


const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'], 
});

export const metadata: Metadata = {
  title: "Task Flow",
  description: "Created By Harsh",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
      </body>
    </html>
  );
}

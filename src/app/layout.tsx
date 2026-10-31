import type { Metadata } from "next";
import "./globals.css";
import Navbar from "../components/layout/Navber";

export const metadata: Metadata = {
  title: "বাজার দর | বাংলাদেশের দৈনিক বাজারদর",
  description: "বাংলাদেশের নিত্যপ্রয়োজনীয় পণ্যের বাজারদর দেখুন।",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body>
      <Navbar/>
        
        <main>{children}</main>
      </body>
    </html>
  );
}
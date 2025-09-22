import type { Metadata } from "next";
import { Ultra, Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/components/UserProvider";

const ultra = Ultra({
  variable: '--font-ultra',
  subsets: ["latin"],
  weight: '400',
  preload: true,
  adjustFontFallback: true,
});

const inter = Inter({
  variable: '--font-inter',
  subsets: ["latin"],
  preload: true,
  adjustFontFallback: true,
});

export const metadata: Metadata = {
  title: "Livest – Find Your Next Rental Home Easily",
  description:
    "Livest is a modern real estate rental app that helps you discover apartments, houses, and properties for rent with ease. Browse verified listings, compare prices, and connect with landlords instantly.",
  keywords: [
    "real estate rentals",
    "rental apartments",
    "houses for rent",
    "property rental platform",
    "Livest app",
    "rent a flat",
    "student housing",
    "affordable rentals",
    "apartment finder",
  ],
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${ultra.variable} ${inter.variable} antialiased`}
      >
        <UserProvider>
          {children}
        </UserProvider>
        <Toaster />
      </body>
    </html>
  );
}

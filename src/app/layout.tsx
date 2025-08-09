import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "JumpSquare - Know When the Scares Are Coming",
  description:
    "The ultimate database of movie jumpscares. Watch horror movies with confidence or avoid the scares entirely.",
  keywords: ["horror movies", "jumpscares", "movie database", "scary movies"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}

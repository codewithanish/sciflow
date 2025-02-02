import type { Metadata } from "next";
import { Geist} from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const SFProDisplay = localFont({ src: "./fonts/SF-Pro-Display-Regular.otf" });

export const metadata: Metadata = {
  title: "SciOly Event Assignment Bot",
  description:
    "Optimize Science Olympiad team performance with our intelligent event assignment tool. Efficiently match students to competitions using advanced sorting algorithms for better results.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.className} antialiased`}>
        {children}
      </body>
    </html>
  );
}

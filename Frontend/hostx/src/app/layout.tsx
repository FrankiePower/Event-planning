// layout.tsx
import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Navbar from "@/components/micros/Navbar";
import Footer from "@/components/micros/Footer";
import BackgroundWrapper from "@/components/micros/BackgroundWrapper";
import Providers from "@/context/Providers";
import "@rainbow-me/rainbowkit/styles.css";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { UrlProvider } from "@/context/UrlContext";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <Providers>
          <BackgroundWrapper>
            <RainbowKitProvider modalSize="compact">
              <Navbar />
              <UrlProvider>{children}</UrlProvider>

              <Footer />
            </RainbowKitProvider>
          </BackgroundWrapper>{" "}
        </Providers>
      </body>
    </html>
  );
}

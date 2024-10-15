// components/BackgroundWrapper.tsx
"use client";

import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function BackgroundWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  let landingGradient = "";

  switch (pathname) {
    case "/events":
      landingGradient = "from-red-600/90 via-red-800 to-red-950";
      break;
    case "/create":
      landingGradient = "from-blue-400 via-blue-600 to-blue-800";
      break;
    default:
      landingGradient = "from-stone-600/90 via-stone-800 to-stone-950";
  }

  return (
    <div className={`bg-gradient-to-b ${landingGradient} min-h-screen`}>
      {children}
    </div>
  );
}